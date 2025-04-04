const Joi = require('joi');

const orderSchema = Joi.object({
    pickup_address: Joi.string()
        .required()
        .max(255)
        .messages({
            'string.base': 'Pickup address must be a string',
            'any.required': 'Pickup address is required',
            'string.max': 'Pickup address cannot exceed 255 characters'
        }),
    dropoff_address: Joi.string()
        .required()
        .max(255)
        .messages({
            'string.base': 'Dropoff address must be a string',
            'any.required': 'Dropoff address is required',
            'string.max': 'Dropoff address cannot exceed 255 characters'
        }),
    pickup_lat: Joi.number()
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
    pickup_lng: Joi.number()
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
    dropoff_lat: Joi.number()
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
    dropoff_lng: Joi.number()
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
        })
});

const orderDetailSchema = Joi.object({
    package_type: Joi.string().valid('DOCUMENT', 'ELECTRONICS', 'FOOD', 'CLOTHING', 'FRAGILE', 'OTHERS').required(),
    weight_kg: Joi.number().required(),
    size: Joi.string().valid('SMALL', 'MEDIUM', 'LARGE', 'X-LARGE').required(),
    delivery_insurance: Joi.string().valid('NO_INSURANCE', 'STANDARD', 'SILVER', 'GOLD').required(),
});

const orderAddonSchema = Joi.object({
    door_to_door: Joi.boolean().required(),
    bulky_delivery: Joi.boolean().required(),
});

const placeOrderValidation = Joi.object({
    order: orderSchema.required(),
    order_detail: orderDetailSchema.required(),
    order_addon: orderAddonSchema.required(),
});

const getOrderListValidation = Joi.object({
    pickup_lat: Joi.number().required(),
    pickup_lng: Joi.number().required(),
    dropoff_lat: Joi.number().required(),
    dropoff_lng: Joi.number().required(),
});

module.exports = { placeOrderValidation, getOrderListValidation };



