const redisClient = require('../config/redis');

module.exports = (io, socket) => {
    socket.on('location:update', async (data) => {
        console.log(data);
        await redisClient.geoadd(
            'drivers:locations',
            data.lng,
            data.lat,
            socket.driver.id
        );

        io.driverNamespace.to(socket.id).emit('location:update', {
            success: true,
            message: 'Location updated successfully',
            data: data
        });
    });
}
