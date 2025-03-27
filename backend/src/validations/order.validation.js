const Joi = require('joi');

const orderSchema = Joi.object({
    pickupAddress: Joi.string()
        .required()
        .max(255)
        .messages({
            'string.base': 'Pickup address must be a string',
            'any.required': 'Pickup address is required',
            'string.max': 'Pickup address cannot exceed 255 characters'
        }),
    dropoffAddress: Joi.string()
        .required()
        .max(255)
        .messages({
            'string.base': 'Dropoff address must be a string',
            'any.required': 'Dropoff address is required',
            'string.max': 'Dropoff address cannot exceed 255 characters'
        }),
    pickupLat: Joi.number()
        .required()
        .min(-90)
        .max(90)
        .precision(6)
        .messages({
            'number.base': 'Pickup latitude must be a number',
            'any.required': 'Pickup latitude is required',
            'number.min': 'Pickup latitude must be between -90 and 90',
            'number.max': 'Pickup latitude must be between -90 and 90',
            'number.precision': 'Pickup latitude must have no more than 6 decimal places'
        }),
    pickupLng: Joi.number()
        .required()
        .min(-180)
        .max(180)
        .precision(6)
        .messages({
            'number.base': 'Pickup longitude must be a number',
            'any.required': 'Pickup longitude is required',
            'number.min': 'Pickup longitude must be between -180 and 180',
            'number.max': 'Pickup longitude must be between -180 and 180',
            'number.precision': 'Pickup longitude must have no more than 6 decimal places'
        }),
    dropoffLat: Joi.number()
        .required()
        .min(-90)
        .max(90)
        .precision(6)
        .messages({
            'number.base': 'Dropoff latitude must be a number',
            'any.required': 'Dropoff latitude is required',
            'number.min': 'Dropoff latitude must be between -90 and 90',
            'number.max': 'Dropoff latitude must be between -90 and 90',
            'number.precision': 'Dropoff latitude must have no more than 6 decimal places'
        }),
    dropoffLng: Joi.number()
        .required()
        .min(-180)
        .max(180)
        .precision(6)
        .messages({
            'number.base': 'Dropoff longitude must be a number',
            'any.required': 'Dropoff longitude is required',
            'number.min': 'Dropoff longitude must be between -180 and 180',
            'number.max': 'Dropoff longitude must be between -180 and 180',
            'number.precision': 'Dropoff longitude must have no more than 6 decimal places'
        }),
    price: Joi.number()
        .required()
        .positive()
        .precision(2)
        .messages({
            'number.base': 'Price must be a number',
            'any.required': 'Price is required',
            'number.positive': 'Price must be a positive number',
            'number.precision': 'Price must have no more than 2 decimal places'
        }),
    status: Joi.string()
        .required()
        .valid('PENDING', 'ASSIGNED', 'PICKED_UP', 'DELIVERED', 'CANCELLED')
        .default('PENDING')
        .messages({
            'any.only': 'Status must be one of PENDING, ASSIGNED, PICKED_UP, DELIVERED, CANCELLED'
        }),
    customerId: Joi.number().required(),
    driverId: Joi.number().required(),
});

const orderDetailSchema = Joi.object({
    packageType: Joi.string().required(),
    weightKg: Joi.number().required(),
    size: Joi.string().required(),
    deliveryInsurance: Joi.boolean().required(),
});

const orderAddonSchema = Joi.object({
    doorToDoor: Joi.boolean().required(),
    bulkyDelivery: Joi.boolean().required(),
});

const placeOrderValidation = Joi.object({
    order: orderSchema.required(),
    orderDetail: orderDetailSchema.required(),
    orderAddon: orderAddonSchema.required(),
});

module.exports = { placeOrderValidation };



