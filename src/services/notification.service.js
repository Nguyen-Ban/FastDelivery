const DeviceToken = require("../models/deviceToken.model");
const expo = require("../config/notification");
const { default: Expo } = require("expo-server-sdk");


const sendNotification = async (userId, title, body) => {
    try {
        const deviceToken = await DeviceToken.findOne({ where: { userId } });
        if (!deviceToken) {
            throw new Error('Device token not found');
        }

        const token = deviceToken.token;

        if (!Expo.isExpoPushToken(token)) {
            throw new Error('Invalid token');
        }

        const message = {
            to: token,
            sound: 'default',
            title,
            body,
        };

        const [ticket] = await expo.sendPushNotificationsAsync([message]);

        console.log('Notification sent successfully: ', ticket);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    sendNotification
};
