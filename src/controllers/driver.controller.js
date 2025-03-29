const logger = require("../config/logger");
const { Driver } = require("../models/index");

const registerDriver = async (req, res) => {

    const {
        license_number,
        vehicle_type,
        vehicle_plate
    } = req.body;

    // Assuming user is authenticated and user ID is available from middleware
    const userId = req.user.userId; // This assumes you have authentication middleware setting req.user
    logger.info(`[DriverController] Driver registration attempt for user: ${userId}`);

    try {
        // Check if user is already registered as driver
        const existingDriver = await Driver.findOne({ where: { user_id: userId } });
        if (existingDriver) {
            return res.status(400).json({
                success: false,
                message: 'User is already registered as a driver'
            });
        }

        // Create Driver record
        const driver = await Driver.create({
            userId,
            licenseNumber: license_number,
            vehicleType: vehicle_type,
            vehiclePlate: vehicle_plate,
        });

        return res.status(201).json({
            success: true,
            message: 'Driver registration successful',
            data: {
                driver: {
                    id: driver.id,
                    license_number: driver.licenseNumber,
                    vehicle_type: driver.vehicleType,
                    vehicle_plate: driver.vehiclePlate,
                    status: driver.status,
                    approvalStatus: driver.approvalStatus
                }
            }
        });
    } catch (error) {
        logger.error(`[DriverController] Registration failed for user ${userId}: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Driver registration failed',
            error: error.message
        });
    }
};

module.exports = {
    registerDriver
};