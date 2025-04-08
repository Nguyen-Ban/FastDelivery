const { matchDriver } = require('../../services/algo.service');
module.exports = (io, socket) => {
    socket.on('order:create', async (data) => {
        console.log(data);
        const driver = await matchDriver(data);
        if (driver) {
            socket.emit('order:create', {
                success: true,
                message: 'Order created successfully',
                data: {
                    ...data,
                    driver
                }
            });
        } else {
            socket.emit('order:create', {
                success: false,
                message: 'No driver found',
            });
        }


    });
}



