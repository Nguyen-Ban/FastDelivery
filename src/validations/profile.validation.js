const Joi = require("joi");
const { userSchema } = require("./user.validation");

const updateProfileSchema = Joi.object({
    phoneNumber: userSchema.phoneNumber,
    fullName: userSchema.fullName,
    dateOfBirth: userSchema.dateOfBirth,
    gender: userSchema.gender,
    email: userSchema.email
});

const changePasscodeSchema = Joi.object({
    passcode: userSchema.passcode.required(),
});

module.exports = {
    updateProfileSchema,
    changePasscodeSchema
};