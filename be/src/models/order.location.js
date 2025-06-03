const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderLocation = sequelize.define('OrderLocation', {
    orderId: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        unique: true,
        allowNull: false,
        field: 'order_id'
    },
    pickupTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'pickup_title'
    },
    dropoffTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'dropoff_title'
    },
    pickupAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'pickup_address'
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
    dropoffAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'dropoff_address'
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