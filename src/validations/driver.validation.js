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
        .min(5)
        .max(15)
        .pattern(/^[A-Za-z0-9-\s]+$/)
        .messages({
            'string.min': 'Vehicle plate must be at least 5 characters long',
            'string.max': 'Vehicle plate cannot exceed 15 characters',
            'string.pattern.base': 'Vehicle plate can only contain letters, numbers, hyphens, and spaces'
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

const assessDriverRegisterSchema = Joi.object({
    approvalStatus: Joi.string()
        .valid('APPROVED', 'REJECTED', 'BANNED')
        .required()
        .messages({ 'any.required': 'Approval status is required' })
});

module.exports = {
    driverSchema,
    createDriverSchema,
    updateDriverSchema,
    assessDriverRegisterSchema
};