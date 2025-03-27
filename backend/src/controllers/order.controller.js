const { createOrder, createOrderDetailByOrderId, createOrderAddonByOrderId } = require("../services/order.service");

const placeOrder = async (req, res) => {

    const { pickupAddress, dropoffAddress, pickupLat,
        pickupLng, dropoffLat, dropoffLng,
        price, status, customerId,
        orderDetail, orderAddon
    } = req.body;
    try {
        const order = await createOrder({
            pickupAddress, dropoffAddress, pickupLat,
            pickupLng, dropoffLat, dropoffLng,
            price, status, customerId
        });

        const orderDetail = await createOrderDetailByOrderId(order.id, orderDetail);
        const orderAddon = await createOrderAddonByOrderId(order.id, orderAddon);

        return res.status(200).json({ message: "Order placed successfully", order, orderDetail, orderAddon });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder };

