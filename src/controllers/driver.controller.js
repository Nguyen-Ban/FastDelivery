const logger = require("../config/logger");
const { Driver, User } = require("../models/index");
const { sequelize } = require("../config/database");

const autoAcceptOrder = async (req, res) => {
    const { request_id } = req.params;
    const driverWebSocket = new DriverWebSocketService();

}

const registerDriver = async (req, res) => {

    const {
        licenseNumber,
        vehicleType,
        vehiclePlate
    } = req.body;

    // Assuming user is authenticated and user ID is available from middleware
    const userId = req.userId; // This assumes you have authentication middleware setting req.user
    logger.info(`[DriverController] Driver registration attempt for user: ${userId}`);

    const t = await sequelize.transaction(); // bắt đầu transaction

    try {
        // Check if user is already registered as driver
        const existingDriver = await Driver.findOne({ where: { user_id: userId }, transaction: t });

        // Create Driver record
        const driver = await Driver.create({
            userId,
            licenseNumber,
            vehicleType,
            vehiclePlate,
        }, { transaction: t });

        const newRoles = ['CUSTOMER', 'DRIVER']; // ví dụ role mới

        const user = await User.findByPk(userId, { transaction: t });
        await user.update({ roles: newRoles }, { transaction: t })

        await t.commit(); // hoàn tất transaction

        return res.status(201).json({
            success: true,
            message: 'Driver registration successful',
            data: {
                driver: {
                    id: driver.id,
                    licenseNumber: driver.licenseNumber,
                    vehicleType: driver.vehicleType,
                    vehiclePlate: driver.vehiclePlate,
                    status: driver.status,
                    approvalStatus: driver.approvalStatus
                }
            }
        });
    } catch (error) {
        await t.rollback(); // rollback nếu có lỗi

        logger.error(`[DriverController] Registration failed for user ${userId}: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Driver registration failed',
            error: error.message
        });
    }
};

const getDriverList = async (req, res) => {
    logger.info(`[DriverController] Getting driver list`);
    try {
        const drivers = await Driver.findAll();
        res.status(200).json({
            success: true,
            message: 'Driver list fetched successfully',
            data: drivers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Driver list fetch failed',
            error: error.message
        });
    }
};

const fetchDriverById = async (req, res) => {
    const { id: driverId } = req.params;
    logger.info(`[DriverController] Getting driver by id: ${driverId}`);
    try {
        const driver = await Driver.findOne({ where: { id: driverId } });
        res.status(200).json({
            success: true,
            message: 'Driver fetched successfully',
            data: driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Driver fetch failed',
            error: error.message
        });
    }
};

const approveDriverRegister = async (req, res) => {
    const { id: driverId } = req.params;
    logger.info(`[DriverController] Approving register of driver id: ${driverId}`);

    try {
        const driver = await Driver.findByPk(driverId);
        await driver.update({ approvalStatus: "APPROVED" });
        res.status(200).json({
            success: true,
            message: 'Driver Registration approved'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Driver Registration Approval failed',
            error: error.message
        });
    }
};

const rejectDriverRegister = async (req, res) => {
    const { id: driverId } = req.params;
    logger.info(`[DriverController] Rejecting register of driver id: ${driverId}`);

    try {
        const driver = await Driver.update({ approvalStatus: 'REJECTED' }, { where: { id: driverId } });
        if (!driver) {
            return res.status(400).json({
                success: false,
                message: 'Driver Registration Reject failed',
                error: 'Driver not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Driver Registration rejected'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Driver Registration Reject failed',
            error: error.message
        });
    }
};

const banDriver = async (req, res) => {
    const { id: driverId } = req.params;
    logger.info(`[DriverController] Banning driver id: ${driverId}`);

    try {
        const driver = await Driver.update({ approvalStatus: 'BANNED' }, { where: { id: driverId } });
        if (!driver) {
            return res.status(400).json({
                success: false,
                message: 'Driver Banning failed',
                error: 'Driver not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Driver Banned'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Driver Banning failed',
            error: error.message
        });
    }
};

module.exports = {
    registerDriver,
    getDriverList,
    fetchDriverById,
    approveDriverRegister,
    rejectDriverRegister,
    banDriver
};