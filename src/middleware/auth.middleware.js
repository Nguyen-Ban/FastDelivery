const logger = require('../config/logger');
const { Driver, User } = require('../models/index');
const { decodeAccessToken, isAccessTokenBlacklisted } = require('../services/token.service');
const { registerSocket } = require('../services/websocket/driver');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || await isAccessTokenBlacklisted(token)) {
    logger.warn('[AuthMiddleware] Authentication failed: Invalid or expired token');
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  try {
    const { userId } = await decodeAccessToken(token);
    logger.info(`[AuthMiddleware] User id ${userId} authenticated successfully`);
    req.userId = userId;
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
      const activeRole = req.headers['role'];
      console.log('activeRole', activeRole);
      if (!activeRole) {
        return res.status(400).json({ message: 'Missing role in header (role)' });
      }

      if (!allowedRoles.includes(activeRole)) {
        return res.status(403).json({ message: 'You do not have permission with this role' });
      }

      const userId = req.userId; // đã được gán từ middleware authenticate
      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.roles.includes(activeRole)) {
        return res.status(403).json({ message: 'Role not assigned to user' });
      }

      // Nếu hợp lệ, gán vào req để controller dùng nếu cần
      req.activeRole = activeRole;
      next();
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.headers.token;

    if (!token) {
      logger.warn('[AuthMiddleware] Authentication socket failed: No token provided');
      return next(new Error('Authentication socket error: No token provided'));
    }

    if (await isAccessTokenBlacklisted(token)) {
      logger.warn('[AuthMiddleware] Authentication socket failed: Token is blacklisted');
      return next(new Error('Authentication socket error: Token is blacklisted'));
    }

    const { userId } = await decodeAccessToken(token);

    socket.userId = userId;
    logger.info(`[AuthMiddleware] User Id ${userId} socket authenticated successfully`);

    next();
  } catch (error) {
    logger.error(`[AuthMiddleware] Authentication socket error: ${error.message}`);
    next(new Error('Authentication socket error: Invalid token'));
  }
}

const checkSocketRole = (allowedRoles) => {
  return async (socket, next) => {
    try {

      const activeRole = socket.handshake.headers.role;

      if (!activeRole) {
        return next(new Error('Missing role in socket headers (role)'));
      }
      console.log('activeRole', allowedRoles, activeRole);

      if (!allowedRoles.includes(activeRole)) {
        return next(new Error('Permission denied for this role'));
      }

      const userId = socket.userId; // đã được gán từ middleware authenticate
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return next(new Error('User not found'));
      }

      if (!user.roles.includes(activeRole)) {
        return next(new Error('Role not assigned to user'));
      }

      registerSocket(userId, socket);

      if (activeRole == 'DRIVER') {
        const driver = await Driver.findOne({
          where: { userId }
        });

        if (!driver) {
          return next(new Error('Driver not found'));
        }

        await driver.update({
          status: 'AVAILABLE'
        });
        logger.info(`[AuthMiddleware] Driver ${driver.userId} authenticated successfully`);
      }
      // Gắn activeRole vào socket để dùng trong listener nếu cần
      socket.activeRole = activeRole;

      next(); // Cho phép kết nối tiếp
    } catch (err) {
      console.error('[Socket checkRole error]', err.message);
      next(new Error('Internal Server Error'));
    }
  };
};


module.exports = { authenticateToken, authenticateSocket, checkRole, checkSocketRole };