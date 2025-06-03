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
        type: DataTypes.ENUM('MOTORBIKE', 'VAN', 'PICKUP_TRUCK', 'TRUCK'),
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
    },
    autoAccept: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'auto_accept'
    },
    earning: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'earning',
        defaultValue: 0,
        get() {
            const rawValue = this.getDataValue('earning');
            return parseFloat(rawValue);
        }
    }
}, {
    tableName: 'driver',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Driver;