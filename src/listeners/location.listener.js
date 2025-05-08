const redisClient = require('../config/redis');
const { Driver } = require('../models/index');
const { driverDirectionSupport } = require('../services/algo.service');

module.exports = (io, socket) => {
    socket.on('location:update', async (data) => {
        try {
            await redisClient.geoadd(
                'drivers:locations',
                data.lng,
                data.lat,
                socket.driverId
            );

            io.driverNamespace.to(socket.id).emit('location:update', {
                success: true,
                message: 'Location updated successfully',
                data: data
            });
        } catch (error) {
            io.driverNamespace.to(socket.id).emit('location:update', {
                success: false,
                message: 'Location update failed',
                error: error.message
            });
        }
    });

    socket.on('order:route', async (data) => {
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
