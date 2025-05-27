const socketIO = require('socket.io');
const { authenticateSocket, checkSocketRole } = require('../middleware/auth.middleware');
const messageListener = require('../listeners/message.listener');
const orderListener = require('../listeners/order.listener');
const locationListener = require('../listeners/location.listener');

module.exports = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: '*',
        },
    });

    io.use(authenticateSocket);
    io.use(checkSocketRole())
    io.on('connection', (socket) => {
        console.log('[Socket] User connected:', socket.id);
        socket.emit('connected', { message: 'You are connected to the server' });
        orderListener(io, socket);
        locationListener(io, socket);
        messageListener(io, socket);
    });
};
