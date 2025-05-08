const { sendOTP, verifyOTP, resendOTP, isVerifiedPhoneNumber } = require('../services/otp.service');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, clearRefreshToken, userHasRefreshToken, blacklistAccessToken } = require('../services/token.service');
const logger = require('../config/logger');
const { User } = require('../models/index');

const startAuth = async (req, res) => {
    const { phoneNumber } = req.body;
    logger.info(`[AuthController] Starting authentication process for phone: ${phoneNumber}`);

    try {
        const user = await User.findOne({ where: { phoneNumber } });

        if (user) {
            return res.status(200).json({
                success: true,
                message: 'Phone number already exists, please enter passcode',
                nextStep: 'login'
            });
        }
        await sendOTP(phoneNumber);
        return res.status(200).json({
            success: true,
            message: 'OTP sent, please verify',
            nextStep: 'verify-otp'
        });

    } catch (error) {
        logger.error(`[AuthController] Error during authentication: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
};


const login = async (req, res) => {
    const { phoneNumber, passcode } = req.body;
    logger.info(`[AuthController] Login attempt for phone: ${phoneNumber}`);


    try {
        const user = await User.findOne({ where: { phoneNumber } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasscodeValid = await user.comparePasscode(passcode);
        if (!isPasscodeValid) {
            return res.status(401).json({ success: false, message: 'Invalid passcode' });
        }

        const accessToken = await generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                accessToken,
                refreshToken,
                user: { id: user.id, phoneNumber: user.phoneNumber, fullName: user.fullName, roles: user.roles }
            }
        });

    } catch (error) {
        logger.error(`[AuthController] Error during login: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};


const verifyOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    logger.info(`[AuthController] OTP verification attempt for phone: ${phoneNumber}`);


    try {
        const verifySuccess = await verifyOTP(phoneNumber, otp);
        if (!verifySuccess) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        logger.info(`[AuthController] OTP verified for new user registration: ${phoneNumber}`);
        return res.status(200).json({
            success: true,
            message: 'OTP verified, please complete registration in 15 minutes',
            nextStep: 'register'
        });
    } catch (error) {
        logger.error(`[AuthController] OTP verification failed for phone: ${phoneNumber}: ${error.message}`);
        return res.status(400).json({
            success: false,
            message: "OTP verification failed",
            error: error.message
        });
    }
};

const register = async (req, res) => {
    const { phoneNumber, fullName, gender, dateOfBirth, email, passcode } = req.body;
    logger.info(`[AuthController] Registration attempt for phone: ${phoneNumber}`);

    try {
        const isVerified = await isVerifiedPhoneNumber(phoneNumber);
        if (!isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Phone number must be verified before registration',
                nextStep: 'verify_otp'
            });
        }
        const user = await User.create({ phoneNumber, fullName, gender, dateOfBirth, email, passcode, roles: ['CUSTOMER'] });

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: { id: user.id, phoneNumber: user.phoneNumber, fullName: user.fullName, gender: user.gender, dateOfBirth: user.dateOfBirth, email: user.email }
            }
        });
    } catch (error) {
        logger.error(`[AuthController] Registration failed for phone ${phoneNumber}: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    logger.info(`[AuthController] Refresh access token for user ${refreshToken}`);

    try {
        const decoded = await verifyRefreshToken(refreshToken);
        const accessToken = await generateAccessToken(decoded.userId);
        return res.status(200).json({
            success: true,
            message: 'Access token refreshed successfully',
            data: {
                accessToken
            }
        });
    } catch (err) {
        logger.error(`[AuthController] Refresh token error: ${err.message}`);
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired refresh token',
            error: err.message
        });
    }
};

const resendOtp = async (req, res) => {
    const { phoneNumber } = req.body;
    logger.info(`[AuthController] OTP resend request for phone: ${phoneNumber}`);

    try {
        await resendOTP(phoneNumber);
        return res.status(200).json({
            success: true,
            message: "OTP resent successfully",
            nextStep: 'verify_otp'
        });
    } catch (error) {
        logger.error(`[AuthController] OTP resend failed for phone ${phoneNumber}: ${error.message}`);

        const statusCode = error.message.includes("Too many OTP requests") ? 429 : 400;

        return res.status(statusCode).json({
            success: false,
            message: "OTP resend failed",
            error: error.message
        });
    }
};

const logout = async (req, res) => {
    const userId = req.userId;
    const accessToken = req.accessToken;
    logger.info(`[AuthController] Logout attempt for user ${userId}`);

    try {
        await blacklistAccessToken(accessToken);
        await clearRefreshToken(userId);
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        logger.error(`[AuthController] Logout failed for user ${userId}: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
}

module.exports = {
    startAuth,
    login,
    verifyOtp,
    register,
    refreshAccessToken,
    resendOtp,
    logout
};