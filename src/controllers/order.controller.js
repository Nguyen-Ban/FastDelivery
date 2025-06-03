const { Order, OrderDetail, OrderAddon, OrderSenderReceiver, OrderSpecialDemand, Driver, User, OrderLocation } = require("../models/index");
const { sequelize } = require("../config/database");
const { logger } = require("../config/logger");
const { calPrice } = require("../services/price.service");
const { Op, fn, col, literal } = require('sequelize');


const getPrices = async (req, res) => {
    const { vehicleType, origin, destination } = req.query;
    const [orgLatStr, orgLngStr] = origin.split(',')
    const [desLatStr, desLngStr] = destination.split(',')
    const orgLat = parseFloat(orgLatStr);
    const orgLng = parseFloat(orgLngStr)
    const desLat = parseFloat(desLatStr)
    const desLng = parseFloat(desLngStr)

    try {
        const { economyPrice, expressPrice } = await calPrice(vehicleType, { lat: orgLat, lng: orgLng }, { lat: desLat, lng: desLng });
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
        const orderQuery = {
            include: [
                {
                    model: OrderLocation,
                    as: 'location',
                    attributes: [
                        'pickupTitle', 'dropoffTitle',
                        'pickupAddress', 'dropoffAddress',
                        'pickupLat', 'pickupLng',
                        'dropoffLat', 'dropoffLng'
                    ]
                },
                {
                    model: OrderDetail,
                    as: 'detail',
                    attributes: [
                        'packageType', 'weightKg',
                        'lengthCm', 'widthCm', 'heightCm',
                        'sizeName'
                    ]
                },
                {
                    model: OrderSenderReceiver,
                    as: 'senderReceiver',
                    attributes: [
                        'senderName', 'senderPhoneNumber',
                        'receiverName', 'receiverPhoneNumber'
                    ]
                },
                {
                    model: OrderSpecialDemand,
                    as: 'specialDemand',
                    attributes: [
                        'handDelivery', 'fragileDelivery', 'donateDriver',
                        'homeMoving', 'loading', 'businessValue',
                        'eDocument', 'waiting'
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        };

        if (activeRole === 'CUSTOMER') {
            orders = await Order.findAll({
                ...orderQuery,
                where: {
                    customerId: userId
                }
            });
        } else {
            orders = await Order.findAll({
                ...orderQuery,
                where: {
                    driverId: userId
                }
            });
        }

        // Transform the data structure
        const transformedOrders = orders.map(order => {
            const plainOrder = order.get({ plain: true });
            return {
                id: plainOrder.id,
                price: plainOrder.deliveryPrice + plainOrder.addonPrice + plainOrder.carPrice,
                time: plainOrder.created_at,
                vehicleType: plainOrder.vehicleType,
                deliveryType: plainOrder.deliveryType,
                pickupAddress: plainOrder.location.pickupAddress,
                dropoffAddress: plainOrder.location.dropoffAddress,
                status: plainOrder.status
            };
        });

        console.log(transformedOrders)

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: transformedOrders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Orders fetched failed",
            error: error.message
        });
    }
};

const getOrderEvent = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params
    const order = await Order.findByPk(id);
    const orderLocation = await OrderLocation.findByPk(id);
    const driver = await Driver.findByPk(order.driverId);
    const user = await User.findByPk(driver.userId);
    return res.status(200).json({
        success: true,
        data: {
            id: id,
            driverName: user.fullName,
            driverPhoneNumber: user.phoneNumber,
            vehicleType: order.vehicleType,
            deliveryType: order.deliveryType,
            pickupAddress: orderLocation.pickupAddress,
            dropoffAddress: orderLocation.dropoffAddress,
            status: order.status,
            price: order.deliveryPrice + order.addonPrice + order.carPrice,
            time: order.created_at
        }
    })
}


const getCustomerStats = async (req, res) => {
    try {
        const customerId = req.userId;
        const today = new Date();

        // Calculate dates for last 6 months
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of current month
        const startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1); // Start of 6 months ago

        const query = `
            SELECT 
                EXTRACT(MONTH FROM created_at) AS month,
                EXTRACT(YEAR FROM created_at) AS year,
                COALESCE(SUM(delivery_price + COALESCE(addon_price, 0) + COALESCE(car_price, 0)), 0) AS total
            FROM \`order\`
            WHERE customer_id = :customerId 
                AND status = 'DELIVERED'
                AND created_at BETWEEN :startDate AND :endDate
            GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
            ORDER BY year DESC, month DESC
            LIMIT 6;
        `;

        const orders = await sequelize.query(query, {
            replacements: {
                customerId,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            },
            type: sequelize.QueryTypes.SELECT
        });

        // Initialize arrays for all 6 months
        const labels = [];
        const monthlySpending = Array(6).fill(0);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Fill in labels for all 6 months first
        for (let i = 0; i < 6; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
            labels.push({
                month: months[date.getMonth()],
                year: date.getFullYear()
            });
        }


        // Fill in spending data where we have it
        orders.forEach(order => {
            // Calculate how many months ago this order was
            const orderDate = new Date(order.year, order.month - 1, 1);
            const monthsAgo = (today.getFullYear() - orderDate.getFullYear()) * 12
                + (today.getMonth() - orderDate.getMonth());

            if (monthsAgo >= 0 && monthsAgo < 6) {
                const index = 5 - monthsAgo; // Convert to array index (5 is most recent)
                monthlySpending[index] = parseFloat(order.total) || 0;
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                labels,
                monthlySpending,
                totalSpending: monthlySpending.reduce((a, b) => a + b, 0)
            }
        });


    } catch (error) {
        console.error('GetCustomerStats Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch customer statistics',
            error: error.message
        });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const today = new Date();
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);

        // Query for overall stats
        const statsQuery = `
            SELECT 
                COUNT(*) AS total_orders,
                COALESCE(SUM(delivery_price + addon_price + car_price), 0) AS total_price,
                COALESCE(SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END), 0) AS delivered_orders,
                COALESCE(SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END), 0) AS cancelled_orders
            FROM \`order\`
        `;

        // Query for monthly stats
        const monthlyQuery = `
            SELECT 
                EXTRACT(MONTH FROM created_at) AS month,
                EXTRACT(YEAR FROM created_at) AS year,
                COALESCE(SUM(delivery_price + COALESCE(addon_price, 0)+ COALESCE(car_price, 0)), 0) AS total
            FROM \`order\`
            WHERE created_at BETWEEN :startDate AND :endDate
                AND status = 'DELIVERED'
            GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
            ORDER BY year DESC, month DESC
            LIMIT 6;
        `;

        const [stats] = await sequelize.query(statsQuery, {
            type: sequelize.QueryTypes.SELECT
        });

        const monthlyData = await sequelize.query(monthlyQuery, {
            replacements: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            },
            type: sequelize.QueryTypes.SELECT
        });

        // Initialize arrays for all 6 months
        const labels = [];
        const monthlyRevenue = Array(6).fill(0);
        const months = ['1', '2', '3', '4', '5', '6',
            '7', '8', '9', '10', '11', '12'];

        // Fill in labels for all 6 months first
        for (let i = 0; i < 6; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
            labels.push({
                month: months[date.getMonth()],
                year: date.getFullYear()
            });
        }

        // Fill in revenue data where we have it
        monthlyData.forEach(data => {
            const orderDate = new Date(data.year, data.month - 1, 1);
            const monthsAgo = (today.getFullYear() - orderDate.getFullYear()) * 12
                + (today.getMonth() - orderDate.getMonth());

            if (monthsAgo >= 0 && monthsAgo < 6) {
                const index = 5 - monthsAgo;
                monthlyRevenue[index] = parseFloat(data.total) || 0;
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                // Overall stats
                revenue: parseFloat(stats.total_price) || 0,
                totalOrders: parseInt(stats.total_orders) || 0,
                deliveredOrders: parseInt(stats.delivered_orders) || 0,
                cancelledOrders: parseInt(stats.cancelled_orders) || 0,

                // Monthly stats
                labels,
                monthlyRevenue,
                totalMonthlyRevenue: monthlyRevenue.reduce((a, b) => a + b, 0)
            }
        });

    } catch (error) {
        console.error('GetAdminStats Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch admin statistics',
            error: error.message
        });
    }
};
module.exports = { getOrderList, getPrices, getOrderEvent, getCustomerStats, getAdminStats };

