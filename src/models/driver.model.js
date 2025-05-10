const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Driver = sequelize.define('Driver', {
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        field: 'user_id'
    },
    licenseNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        field: 'license_number'
    },
    vehicleType: {
        type: DataTypes.ENUM('MOTORBIKE', 'VAN'),
        allowNull: false,
        field: 'vehicle_type'
    },
    vehiclePlate: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        field: 'vehicle_plate'
    },
    status: {
        type: DataTypes.ENUM('AVAILABLE', 'BUSY', 'OFFLINE'),
        defaultValue: 'OFFLINE',
        allowNull: false,
        field: 'status'
    },
    approvalStatus: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'BANNED'),
        defaultValue: 'PENDING',
        allowNull: false,
        field: 'approval_status'
    }
}, {
    tableName: 'driver',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Driver;