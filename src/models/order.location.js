const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderLocation = sequelize.define('OrderLocation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id'
    },
    pickupAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'pickup_address'
    },
    dropoffAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'dropoff_address'
    },
    pickupLat: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
        field: 'pickup_lat'
    },
    pickupLng: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
        field: 'pickup_lng'
    },
    dropoffLat: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
        field: 'dropoff_lat'
    },
    dropoffLng: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
        field: 'dropoff_lng'
    }
}, {
    tableName: 'order_location',
    timestamps: false
});

module.exports = OrderLocation;