const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.STRING(6),
        primaryKey: true,
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
    vehicleType: {
        type: DataTypes.ENUM('MOTORBIKE', 'VAN', 'PICKUP_TRUCK', 'TRUCK'),
        allowNull: false,
        field: 'transport_type'
    },
    deliveryType: {
        type: DataTypes.ENUM('ECONOMY', 'EXPRESS'),
        allowNull: false,
        field: 'delivery_type'
    },
    deliveryPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'delivery_price',
        get() {
            const rawValue = this.getDataValue('deliveryPrice');
            return parseFloat(rawValue);
        }
    },
    carPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'car_price',
        get() {
            const rawValue = this.getDataValue('carPrice');
            return parseFloat(rawValue);
        }
    },
    addonPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'addon_price',
        get() {
            const rawValue = this.getDataValue('addonPrice');
            return parseFloat(rawValue);
        }
    },
    note: {
        type: DataTypes.STRING,
        field: 'note'
    },
    status: {
        type: DataTypes.ENUM('IN_DELIVERY', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'IN_DELIVERY',
        field: 'status'
    },
    cancelledBy: {
        type: DataTypes.ENUM('CUSTOMER', 'DRIVER'),
        field: 'cancelled_by'
    },
}, {
    tableName: 'order',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Order;