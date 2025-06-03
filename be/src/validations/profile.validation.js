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
    currentPasscode: userSchema.passcode.required(),
    newPasscode: userSchema.passcode.required(),
    confirmPasscode: Joi.any()
        .valid(Joi.ref('newPasscode'))
        .required()
        .messages({
            'any.only': 'Xác nhận mật khẩu không khớp với mật khẩu mới',
        }),
});

module.exports = {
    updateProfileSchema,
    changePasscodeSchema
};