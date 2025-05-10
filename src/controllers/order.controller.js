const { Order, OrderDetail, OrderAddon, OrderLocation } = require("../models/index");
const { sequelize } = require("../config/database");
const { logger } = require("../config/logger");




const getOrderList = async (req, res) => {
    const userId = req.userId;
    const activeRole = req.activeRole;

    try {
        let orders = null;
        if (activeRole == 'CUSTOMER') {
            orders = await Order.findAll({
                where: {
                    customerId: userId
                }
            });
        } else {
            orders = await Order.findAll({
                where: {
                    driverId: userId
                }
            });
        }
        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Orders fetched failed",
            error: error.message
        })
    }
};

module.exports = { getOrderList };

