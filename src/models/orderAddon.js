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
    doorToDoor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'door_to_door'
    },
    bulkyDelivery: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'bulky_delivery'
    }
}, {
    tableName: 'order_addon',
    timestamps: false
});

module.exports = OrderAddon;