const logger = require('../config/logger');
const { Driver } = require('../models/index');

const createDriver = async (driverData) => {
    logger.info(`[DriverService] Creating driver: ${driverData}`);
    return await Driver.create(driverData);
};

const getDriverByUserId = async (userId) => {
    logger.info(`[DriverService] Getting driver by user id: ${userId}`);
    return await Driver.findOne({ where: { user_id: userId } });
};

const getAllDrivers = async () => {
    logger.info(`[DriverService] Getting all drivers`);
    return await Driver.findAll();
};

const getDriverById = async (id) => {
    logger.info(`[DriverService] Getting driver by id: ${id}`);
    return await Driver.findByPk(id);
};

const updateDriverApprovalStatus = async (id, approvalStatus) => {
    logger.info(`[DriverService] Updating driver approval status: ${id}`);
    const driver = await Driver.findByPk(id);
    if (!driver) {
        return null;
    }
    return await Driver.update({ approvalStatus }, { where: { id } });
};

module.exports = {
    createDriver,
    getDriverByUserId,
    getAllDrivers,
    getDriverById,
    updateDriverApprovalStatus
};
