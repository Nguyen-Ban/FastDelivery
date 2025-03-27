const logger = require("../config/logger");
const { getAllDrivers, getDriverById, updateDriverApprovalStatus } = require("../services/driver.service");

const getDriverList = async (req, res) => {
    logger.info(`[AdminController] Getting driver list`);
    try {
        const drivers = await getAllDrivers();
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
        const driver = await getDriverById(req.params.id);
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

const patchDriverApprovalStatus = async (req, res) => {
    logger.info(`[AdminController] Assessing driver registration: ${req.params.id}`);
    try {
        const driver = await updateDriverApprovalStatus(req.params.id, req.body.approval_status);
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

module.exports = { getDriverList, fetchDriverById, patchDriverApprovalStatus };
