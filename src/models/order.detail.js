const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderDetail = sequelize.define('OrderDetail', {
    orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        field: 'order_id'
    },
    packageType: {
        type: DataTypes.ENUM('DOCUMENT', 'ELECTRONICS', 'FOOD', 'CLOTHING', 'FRAGILE', 'OTHERS'),
        allowNull: false,
        field: 'package_type'
    },
    weightKg: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'weight_kg'
    },
    size: {
        type: DataTypes.ENUM('SMALL', 'MEDIUM', 'LARGE', 'X-LARGE'),
        allowNull: false,
        field: 'size'
    },
    deliveryInsurance: {
        type: DataTypes.ENUM('NO_INSURANCE', 'STANDARD', 'SILVER', 'GOLD'),
        allowNull: false,
        field: 'delivery_insurance'
    }
}, {
    tableName: 'order_detail',
    timestamps: false
});

module.exports = OrderDetail;