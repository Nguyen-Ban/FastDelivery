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