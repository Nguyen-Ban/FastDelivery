const express = require('express');
const validate = require('../validations/validate');
const { phoneSchema, loginSchema, otpSchema, registerSchema, refreshTokenSchema } = require('../validations/auth.validation');
const { startAuth, login, verifyOtp, register, refreshAccessToken, resendOtp, logout } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/start', validate(phoneSchema), startAuth);
router.post('/login', validate(loginSchema), login);
router.post('/verify-otp', validate(otpSchema), verifyOtp);
router.post('/register', validate(registerSchema), register);
router.post('/refresh-access-token', validate(refreshTokenSchema), refreshAccessToken);
router.post('/resend-otp', validate(phoneSchema), resendOtp);
router.post('/logout', authenticateToken, logout);

module.exports = router;