const Joi = require('joi');
const { userSchema, createUserSchema } = require('./user.validation');

const phoneSchema = Joi.object({
    phone: userSchema.phone.required()
        .messages({ 'any.required': 'Phone number is required' })
});

const loginSchema = Joi.object({
    phone: userSchema.phone.required(),
    passcode: userSchema.passcode.required()
        .messages({ 'any.required': 'Passcode is required' })
});

const otpSchema = Joi.object({
    phone: userSchema.phone.required(),
    otp: Joi.string().length(6).required()
        .messages({ 'string.length': 'OTP must be 6 digits' })
});

const registerSchema = createUserSchema;

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required()
        .messages({ 'any.required': 'Refresh token is required' })
});

const logoutSchema = Joi.object({
    userId: Joi.string().required()
        .messages({ 'any.required': 'User ID is required' })
});

module.exports = {
    phoneSchema,
    loginSchema,
    otpSchema,
    registerSchema,
    refreshTokenSchema,
    logoutSchema
};