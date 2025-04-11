const logger = require("../config/logger");
const { Driver } = require("../models/index");

const getDriverList = async (req, res) => {
    logger.info(`[AdminController] Getting driver list`);
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
    logger.info(`[AdminController] Getting driver by id: ${req.params.id}`);
    try {
        const driver = await Driver.findOne({ where: { id: req.params.id } });
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

const assessDriverRegister = async (req, res) => {
    const { id } = req.params;
    const { approval_status } = req.body;
    logger.info(`[AdminController] Assessing driver registration: ${id}`);

    try {
        const driver = await Driver.update({ approvalStatus: approval_status }, { where: { id } });
        if (!driver) {
            return res.status(400).json({
                success: false,
                message: 'Driver status update failed',
                error: 'Driver not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Driver status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Driver status update failed',
            error: error.message
        });
    }
};

module.exports = { getDriverList, fetchDriverById, assessDriverRegister };
