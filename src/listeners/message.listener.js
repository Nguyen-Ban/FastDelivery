const logger = require('../config/logger');
const redisClient = require('../config/redis');
const { Message } = require('../models/index');
const { getSocket } = require('../services/websocket/driver');

module.exports = (io, socket) => {
    socket.on('chat:join', (data) => {
        const { orderId } = data;
        const chatRoom = `chat:${orderId}`;
        socket.join(chatRoom);
        logger.info(`[Message Listener] User joined chat room: ${chatRoom}`);
    });

    socket.on('chat:sendMessage', async (data, callback) => {
        const { senderId, content, orderId } = data;
        const { messageId } = await Message.create({
            senderId,
            content,
            orderId
        });

        callback({
            success: true,
            data: {
                messageId
            }
        })
        const rooms = Array.from(io.of('/').adapter.rooms.keys());
        console.log('Số lượng room hiện tại:', rooms.length);
        io.of('/').adapter.rooms.forEach((value, key) => {
            console.log('Room:', key);
        });
        const chatRoom = `chat:${orderId}`;
        socket.to(chatRoom).emit('chat:newMessage', {
            success: true,
            data: {
                message: {
                    id: messageId,
                    senderId,
                    content,
                    orderId
                }
            }
        });
        logger.info('[[Message Listener] A message sent')
    });

    socket.on('chat:getMessageHistory', async (data, callback) => {
        const { orderId } = data;
        const messages = await Message.findAll({
            where: { orderId },
            order: [['created_at', 'ASC']],
            attributes: ['id', 'content', 'senderId', 'orderId'],
        });
        console.log(1);
        callback({
            success: true,
            data: messages,
        });
    })
}
