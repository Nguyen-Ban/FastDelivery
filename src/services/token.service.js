const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const logger = require('../config/logger');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

const generateAccessToken = async (userId) => {
    logger.info(`[TokenService] Generating access token for user ${userId}`);
    const token = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    return token;
};

const generateRefreshToken = async (userId) => {
    logger.info(`[TokenService] Generating refresh token for user ${userId}`);
    const token = jwt.sign({ userId: userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    await redisClient.set(`refresh_token:${userId}`, token, 'EX', REFRESH_TOKEN_EXPIRY);
    logger.info(`[TokenService] Refresh token stored in Redis for user ${userId}`);
    return token;
};

const verifyRefreshToken = async (refreshToken) => {
    logger.info(`[TokenService] Verify refresh token`);
    const decoded = await decodeRefreshToken(refreshToken);
    const storedToken = await redisClient.get(`refresh_token:${decoded.userId}`);
    if (storedToken !== refreshToken) {
        return null;
    }
    return decoded;
};

const userHasRefreshToken = async (userId) => {
    const storedToken = await redisClient.get(`refresh_token:${userId}`);
    return storedToken !== null;
};

const decodeAccessToken = async (token) => {
    logger.info(`[TokenService] Decode access token`);
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

const decodeRefreshToken = async (token) => {
    logger.info(`[TokenService] Decode refresh token`);
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

const blacklistAccessToken = async (token) => {
    logger.info(`[TokenService] Blacklist access token`);
    const decoded = await decodeAccessToken(token);
    const remainingTime = decoded.exp - Math.floor(Date.now() / 1000);
    await redisClient.set(`blacklist_access_token:${token}`, 'true', 'EX', remainingTime);
};

const isAccessTokenBlacklisted = async (token) => {
    const result = await redisClient.get(`blacklist_access_token:${token}`);
    return result === 'true';
};

const clearRefreshToken = async (userId) => {
    logger.info(`[TokenService] Clear refresh token for user ${userId}`);
    await redisClient.del(`refresh_token:${userId}`);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    decodeAccessToken,
    decodeRefreshToken,
    verifyRefreshToken,
    userHasRefreshToken,
    blacklistAccessToken,
    isAccessTokenBlacklisted,
    clearRefreshToken,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
};