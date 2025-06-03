const logger = require('../config/logger');
const redisClient = require('../config/redis');
const { Driver } = require('../models/index');
const { driverDirectionSupport } = require('../services/driver.service');

module.exports = (io, socket) => {
    socket.on('location:update', async (data) => {
        try {
            if (socket.activeRole !== 'DRIVER') return socket.emit('error', 'Not authorized');

            await redisClient.geoadd(
                'drivers:locations',
                data.lng,
                data.lat,
                socket.userId
            );
            const driverId = socket.userId

            const locationRoom = `location:${driverId}`;
            if (!socket.rooms.has(locationRoom)) {
                socket.join(locationRoom);
                logger.info(`[Location Listener] Driver joined location room: ${locationRoom}`);
            }


            socket.to(locationRoom).emit('location:update', {
                success: true,
                message: 'Location updated successfully',
                data: data
            });
            console.log(`Driver ${socket.userId} location updated: ${data.lng}, ${data.lat}`);
        } catch (error) {
            io.driverNamespace.to(socket.id).emit('location:update', {
                success: false,
                message: 'Location update failed',
                error: error.message
            });
        }
    });

    socket.on('order:route', async (data) => {
        if (socket.activeRole !== 'DRIVER') return socket.emit('error', 'Not authorized');

        const routeData = await driverDirectionSupport(data.transportType, data.currentLocation, data.dropOffLocation);
        if (routeData) {
            socket.emit('order:route', {
                success: true,
                message: 'Get route successfully',
                data: {
                    actions: routeData.actions,
                    polyline: routeData.polyline
                }
            });
        } else {
            socket.emit('order:route', {
                success: false,
                message: 'Failed to get route',
            });
        }

    });

    socket.on('disconnect', async () => {
        if (socket.activeRole !== 'DRIVER') return socket.emit('error', 'Not authorized');

        const driverId = socket.driverId;
        if (!driverId) return;

        // Xóa driver khỏi Redis GEO ngay lập tức (coi như offline)
        redisClient.zrem('drivers:locations', driverId);
        console.log(`Driver ${driverId} went offline.`);

        // Cập nhật trạng thái của tài xế trong DB bất đồng bộ
        // Sử dụng setImmediate hoặc Promise để tránh block event loop
        setImmediate(async () => {
            const driver = await Driver.findByPk(driverId);
            if (driver) {
                await driver.update({ status: 'OFFLINE' });
            }
        });


    });
}
