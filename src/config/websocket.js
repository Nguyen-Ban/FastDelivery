const socketIO = require('socket.io');
const customerListener = require('../listeners/order.listener');
const driverListener = require('../listeners/location.listener');
const { authenticateSocket, checkSocketRole } = require('../middleware/auth.middleware');

module.exports = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: '*',
        },
    });

    // io.use((socket, next) => authenticateSocket(socket, next));

    // Namespace cho khách hàng
    const customerNamespace = io.of('/customer');
    customerNamespace.use(authenticateSocket);
    customerNamespace.use(checkSocketRole(['CUSTOMER']))
    customerNamespace.on('connection', (socket) => {
        console.log('[Socket] Customer connected:', socket.id);
        customerListener({ customerNamespace, driverNamespace }, socket);
    });

    // Namespace cho tài xế
    const driverNamespace = io.of('/driver');
    driverNamespace.use(authenticateSocket);
    driverNamespace.use(checkSocketRole(['DRIVER']))
    driverNamespace.on('connection', (socket) => {
        console.log('[Socket] Driver connected:', socket.id);
        driverListener({ driverNamespace, customerNamespace }, socket);
    });
};
