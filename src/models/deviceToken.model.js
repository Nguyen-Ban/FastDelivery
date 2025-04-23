const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DeviceToken = sequelize.define('DeviceToken', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'token'
    },
    platform: {
        type: DataTypes.ENUM('ios', 'android'),
        allowNull: false,
        field: 'platform'
    }
}, {
    tableName: 'device_token',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = DeviceToken;




