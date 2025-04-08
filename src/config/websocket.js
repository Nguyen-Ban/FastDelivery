const socketIO = require('socket.io');
const customerEvents = require('../routes/events/customer.events');
const driverEvents = require('../routes/events/driver.events');
const { authenticateSocket } = require('../middleware/auth.middleware');

module.exports = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: '*',
        },
    });

    // io.use((socket, next) => authenticateSocket(socket, next));

    // Namespace cho khách hàng
    const customerNamespace = io.of('/customer');
    customerNamespace.use((socket, next) => authenticateSocket(socket, next));
    customerNamespace.on('connection', (socket) => {
        console.log('[Socket] Customer connected:', socket.id);
        customerEvents({ customerNamespace, driverNamespace }, socket);
    });

    // Namespace cho tài xế
    const driverNamespace = io.of('/driver');
    driverNamespace.use((socket, next) => authenticateSocket(socket, next));
    driverNamespace.on('connection', (socket) => {
        console.log('[Socket] Driver connected:', socket.id);
        driverEvents({ driverNamespace, customerNamespace }, socket);
    });
};
