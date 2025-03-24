const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const logger = require('../config/logger');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 m
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

const generateAccessToken = (user) => {
    logger.info(`[TokenService] Generating access token for user ${user.id}`);
    return jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = async (user) => {
    logger.info(`[TokenService] Generating refresh token for user ${user.id}`);
    const token = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    try {
        await redisClient.setEx(`refresh_token:${user.id}`, REFRESH_TOKEN_EXPIRY, token);
        logger.info(`[TokenService] Refresh token stored in Redis for user ${user.id}`);
    } catch (error) {
        logger.error(`[TokenService] Failed to store refresh token in Redis for user ${user.id}: ${error.message}`);
        throw error;
    }
    return token;
};

const verifyRefreshToken = async (userId) => {
    logger.info(`[TokenService] Verifying refresh token for user ${userId}`);
    try {
        const token = await redisClient.get(`refresh_token:${userId}`);
        if (!token) {
            logger.warn(`[TokenService] No refresh token found in Redis for user ${userId}`);
            return false;
        }
        jwt.verify(token, REFRESH_TOKEN_SECRET);
        logger.info(`[TokenService] Refresh token verified successfully for user ${userId}`);
        return true;
    } catch (err) {
        logger.warn(`[TokenService] Refresh token verification failed for user ${userId}: ${err.message}`);
        return false;
    }
};

const clearRefreshToken = async (userId) => {
    logger.info(`[TokenService] Clearing refresh token for user ${userId}`);
    try {
        await redisClient.del(`refresh_token:${userId}`);
        logger.info(`[TokenService] Refresh token cleared successfully for user ${userId}`);
    } catch (error) {
        logger.error(`[TokenService] Failed to clear refresh token for user ${userId}: ${error.message}`);
        throw error;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    clearRefreshToken,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
};