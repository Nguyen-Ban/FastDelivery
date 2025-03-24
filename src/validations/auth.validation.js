const Joi = require('joi');
const { userSchema } = require('./user.validation');

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

const registerSchema = Joi.object({
    phone: userSchema.phone.required(),
    fullname: userSchema.fullname.required()
        .messages({ 'any.required': 'Full name is required' }),
    gender: userSchema.gender,
    email: userSchema.email.required()
        .messages({ 'any.required': 'Email is required' }),
    passcode: userSchema.passcode.required()
        .messages({ 'any.required': 'Passcode is required' })
});

module.exports = {
    phoneSchema,
    loginSchema,
    otpSchema,
    registerSchema
};