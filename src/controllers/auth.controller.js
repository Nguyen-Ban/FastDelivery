const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const { User } = require('../models/user.model');
const { sendOTP, verifyOTP, resendOTP } = require('../services/otp.service');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../services/token.service');
const logger = require('../config/logger');

const startAuth = async (req, res) => {
    const { phone } = req.body;
    logger.info(`[AuthController] Starting authentication process for phone: ${phone}`);

    const user = await User.findOne({ where: { phone } });
    if (user) {
        const isRefreshTokenValid = await verifyRefreshToken(user.id);
        if (isRefreshTokenValid) {
            logger.info(`[AuthController] User ${user.id} found with valid refresh token`);
            return res.status(200).json({
                success: true,
                message: 'User exists with valid refresh token, please enter passcode',
                nextStep: 'login'
            });
        } else {
            logger.info(`[AuthController] User ${user.id} found but refresh token expired, sending OTP`);
            await sendOTP(phone);
            return res.status(200).json({
                success: true,
                message: 'Refresh token expired, OTP sent, please verify',
                nextStep: 'verify_otp'
            });
        }
    }

    logger.info(`[AuthController] New user authentication started for phone: ${phone}`);
    await sendOTP(phone);
    return res.status(200).json({
        success: true,
        message: 'OTP sent, please verify',
        nextStep: 'verify_otp'
    });
};

const login = async (req, res) => {
    const { phone, passcode } = req.body;
    logger.info(`[AuthController] Login attempt for phone: ${phone}`);

    const user = await User.findOne({ where: { phone } });
    if (!user) {
        logger.warn(`[AuthController] Login failed: User not found for phone: ${phone}`);
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isPasscodeValid = await user.comparePasscode(passcode);
    if (!isPasscodeValid) {
        logger.warn(`[AuthController] Login failed: Invalid passcode for user ${user.id}`);
        return res.status(401).json({ success: false, message: 'Invalid passcode' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    logger.info(`[AuthController] Login successful for user ${user.id}`);
    return res.status(200).json({
        success: true,
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: { id: user.id, phone: user.phone, fullname: user.fullname }
    });
};

const verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;
    logger.info(`[AuthController] OTP verification attempt for phone: ${phone}`);

    if (!await verifyOTP(phone, otp)) {
        logger.warn(`[AuthController] OTP verification failed for phone: ${phone}`);
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const user = await User.findOne({ where: { phone } });
    if (user) {
        logger.info(`[AuthController] OTP verified for existing user ${user.id}`);
        return res.status(200).json({
            success: true,
            message: 'OTP verified, please enter passcode',
            nextStep: 'login'
        });
    }

    logger.info(`[AuthController] OTP verified for new user registration: ${phone}`);
    return res.status(200).json({
        success: true,
        message: 'OTP verified, please complete registration',
        nextStep: 'register'
    });
};

const register = async (req, res) => {
    const { phone, fullname, gender, email, passcode } = req.body;
    logger.info(`[AuthController] Registration attempt for phone: ${phone}`);

    try {
        const user = await User.create({ phone, fullname, gender, email, passcode });
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        logger.info(`[AuthController] Registration successful for user ${user.id}`);
        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            accessToken,
            refreshToken,
            user: { id: user.id, phone: user.phone, fullname: user.fullname }
        });
    } catch (error) {
        logger.error(`[AuthController] Registration failed for phone ${phone}: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        logger.warn('[AuthController] Refresh token request without token');
        return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, require('../services/token.service').REFRESH_TOKEN_SECRET);
        const storedToken = await redisClient.get(`refresh_token:${decoded.userId}`);
        if (storedToken !== refreshToken) {
            logger.warn(`[AuthController] Invalid refresh token attempt for user ${decoded.userId}`);
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            logger.warn(`[AuthController] User not found for refresh token: ${decoded.userId}`);
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const accessToken = generateAccessToken(user);
        logger.info(`[AuthController] Access token refreshed successfully for user ${user.id}`);
        return res.status(200).json({ success: true, accessToken });
    } catch (err) {
        logger.error(`[AuthController] Refresh token error: ${err.message}`);
        return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
    }
};

const resendOtp = async (req, res) => {
    const { phone } = req.body;
    logger.info(`[AuthController] OTP resend request for phone: ${phone}`);

    try {
        const result = await resendOTP(phone);
        logger.info(`[AuthController] OTP resent successfully for phone: ${phone}`);
        return res.status(200).json({
            success: true,
            message: result.message,
            nextStep: 'verify_otp'
        });
    } catch (error) {
        logger.error(`[AuthController] OTP resend failed for phone ${phone}: ${error.message}`);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    startAuth,
    login,
    verifyOtp,
    register,
    refreshToken,
    resendOtp
};