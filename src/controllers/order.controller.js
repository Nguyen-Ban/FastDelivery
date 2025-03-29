const { Order, OrderDetail, OrderAddon } = require("../models/index");

const placeOrder = async (req, res) => {

    const { pickupAddress, dropoffAddress, pickupLat,
        pickupLng, dropoffLat, dropoffLng,
        price, status, customerId,
        orderDetail, orderAddon
    } = req.body;
    try {
        const order = await Order.create({
            pickupAddress, dropoffAddress, pickupLat,
            pickupLng, dropoffLat, dropoffLng,
            price, status, customerId
        });

        const orderDetail = await OrderDetail.create({ ...orderDetail, orderId: order.id });
        const orderAddon = await OrderAddon.create({ ...orderAddon, orderId: order.id });

        return res.status(200).json({ message: "Order placed successfully", order, orderDetail, orderAddon });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder };

