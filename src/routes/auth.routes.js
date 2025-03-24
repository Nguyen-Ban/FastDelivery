const express = require('express');
const validate = require('../validations/validate');
const { phoneSchema, loginSchema, otpSchema, registerSchema } = require('../validations/auth.validation');
const { refreshToken, startAuth, login, verifyOtp, register, resendOtp } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/start', validate(phoneSchema), startAuth);
router.post('/login', validate(loginSchema), login);
router.post('/verify-otp', validate(otpSchema), verifyOtp);
router.post('/register', validate(registerSchema), register);
router.post('/refresh-token', refreshToken);
router.post('/resend-otp', validate(phoneSchema), resendOtp);

module.exports = router;