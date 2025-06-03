const Joi = require('joi');
const { userSchema, createUserSchema } = require('./user.validation');

const phoneSchema = Joi.object({
    phoneNumber: userSchema.phoneNumber.required()
});

const loginSchema = Joi.object({
    phoneNumber: userSchema.phoneNumber.required(),
    passcode: userSchema.passcode.required()
});

const otpSchema = Joi.object({
    phoneNumber: userSchema.phoneNumber.required(),
    otp: Joi.string().length(6).required()
        .messages({ 'string.length': 'OTP must be 6 digits' })
});

const registerSchema = createUserSchema;

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required()
        .messages({ 'any.required': 'Refresh token is required' })
});

module.exports = {
    phoneSchema,
    loginSchema,
    otpSchema,
    registerSchema,
    refreshTokenSchema,
};