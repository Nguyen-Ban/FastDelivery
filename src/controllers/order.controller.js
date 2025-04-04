const { Order, OrderDetail, OrderAddon } = require("../models/index");
const { sequelize } = require("../config/database");
const { logger } = require("../config/logger");

const placeOrder = async (req, res) => {

    const t = await sequelize.transaction();

    const { order, order_detail, order_addon } = req.body;
    const customerId = req.user.userId;
    try {
        // find driver algo
        const driverId = 1;
        const newOrder = await Order.create({
            pickupAddress: order.pickup_address, dropoffAddress: order.dropoff_address, pickupLat: order.pickup_lat,
            pickupLng: order.pickup_lng, dropoffLat: order.dropoff_lat, dropoffLng: order.dropoff_lng,
            price: order.price, customerId, driverId, status: 'ASSIGNED'
        }, { transaction: t });

        const orderDetail = await OrderDetail.create({
            packageType: order_detail.package_type,
            weightKg: order_detail.weight_kg, size: order_detail.size, deliveryInsurance: order_detail.delivery_insurance,
            orderId: newOrder.id
        }, { transaction: t });
        const orderAddon = await OrderAddon.create({
            doorToDoor: order_addon.door_to_door,
            bulkyDelivery: order_addon.bulky_delivery,
            orderId: newOrder.id
        }, { transaction: t });

        await t.commit();
        return res.status(200).json({
            success: true,
            message: "Order placed successfully",
            data: { newOrder, orderDetail, orderAddon }
        });

    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            success: false,
            message: "Order placement failed",
            error: error.message
        });
    }
};

const getOrderList = async (req, res) => {
    const customerId = req.user.userId;
    const { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng } = req.body;

    return res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: orders
    });
};

module.exports = { placeOrder, getOrderList };

