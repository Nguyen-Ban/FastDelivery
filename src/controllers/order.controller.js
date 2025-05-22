const { Order, OrderDetail, OrderAddon, OrderLocation } = require("../models/index");
const { sequelize } = require("../config/database");
const { logger } = require("../config/logger");
const { calPrice } = require("../services/price.service");

const getPrices = async (req, res) => {
    const { transportType, orgLat, orgLng, desLat, desLng } = req.query;
    console.log("transportType", transportType, "orgLat", orgLat, "orgLng", orgLng, "desLat", desLat, "desLng", desLng);

    try {
        const { economyPrice, expressPrice } = await calPrice(transportType, { lat: orgLat, lng: orgLng }, { lat: desLat, lng: desLng });
        return res.status(200).json({
            success: true,
            message: "Price calculated successfully",
            data: {
                economyPrice,
                expressPrice
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error calculating price",
            error: error.message
        });
    }
}


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

module.exports = { getOrderList, getPrices };

