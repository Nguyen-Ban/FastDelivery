const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderSenderReceiver = sequelize.define('OrderSenderReceiver', {
    orderId: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        unique: true,
        allowNull: false,
        field: 'order_id'
    },
    senderName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'sender_name'
    },
    senderPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'sender_phone_number'
    },
    receiverName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'receiver_name'
    },
    receiverPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'receiver_phone_number'
    },
}, {
    tableName: 'order_sender_receiver',
    timestamps: false
});

module.exports = OrderSenderReceiver;