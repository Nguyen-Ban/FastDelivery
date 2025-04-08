const { Order, OrderDetail, OrderAddon } = require("../models/index");
const { sequelize } = require("../config/database");
const { logger } = require("../config/logger");
const requests = new Map();

// 

const placeOrder = async (req, res) => {
    const requestId = uuidv4();
    const requestData = { request_id: requestId, ...req.body };

    requests.set(requestId, requestData);

    processOrderRequest(requestId);

    return res.status(202).json({
        status: 'accepted',
        request_id: requestId,
        websocket_url: `ws://${process.env.HOST}:${process.env.PORT}/status/${requestId}`
    });
}

const processOrderRequest = async (requestId) => {
    const clientWebSocket = new ClientWebSocket();
    if (!clientWebSocket) return;

    // find driver service

    clientWebSocket.send(JSON.stringify({
        status: 'success',
        type: 'order_request',
        request_id: requestId,
        websocket_url: `ws://${process.env.HOST}:${process.env.PORT}/track/${requestId}`
    }));
    clientWebSocket.close();
    requests.delete(requestId);
}



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

