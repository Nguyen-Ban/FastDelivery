const https = require('follow-redirects').https;
const redisClient = require('../config/redis');
const logger = require('../config/logger');

// Infobip configuration
const infobipApiKey = process.env.INFOBIP_API_KEY;
const infobipBaseUrl = 'per6me.api.infobip.com';
const infobipSender = process.env.INFOBIP_SENDER;
const MAX_ATTEMPTS = 3;

// Send OTP via SMS using Infobip
const sendOTP = async (phoneNumber) => {
    try {
        logger.info(`[OTPService] Send OTP to phone number: ${phoneNumber}`);

        await checkOTPAttempts(phoneNumber);

        // const otp = '123456'; // for testing
        const otp = generateOTP();

        const message = `[Fast Delivery] Your OTP is: ${otp}. Valid for 5 minutes.`;
        const normalizedPhone = normalizePhoneNumber(phoneNumber);
        const postData = JSON.stringify({
            messages: [
                {
                    destinations: [{ to: normalizedPhone }],
                    from: infobipSender,
                    text: message,
                },
            ],
        });

        const options = {
            method: 'POST',
            hostname: infobipBaseUrl,
            path: '/sms/2/text/advanced',
            headers: {
                Authorization: infobipApiKey,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            maxRedirects: 20,
        };

        const response = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = [];
                res.on('data', (chunk) => data.push(chunk));
                res.on('end', () => resolve(Buffer.concat(data).toString()));
            });

            req.on('error', (e) => reject(new Error(`Request failed: ${e.message}`)));
            req.write(postData);
            req.end();
        });

        const result = JSON.parse(response);
        if (!result.messages || result.messages[0].status.groupId !== 1) {
            throw new Error(`Failed to send SMS: ${JSON.stringify(result)}`);
        }

        // Store OTP in Redis with 5-minute expiration
        await redisClient.set(`otp:${phoneNumber}`, otp, 'EX', 5 * 60);
    } catch (error) {
        logger.error(`[OTPService] Failed to send OTP: ${error.message}`);
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};

// Verify OTP
const verifyOTP = async (phoneNumber, otp) => {
    logger.info(`[OTPService] Verify OTP for phone number: ${phoneNumber}`);

    const storedOTP = await redisClient.get(`otp:${phoneNumber}`);
    console.log(storedOTP);
    if (!storedOTP || storedOTP !== otp) {
        logger.warn(`[OTPService] Invalid OTP attempt for phone number: ${phoneNumber}`);
        return false;
    }
    // Clear OTP from Redis after successful verification
    await redisClient.del(`otp:${phoneNumber}`);
    logger.info(`[OTPService] Remove OTP from Redis for phone: ${phoneNumber}`);

    await redisClient.set(`verified:${phoneNumber}`, 'true', 'EX', 15 * 60);
    logger.info(`[OTPService] Add verified phone number to Redis for phone: ${phoneNumber}`);
    return true;
};

// Resend OTP
const resendOTP = async (phoneNumber) => {
    logger.info(`[OTPService] Attempting to resend OTP for phone: ${phoneNumber}`);

    await sendOTP(phoneNumber);
};

const checkOTPAttempts = async (phoneNumber) => {
    const attemptKey = `otp:attempts:${phoneNumber}`;

    let attempts = await redisClient.get(attemptKey);
    attempts = attempts !== null ? parseInt(attempts, 10) || 0 : 0;

    if (attempts >= MAX_ATTEMPTS) {
        logger.warn(`[OTPService] Rate limit exceeded for phone: ${phoneNumber}`);
        throw new Error('Too many OTP requests. Please try again later.');
    }

    // Tăng số lần gửi OTP trước để tránh race condition
    const pipeline = redisClient.multi();
    pipeline.incr(attemptKey);

    // Đảm bảo key luôn có thời gian hết hạn (TTL)
    const ttl = await redisClient.ttl(attemptKey);
    if (ttl === -1) { // TTL chưa được thiết lập
        pipeline.expire(attemptKey, 60 * 10); // 10 phút
    }

    await pipeline.exec();

};



const isVerifiedPhoneNumber = async (phoneNumber) => {
    const isVerified = await redisClient.get(`verified:${phoneNumber}`);
    return isVerified;
};


// Generate random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Normalize phone number: remove + and any non-digit characters
const normalizePhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/[^0-9]/g, '');
};

module.exports = {
    sendOTP,
    verifyOTP,
    resendOTP,
    isVerifiedPhoneNumber
};