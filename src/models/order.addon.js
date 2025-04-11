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
        allowNull: false,
        defaultValue: false,
        field: 'hand_delivery'
    },
    fragileDelivery: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'fragile_delivery'
    }, 
    donateDriver: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'donate_driver'
    }
}, {
    tableName: 'order_addon',
    timestamps: false
});

module.exports = OrderAddon;