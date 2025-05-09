const logger = require("../config/logger");
const { Driver, User, Review, Order } = require("../models/index");
const { sequelize } = require("../config/database");
const { messaging } = require("firebase-admin");


const reviewDriver = async (req, res) => {
    const { orderId, rating, comment } = req.body;
    logger.info(`Reviewing driver with order id: ${orderId}`);
    try {
        const order = await Order.findByPk(orderId);
        if (order.status !== 'DELIVERED') {
            throw new Error('Order has not been completed yet!');
        }
        const review = await Review.create({ orderId, rating, comment });
        return res.status(200).json({
            success: true,
            message: "Review driver successfully",
            data: {
                rating: review.rating,
                comment: review.comment
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Review driver failed",
            error: error.message
        })
    }
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

const assessDriverAuth = async (req, res) => {
    const { id: driverId } = req.params;
    const { action } = req.query;
    logger.info(`[DriverController] Assess authorization of driver id: ${driverId}`);

    try {
        const driver = await Driver.findByPk(driverId);
        if (action == 'approve') approvalStatus = "APPROVED"
        else if (action == 'reject') approvalStatus = "REJECTED"
        else if (action == 'ban') approvalStatus = "BANNED"
        await driver.update({ approvalStatus });
        res.status(200).json({
            success: true,
            message: 'Assess driver authorization successfully',
            data: {
                approvalStatus: driver.approvalStatus
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Assess driver authorization failed',
            error: error.message
        });
    }
};

module.exports = {
    reviewDriver,
    registerDriver,
    getDriverList,
    fetchDriverById,
    assessDriverAuth
};