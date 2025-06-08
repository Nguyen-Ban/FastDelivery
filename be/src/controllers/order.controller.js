const { Order, OrderDetail, OrderAddon, OrderSenderReceiver, OrderSpecialDemand, Driver, User, OrderLocation, Payment } = require("../models/index");
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
                packageType: plainOrder.detail.packageType,
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
    const payment = await Payment.findOne({ where: { orderId: id } });


    return res.status(200).json({
        success: true,
        data: {
            id: id,
            driverName: user.fullName,
            driverPhoneNumber: user.phoneNumber,
            vehicleType: order.vehicleType,
            deliveryType: order.deliveryType,
            paymentStatus: payment.status,
            paymentMethod: payment.paymentMethod,
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

const getDriverOrderEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id, {
            include: [
                {
                    model: OrderLocation,
                    as: 'location',
                    attributes: ['pickupAddress', 'dropoffAddress']
                },
                {
                    model: OrderSenderReceiver,
                    as: 'senderReceiver',
                    attributes: ['senderName', 'senderPhoneNumber', 'receiverName', 'receiverPhoneNumber']
                },
                {
                    model: OrderDetail,
                    as: 'detail',
                    attributes: ['packageType', 'weightKg', 'lengthCm', 'widthCm', 'heightCm', 'sizeName']
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
            ]
        });


        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const plainOrder = order.get({ plain: true });

        const payment = await Payment.findOne({ where: { orderId: id } });


        return res.status(200).json({
            success: true,
            data: {
                id: plainOrder.id,
                sender: {
                    name: plainOrder.senderReceiver.senderName,
                    phoneNumber: plainOrder.senderReceiver.senderPhoneNumber
                },
                receiver: {
                    name: plainOrder.senderReceiver.receiverName,
                    phoneNumber: plainOrder.senderReceiver.receiverPhoneNumber
                },
                vehicleType: plainOrder.vehicleType,
                deliveryType: plainOrder.deliveryType,
                pickupAddress: plainOrder.location.pickupAddress,
                dropoffAddress: plainOrder.location.dropoffAddress,
                status: plainOrder.status,
                price: plainOrder.deliveryPrice + plainOrder.addonPrice + plainOrder.carPrice,
                time: plainOrder.createdAt,
                detail: {
                    packageType: plainOrder.detail.packageType,
                    weightKg: plainOrder.detail.weightKg,
                    lengthCm: plainOrder.detail.lengthCm,
                    widthCm: plainOrder.detail.widthCm,
                    heightCm: plainOrder.detail.heightCm,
                    sizeName: plainOrder.detail.sizeName
                },
                specialDemand: plainOrder.specialDemand,
                paymentStatus: payment.status,
                paymentMethod: payment.paymentMethod,
            }
        });

    } catch (error) {
        console.error('GetDriverOrderEvent Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order event",
            error: error.message
        });
    }
};

const getDriverStats = async (req, res) => {
    try {
        const driverId = req.userId;
        const today = new Date();

        // Calculate dates for last 6 months
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);

        // Query for overall stats
        const statsQuery = `
            SELECT 
                COUNT(*) AS total_orders,
                COALESCE(SUM(delivery_price + COALESCE(addon_price, 0) + COALESCE(car_price, 0))/2, 0) AS total_earnings,
                COALESCE(SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END), 0) AS delivered_orders,
                COALESCE(SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END), 0) AS cancelled_orders
            FROM \`order\`
            WHERE driver_id = :driverId
        `;

        // Query for monthly stats
        const monthlyQuery = `
            SELECT 
                EXTRACT(MONTH FROM created_at) AS month,
                EXTRACT(YEAR FROM created_at) AS year,
                COALESCE(SUM(delivery_price + COALESCE(addon_price, 0) + COALESCE(car_price, 0))/2, 0) AS total
            FROM \`order\`
            WHERE driver_id = :driverId
                AND status = 'DELIVERED'
                AND created_at BETWEEN :startDate AND :endDate
            GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
            ORDER BY year DESC, month DESC
            LIMIT 6;
        `;

        const [stats] = await sequelize.query(statsQuery, {
            replacements: { driverId },
            type: sequelize.QueryTypes.SELECT
        });

        const monthlyData = await sequelize.query(monthlyQuery, {
            replacements: {
                driverId,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            },
            type: sequelize.QueryTypes.SELECT
        });

        // Initialize arrays for all 6 months
        const labels = [];
        const monthlyEarnings = Array(6).fill(0);
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

        // Fill in earnings data where we have it
        monthlyData.forEach(data => {
            const orderDate = new Date(data.year, data.month - 1, 1);
            const monthsAgo = (today.getFullYear() - orderDate.getFullYear()) * 12
                + (today.getMonth() - orderDate.getMonth());

            if (monthsAgo >= 0 && monthsAgo < 6) {
                const index = 5 - monthsAgo;
                monthlyEarnings[index] = parseFloat(data.total) || 0;
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                // Overall stats
                totalEarnings: parseFloat(stats.total_earnings) || 0,
                totalOrders: parseInt(stats.total_orders) || 0,
                deliveredOrders: parseInt(stats.delivered_orders) || 0,
                cancelledOrders: parseInt(stats.cancelled_orders) || 0,

                // Monthly stats
                labels,
                monthlyEarnings,
                totalMonthlyEarnings: monthlyEarnings.reduce((a, b) => a + b, 0)
            }
        });

    } catch (error) {
        console.error('GetDriverStats Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch driver statistics',
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

const handleVnpayReturn = async (req, res) => {
    try {
        const {
            vnp_Amount,
            vnp_BankCode,
            vnp_BankTranNo,
            vnp_CardType,
            vnp_OrderInfo,
            vnp_PayDate,
            vnp_ResponseCode,
            vnp_TmnCode,
            vnp_TransactionNo,
            vnp_TransactionStatus,
            vnp_TxnRef,
            vnp_SecureHash
        } = req.query;
        if (vnp_ResponseCode === '00') {
            const payment = await Payment.findOne({ where: { orderId: vnp_TxnRef } });

            if (payment) {
                payment.status = 'COMPLETED';
                payment.transactionDate = vnp_PayDate; // nếu cần
                payment.transactionNo = vnp_TransactionNo;
                await payment.save();
            }
        }
        // Render the VNPay return page with the payment details
        res.render('vnpay-return', {
            vnp_Amount,
            vnp_BankCode,
            vnp_BankTranNo,
            vnp_CardType,
            vnp_OrderInfo,
            vnp_PayDate,
            vnp_ResponseCode,
            vnp_TmnCode,
            vnp_TransactionNo,
            vnp_TransactionStatus,
            vnp_TxnRef,
            vnp_SecureHash
        });
    } catch (error) {
        logger.error(`[OrderController] Error handling VNPay return: ${error}`);
        res.status(500).render('vnpay-return', {
            error: 'An error occurred while processing your payment'
        });
    }
};

module.exports = { getOrderList, getPrices, getOrderEvent, getCustomerStats, getAdminStats, getDriverOrderEvent, getDriverStats, handleVnpayReturn };

