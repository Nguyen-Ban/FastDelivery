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
    lengthCm: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'length_cm'
    },
    widthCm: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'width_cm'
    },
    heightCm: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'height_cm'
    },
    sizeName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'size_name'
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