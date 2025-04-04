const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'customer_id'
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'driver_id'
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
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'price'
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'ASSIGNED', 'PICKED_UP', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'PENDING',
        field: 'status'
    }
}, {
    tableName: 'order',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Order;