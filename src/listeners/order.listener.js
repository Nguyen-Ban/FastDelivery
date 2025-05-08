const redisClient = require('../config/redis');
const { sequelize } = require("../config/database");

const { matchDriver } = require('../services/algo.service');
const { Order, OrderLocation, OrderDetail, OrderAddon } = require('../models/index');
module.exports = (io, socket) => {
    socket.on('order:create', async (data) => {
        const t = await sequelize.transaction();

        try {
            const { price, transportType, orderLocation, orderDetail, orderAddon } = data;
            const { pickupLat, pickupLng } = orderLocation;
            const customerId = socket.userId;
            const { id: driverId } = await matchDriver(transportType, { pickupLat, pickupLng }, orderDetail);


            // Tạo order dưới transaction
            const { id: orderId } = await Order.create({
                customerId,
                driverId,
                transportType,
                price
            }, { transaction: t });

            // Tạo order location
            await OrderLocation.create({
                orderId,
                ...orderLocation
            }, { transaction: t });

            // Tạo order detail
            await OrderDetail.create({
                orderId,
                ...orderDetail
            }, { transaction: t });

            // Tạo order addon
            await OrderAddon.create({
                orderId,
                ...orderAddon
            }, { transaction: t });

            await t.commit(); // Commit transaction nếu không có lỗi


            socket.emit('order:create', {
                success: true,
                message: 'Order created successfully',
                data: {
                    orderId,
                    driverId
                }
            });
        } catch (error) {
            await t.rollback(); // rollback nếu có lỗi

            socket.emit('order:create', {
                success: false,
                message: 'Order create failed',
                error: error.message
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

    socket.on('order:customer:cancel', async (data) => {
        try {
            const orderId = data.orderId;

            socket.emit('order:create', {
                success: true,
                message: 'Order created successfully',
                data: {
                    ...data,
                    driver
                }
            });
        } catch (error) {

            socket.emit('order:create', {
                success: false,
                message: 'Order create failed',
                error: error.message
            });
        }


    });


}



