const https = require('follow-redirects').https;
const redisClient = require('../config/redis');
const logger = require('../config/logger');

// Infobip configuration
const infobipApiKey = process.env.INFOBIP_API_KEY;
const infobipBaseUrl = 'per6me.api.infobip.com';
const infobipSender = process.env.INFOBIP_SENDER;

// Generate random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Normalize phone number: remove + and any non-digit characters
const normalizePhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/[^0-9]/g, '');
};

// Send OTP via SMS using Infobip
const sendOTP = async (phoneNumber) => {
    try {
        const normalizedPhone = normalizePhoneNumber(phoneNumber);
        logger.info(`[OTPService] Sending OTP to phone number: ${normalizedPhone}`);
        const otp = '123456'; // for testing
        // const otp = generateOTP();

        // const message = `Your OTP is: ${otp}. Valid for 5 minutes.`;

        // const postData = JSON.stringify({
        //     messages: [
        //         {
        //             destinations: [{ to: normalizedPhone }],
        //             from: infobipSender,
        //             text: message,
        //         },
        //     ],
        // });

        // const options = {
        //     method: 'POST',
        //     hostname: infobipBaseUrl,
        //     path: '/sms/2/text/advanced',
        //     headers: {
        //         Authorization: infobipApiKey,
        //         'Content-Type': 'application/json',
        //         Accept: 'application/json',
        //     },
        //     maxRedirects: 20,
        // };

        // const response = await new Promise((resolve, reject) => {
        //     const req = https.request(options, (res) => {
        //         let data = [];
        //         res.on('data', (chunk) => data.push(chunk));
        //         res.on('end', () => resolve(Buffer.concat(data).toString()));
        //     });

        //     req.on('error', (e) => reject(new Error(`Request failed: ${e.message}`)));
        //     req.write(postData);
        //     req.end();
        // });

        // const result = JSON.parse(response);
        // if (!result.messages || result.messages[0].status.groupId !== 1) {
        //     throw new Error('Failed to send SMS via Infobip');
        // }

        // Store OTP in Redis with 5-minute expiration
        await redisClient.setEx(`otp:${normalizedPhone}`, 5 * 60, otp);
        logger.info(`[OTPService] OTP stored in Redis for phone: ${normalizedPhone}`);
        return {
            success: true,
            message: 'OTP sent successfully'
        };
    } catch (error) {
        logger.error(`[OTPService] Failed to send OTP to ${phoneNumber}: ${error.message}`);
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};

// Verify OTP
const verifyOTP = async (phoneNumber, otp) => {
    try {
        const normalizedPhone = normalizePhoneNumber(phoneNumber);
        logger.info(`[OTPService] Verifying OTP for phone number: ${normalizedPhone}`);

        const storedOTP = await redisClient.get(`otp:${normalizedPhone}`);
        if (!storedOTP) {
            logger.warn(`[OTPService] No OTP found for phone number: ${normalizedPhone}`);
            throw new Error('No OTP found for this phone number');
        }

        if (storedOTP !== otp) {
            logger.warn(`[OTPService] Invalid OTP attempt for phone number: ${normalizedPhone}`);
            throw new Error('Invalid OTP');
        }

        // Clear OTP from Redis after successful verification
        await redisClient.del(`otp:${normalizedPhone}`);
        logger.info(`[OTPService] OTP verified successfully for phone: ${normalizedPhone}`);

        return {
            success: true,
            message: 'OTP verified successfully'
        };
    } catch (error) {
        logger.error(`[OTPService] OTP verification failed for ${phoneNumber}: ${error.message}`);
        throw new Error(`OTP verification failed: ${error.message}`);
    }
};

// Resend OTP
const resendOTP = async (phoneNumber) => {
    try {
        const normalizedPhone = normalizePhoneNumber(phoneNumber);
        logger.info(`[OTPService] Attempting to resend OTP for phone: ${normalizedPhone}`);

        const existingOTP = await redisClient.get(`otp:${normalizedPhone}`);
        if (existingOTP) {
            const ttl = await redisClient.ttl(`otp:${normalizedPhone}`);
            if (ttl > 0) {
                logger.warn(`[OTPService] Rate limit: OTP resend attempted too soon for phone: ${normalizedPhone}, TTL: ${ttl}s`);
                throw new Error(`Please wait ${ttl} seconds before requesting a new OTP`);
            }
        }

        return await sendOTP(phoneNumber);
    } catch (error) {
        logger.error(`[OTPService] Failed to resend OTP to ${phoneNumber}: ${error.message}`);
        throw new Error(`Failed to resend OTP: ${error.message}`);
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
    resendOTP
};