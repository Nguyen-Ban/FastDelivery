const logger = require('../config/logger');
const { User } = require('../models/index');

const createUser = async (userData) => {
    logger.info(`[UserService] Creating user: ${userData}`);
    return await User.create(userData);

};

const getUserByPhoneNumber = async (phoneNumber) => {
    logger.info(`[UserService] Getting user by phone number: ${phoneNumber}`);
    return await User.findOne({ phoneNumber });
};

const getUserById = async (userId) => {
    logger.info(`[UserService] Getting user by id: ${userId}`);
    return await User.findById(userId);
};

const comparePasscode = async (user, passcode) => {
    logger.info(`[UserService] Comparing passcode for user: ${user.id}`);
    return await user.comparePasscode(passcode);
};

module.exports = {
    createUser,
    getUserByPhoneNumber,
    getUserById,
    comparePasscode
};
