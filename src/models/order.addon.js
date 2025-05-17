const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderAddon = sequelize.define('OrderAddon', {
    orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        field: 'order_id'
    },
    handDelivery: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'hand_delivery'
    },
    fragileDelivery: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'fragile_delivery'
    },
    donateDriver: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        field: 'donate_driver'
    },
    homeMoving: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'home_moving'
    },
    loading: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'loading'
    },
    businessValue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        field: 'business_value'
    },
    eDocument: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'e_document'
    },
    waiting: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'waiting'
    },
}, {
    tableName: 'order_addon',
    timestamps: false
});

module.exports = OrderAddon;