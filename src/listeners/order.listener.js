const redisClient = require('../config/redis');
const { sequelize } = require("../config/database");

const { matchDriver } = require('../services/driver.service');
const { Order, OrderLocation, OrderDetail, OrderSenderReceiver, Driver, User, OrderSpecialDemand } = require('../models/index');
const { where } = require('sequelize');
const { getSocket } = require('../services/websocket/driver');
const logger = require('../config/logger');
const { getPolyline, getInfoBasedOnRoadRoute } = require('../services/map.service');
const { sendNotification } = require('../services/notification.service');
module.exports = (io, socket) => {
    socket.on('order:create', async (data) => {
        if (socket.activeRole !== 'CUSTOMER') return socket.emit('error', 'Not authorized');

        logger.info('[OrderListener] order init', data.orderMain);
        const t = await sequelize.transaction();
        const customerId = socket.userId;

        try {
            const { orderMain, orderSenderReceiver, orderLocation, orderDetail, orderSpecialDemand } = data;
            console.log('order', orderMain, orderSenderReceiver, orderLocation, orderDetail, orderSpecialDemand);
            const { pickupLat, pickupLng, dropoffLat, dropoffLng } = orderLocation;
            const { vehicleType } = orderMain;
            let orderId
            while (true) {
                orderId = generateOrderId()
                const order = await Order.findByPk(orderId)
                if (!order) break
            }


            const { id: driverId } = await matchDriver(vehicleType, { pickupLat, pickupLng }, data, orderId);

            await Order.create({ id: orderId, customerId, driverId, ...orderMain }, { transaction: t });

            await OrderSenderReceiver.create({ orderId, ...orderSenderReceiver }, { transaction: t });
            await OrderLocation.create({ orderId, ...orderLocation }, { transaction: t });
            await OrderDetail.create({ orderId, ...orderDetail }, { transaction: t });
            await OrderSpecialDemand.create({ orderId, ...orderSpecialDemand }, { transaction: t });

            await t.commit(); // Commit transaction nếu không có lỗi
            const driver = await Driver.findByPk(driverId);
            const user = await User.findByPk(driverId);

            sendNotification(customerId, 'Order Created', `Order initialized, delivered by driver ${driverId}`);
            const payloadCus = {
                success: true,
                message: 'Order created successfully',
                data: {
                    orderId,
                    driverInfo: {
                        id: driverId,
                        fullName: user.fullName,
                        phoneNumber: user.phoneNumber,
                        vehiclePlate: driver.vehiclePlate,
                    }
                }
            }

            const payloadDriver = {
                success: true,
                message: 'Order created successfully',
                data: {
                    orderId,
                }
            }


            socket.emit('order:driverFound', payloadCus)
            const driverSocket = getSocket(driverId);
            driverSocket.emit('order:create', payloadDriver)
        } catch (error) {
            console.error(error);
            await t.rollback(); // rollback nếu có lỗi

            socket.emit('order:create', {
                success: false,
                message: 'Order create failed',
                error: error.message
            });
        }


    });

    socket.on('order:available', async (data, callback) => {
        console.log('oder:available', data);
        const customerId = socket.userId;
        const available = await redisClient.get(`driver:${customerId}:available`);
        const ttl = await redisClient.ttl(`driver:${customerId}:available`);

        callback({
            success: true,
            data: { ...JSON.parse(available), ttl }
        });
    }),


        socket.on('order:cancel', async (data) => {
            try {
                if (socket.activeRole !== 'DRIVER') return socket.emit('error', 'Not authorized');

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


    socket.on('order:detail', async (data, callback) => {
        const { orderId } = data;
        const orderMain = await Order.findByPk(orderId);
        const orderSenderReceiver = await OrderSenderReceiver.findByPk(orderId)
        const orderDetail = await OrderDetail.findByPk(orderId)
        const orderLocation = await OrderLocation.findByPk(orderId)
        const orderSpecialDemand = await OrderSpecialDemand.findByPk(orderId)

        callback({
            success: true,
            data: {
                orderMain,
                orderDetail,
                orderLocation,
                orderSenderReceiver: {
                    sender: {
                        name: orderSenderReceiver.senderName,
                        phoneNumber: orderSenderReceiver.senderPhoneNumber,
                    },
                    receiver: {
                        name: orderSenderReceiver.receiverName,
                        phoneNumber: orderSenderReceiver.receiverPhoneNumber
                    }
                },
                orderSpecialDemand
            }
        })
    });

    socket.on('chat:getDriverName', async (data, callback) => {
        const { orderId } = data;
        const { driverId } = await Order.findByPk(orderId);
        const { fullName } = await User.findByPk(driverId);
        callback({
            success: true,
            data: {
                driverName: fullName
            }
        })
    })

}

function generateOrderId(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}



