const redisClient = require('../config/redis');
const { sequelize } = require("../config/database");

const { matchDriver } = require('../services/algo.service');
const { Order, OrderLocation, OrderDetail, OrderAddon } = require('../models/index');
const { where } = require('sequelize');
const { getSocket } = require('../services/websocket/driver');
module.exports = (io, socket) => {
    socket.on('order:create', async (data) => {
        const t = await sequelize.transaction();
        const customerId = socket.userId;

        try {
            const { price, transportType, orderLocation, orderDetail, orderAddon } = data;
            const { pickupLat, pickupLng } = orderLocation;
            const { id: driverId } = await matchDriver(transportType, { pickupLat, pickupLng }, orderDetail);

            const { id: orderId } = await Order.create({ customerId, driverId, transportType, price }, { transaction: t });

            await OrderLocation.create({ orderId, ...orderLocation }, { transaction: t });
            await OrderDetail.create({ orderId, ...orderDetail }, { transaction: t });
            await OrderAddon.create({ orderId, ...orderAddon }, { transaction: t });

            await t.commit(); // Commit transaction nếu không có lỗi

            const payload = {
                success: true,
                message: 'Order created successfully',
                data: {
                    orderId,
                    driverId
                }
            }

            socket.emit('order:create', payload)
            const driverSocket = getDriverSocket(driverId);
            driverSocket.emit('order:create', payload)

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
    });

    socket.on('order:cancel', async (data) => {
        try {
            const { orderId, cancelledBy } = data; // id and 'CUSTOMER' / 'DRIVER'

            const order = await Order.findByPk(orderId);

            await order.update({ status: "CANCELLED", cancelledBy });

            const payload = {
                success: true,
                message: `Order ${orderId} cancelled by ${cancelledBy} successfully`,
                data: {
                    orderId,
                    cancelledBy
                }
            }
            socket.emit('order:cancel', payload);

            if (cancelledBy == 'CUSTOMER') {

                const driverId = order.driverId;
                const driverSocket = await getSocket(driverId);
                driverSocket.emit('order:cancel', payload);

            } else {
                const customerId = order.customerId;
                const customerSocket = await getSocket(customerId);
                customerSocket.emit('order:cancel', payload);
            }
        } catch (error) {

            socket.emit('order:cancel', {
                success: false,
                message: 'Order cancel by customer failed',
                error: error.message
            });
        }
    });

}



