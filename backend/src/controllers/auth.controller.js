const { sendOTP, verifyOTP, resendOTP, isVerifiedPhoneNumber } = require('../services/otp.service');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, clearAccessToken, clearRefreshToken, userHasRefreshToken } = require('../services/token.service');
const logger = require('../config/logger');
const { getUserByPhoneNumber, comparePasscode, getUserById, createUser } = require('../services/user.service');

const startAuth = async (req, res) => {
    const { phone } = req.body;
    logger.info(`[AuthController] Starting authentication process for phone: ${phone}`);

    try {
        const user = await getUserByPhoneNumber(phone);

        if (user) {
            logger.info(`[AuthController] User ${user.id} found for phone: ${phone}`);
            const hasRefreshToken = await userHasRefreshToken(user.id);
            if (hasRefreshToken) {
                return res.status(200).json({
                    success: true,
                    message: 'User exists with valid refresh token, please enter passcode',
                    nextStep: 'login'
                });
            } else {
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
    const { phone, passcode } = req.body;
    logger.info(`[AuthController] Login attempt for phone: ${phone}`);

    try {
        const user = await getUserByPhoneNumber(phone);
        if (!user) {
            logger.warn(`[AuthController] Login failed: User not found for phone: ${phone}`);
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasscodeValid = await comparePasscode(user, passcode);
        if (!isPasscodeValid) {
            logger.warn(`[AuthController] Login failed: Invalid passcode for user ${user.id}`);
            return res.status(401).json({ success: false, message: 'Invalid passcode' });
        }

        const accessToken = await generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        logger.info(`[AuthController] Login successful for user ${user.id}`);
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                accessToken,
                refreshToken,
                user: { id: user.id, phone: user.phone, fullname: user.fullname }
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
    const { phone, otp } = req.body;
    logger.info(`[AuthController] OTP verification attempt for phone: ${phone}`);

    try {
        const verifySuccess = await verifyOTP(phone, otp);
        if (!verifySuccess) {
            logger.warn(`[AuthController] OTP verification failed for phone: ${phone}`);
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        const user = await getUserByPhoneNumber(phone);
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
    } catch (error) {
        logger.error(`[AuthController] OTP verification failed for phone: ${phone}: ${error.message}`);
        return res.status(400).json({
            success: false,
            message: "OTP verification failed",
            error: error.message
        });
    }
};

const register = async (req, res) => {
    const { phone, fullname, gender, date_of_birth, email, passcode } = req.body;
    logger.info(`[AuthController] Registration attempt for phone: ${phone}`);

    try {
        const isVerified = await isVerifiedPhoneNumber(phone);
        if (!isVerified) {
            logger.warn(`[AuthController] Phone number has not been verified for phone: ${phone}`);
            return res.status(403).json({
                success: false,
                message: 'Phone number must be verified before registration',
                nextStep: 'verify_otp'
            });
        }
        logger.info(`[AuthController] Phone number has been verified for phone: ${phone}`);

        const user = await createUser({ phone, fullname, gender, dateOfBirth: date_of_birth, email, passcode });
        const accessToken = await generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        logger.info(`[AuthController] Registration successful for user ${user.id}`);
        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                accessToken,
                refreshToken,
                user: { id: user.id, phone: user.phone, fullname: user.fullname, gender: user.gender, dateOfBirth: user.dateOfBirth, email: user.email }
            }
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

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    logger.info(`[AuthController] Refresh access token for user ${refreshToken}`);
    try {
        const decoded = await verifyRefreshToken(refreshToken);
        const accessToken = await generateAccessToken(decoded.userId);
        logger.info(`[AuthController] Access token refreshed successfully for user ${decoded.userId}`);
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
    const { phone } = req.body;
    logger.info(`[AuthController] OTP resend request for phone: ${phone}`);

    try {
        await resendOTP(phone);
        logger.info(`[AuthController] OTP resent successfully for phone: ${phone}`);
        return res.status(200).json({
            success: true,
            message: "OTP resent successfully",
            nextStep: 'verify_otp'
        });
    } catch (error) {
        logger.error(`[AuthController] OTP resend failed for phone ${phone}: ${error.message}`);

        const statusCode = error.message.includes("Too many OTP requests") ? 429 : 400;

        return res.status(statusCode).json({
            success: false,
            message: "OTP resend failed",
            error: error.message
        });
    }
};

const logout = async (req, res) => {
    const { userId } = req.body;
    try {
        await clearAccessToken(userId);
        logger.info(`[AuthController] User ${userId} logged out successfully`);
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