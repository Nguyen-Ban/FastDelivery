const logger = require('../config/logger');
const { decodeAccessToken, isAccessTokenBlacklisted } = require('../services/token.service');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || await isAccessTokenBlacklisted(token)) {
        logger.warn('[AuthMiddleware] Authentication failed: Invalid or expired token');
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    try {
        const user = await decodeAccessToken(token);
        logger.info(`[AuthMiddleware] User ${user.userId} authenticated successfully`);
        req.user = user;
        req.accessToken = token;
        next();
    } catch (err) {
        logger.warn(`[AuthMiddleware] Authentication failed: Invalid or expired token - ${err.message}`);
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};

module.exports = { authenticateToken };