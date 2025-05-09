const Joi = require('joi');

const driverSchema = {
    licenseNumber: Joi.string()
        .min(6)
        .max(20)
        .pattern(/^[A-Za-z0-9-]+$/)
        .messages({
            'string.min': 'License number must be at least 6 characters long',
            'string.max': 'License number cannot exceed 20 characters',
            'string.pattern.base': 'License number can only contain letters, numbers, and hyphens'
        }),

    vehicleType: Joi.string()
        .valid('MOTORBIKE', 'VAN')
        .messages({
            'any.only': 'Vehicle type must be one of MOTORBIKE or VAN'
        }),
    vehiclePlate: Joi.string()
        .pattern(/^[0-9]{2}[A-Z0-9]{1,2}-[0-9]{3}\.[0-9]{2}$/i)
        .messages({
            'string.pattern.base': 'Biển số xe không đúng định dạng. Ví dụ: 29Y1-123.45'
        })
};

const createDriverSchema = Joi.object({
    licenseNumber: driverSchema.licenseNumber.required()
        .messages({ 'any.required': 'License number is required' }),
    vehicleType: driverSchema.vehicleType.required()
        .messages({ 'any.required': 'Vehicle type is required' }),
    vehiclePlate: driverSchema.vehiclePlate.required()
        .messages({ 'any.required': 'Vehicle plate is required' })
});

const updateDriverSchema = Joi.object({
    licenseNumber: driverSchema.licenseNumber,
    vehicleType: driverSchema.vehicleType,
    vehiclePlate: driverSchema.vehiclePlate
});

const reviewDriverSchema = Joi.object({
    orderId: Joi.number()
        .integer()
        .required(),

    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required(),

    comment: Joi.string()
        .max(500)
        .allow('')
});

module.exports = {
    driverSchema,
    createDriverSchema,
    updateDriverSchema,
    reviewDriverSchema
};