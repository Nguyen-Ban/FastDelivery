const redisClient = require('../config/redis');
const { matchDriver } = require('../services/algo.service');
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

    socket.on('driver:location', async (data) => {
        const driverPos = await redisClient.geopos('drivers:locations', data.driverId);
        if (driverPos) {
            socket.emit('driver:location', {
                success: true,
                message: 'Driver location updated successfully',
                data: {
                    driverPos: {
                        lng: driverPos[0][0],
                        lat: driverPos[0][1]
                    }
                }
            });
        } else {
            socket.emit('driver:location', {
                success: false,
                message: 'Driver not found',
            });
        }
    })
}



