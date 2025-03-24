const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../services/token.service');
const logger = require('../config/logger');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn('[AuthMiddleware] Authentication failed: No access token provided');
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            logger.warn(`[AuthMiddleware] Authentication failed: Invalid or expired token - ${err.message}`);
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
        logger.info(`[AuthMiddleware] User ${user.id} authenticated successfully`);
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };