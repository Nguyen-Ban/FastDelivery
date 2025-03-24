const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    // Log the full error stack trace
    logger.error(`[ErrorMiddleware] Error occurred: ${err.message}\nStack trace: ${err.stack}`);

    // Handle Sequelize errors
    if (err.name === 'SequelizeValidationError') {
        logger.warn(`[ErrorMiddleware] Validation error: ${JSON.stringify(err.errors)}`);
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        logger.warn(`[ErrorMiddleware] Duplicate entry error: ${JSON.stringify(err.errors)}`);
        return res.status(400).json({
            success: false,
            message: 'Duplicate entry',
            errors: err.errors.map(e => ({
                field: e.path,
                message: `${e.path} already exists`
            }))
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        logger.warn(`[ErrorMiddleware] JWT error: ${err.message}`);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    // Default error
    logger.error(`[ErrorMiddleware] Unhandled error: ${err.message}`);
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = errorHandler; 