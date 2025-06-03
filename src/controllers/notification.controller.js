const admin = require('firebase-admin');
const { DeviceToken, Notification } = require('../models/index');


const registerDevice = async (req, res) => {
    const { userId, token, platform } = req.body;

    try {
        const existingToken = await DeviceToken.findOne({ where: { token, userId } });
        if (existingToken) {
            return res.status(400).json({
                success: false,
                message: 'Device token already registered'
            });
        }

        const deviceToken = await DeviceToken.create({ token, platform, userId });
        res.status(200).json({
            success: true,
            message: 'Device token registered successfully',
            data: {
                token: deviceToken.token,
                platform: deviceToken.platform
            }
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: 'Error registering device token',
            error: error.message
        });
    }
};

const unregisterDevice = async (req, res) => {
    try {
        const { token } = req.body;
        await DeviceToken.destroy({ where: { token } });
        res.status(200).json({
            success: true,
            message: 'Device token unregistered successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error unregistering device token',
            error: error.message
        });
    }
};


module.exports = {
    registerDevice,
    unregisterDevice
};
