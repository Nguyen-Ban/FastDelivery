const redisClient = require('../config/redis');
const { getSocket } = require('../services/websocket/driver');

module.exports = (io, socket) => {
    socket.on('chat:message', async (data) => {
        try {
            const { receiverId, content } = data;
            const receiverSocket = getSocket(receiverId);
            const payload = {
                success: true,
                message: "Message sent successfully",
                data: {
                    content
                }
            }
            receiverSocket.emit('chat:message', payload)
        } catch (error) {
            socket.emit('chat:message', {
                success: false,
                message: 'Message sent failed',
                error: error.message
            })
        }
    })
}
