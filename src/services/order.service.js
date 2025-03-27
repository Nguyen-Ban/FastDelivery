const { Order, OrderDetail, OrderAddon } = require("../models/index");

const createOrder = async (orderData) => {
    const order = await Order.create(orderData);
    return order;
};

const createOrderDetailByOrderId = async (orderId, orderDetailData) => {
    const orderDetail = await OrderDetail.create({ ...orderDetailData, orderId });
    return orderDetail;
};

const createOrderAddonByOrderId = async (orderId, orderAddonData) => {
    const orderAddon = await OrderAddon.create({ ...orderAddonData, orderId });
    return orderAddon;
};



module.exports = { createOrder, createOrderDetailByOrderId, createOrderAddonByOrderId };

