const logger = require('../config/logger');
const { Driver, User } = require('../models/index');
const { decodeAccessToken, isAccessTokenBlacklisted } = require('../services/token.service');
const { registerDriverSocket } = require('../services/websocket/driver');


const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.headers.token;

    if (!token) {
      logger.warn('[AuthMiddleware] Authentication failed: No token provided');
      return next(new Error('Authentication error: No token provided'));
    }

    if (await isAccessTokenBlacklisted(token)) {
      logger.warn('[AuthMiddleware] Authentication failed: Token is blacklisted');
      return next(new Error('Authentication error: Token is blacklisted'));
    }

    const user = await decodeAccessToken(token);


    const driver = await Driver.findOne({
      where: { userId: user.userId }
    });

    socket.user = user;
    logger.info(`[AuthMiddleware] User ${user.userId} authenticated successfully`);

    if (driver) {
      socket.driver = driver;
      await driver.update({
        status: 'AVAILABLE'
      });
      logger.info(`[AuthMiddleware] Driver ${driver.id} authenticated successfully`);
      registerDriverSocket(driver.id, socket);
    }
    next();
  } catch (error) {
    logger.error(`[AuthMiddleware] Authentication error: ${error.message}`);
    next(new Error('Authentication error: Invalid token'));
  }
}


const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || await isAccessTokenBlacklisted(token)) {
    logger.warn('[AuthMiddleware] Authentication failed: Invalid or expired token');
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  try {
    const user = await decodeAccessToken(token);
    const userObj = await User.findOne({ where: { id: user.userId } });
    logger.info(`[AuthMiddleware] User ${user.userId} authenticated successfully`);
    req.user = user;
    req.roles = userObj.roles;
    req.accessToken = token;
    next();
  } catch (err) {
    logger.warn(`[AuthMiddleware] Authentication failed: Invalid or expired token - ${err.message}`);
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const activeRole = req.roles;

      if (!activeRole) {
        return res.status(400).json({ message: 'Missing role in header (x-role)' });
      }

      const userId = req.user.userId; // đã được gán từ middleware authenticate
      const user = await User.findOne({ where: { id: userId } });
      if (!user.roles.includes(activeRole)) {
        return res.status(403).json({ message: 'Role not assigned to user' });
      }

      if (!allowedRoles.includes(activeRole)) {
        return res.status(403).json({ message: 'You do not have permission with this role' });
      }

      // Nếu hợp lệ, gán vào req để controller dùng nếu cần
      req.activeRole = activeRole;
      next();
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

module.exports = { authenticateToken, authenticateSocket, checkRole };