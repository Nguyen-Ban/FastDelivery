const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    orderId: {
        type: DataTypes.STRING(6),
        unique: true,
        allowNull: false,
        field: 'order_id',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'amount',
        get() {
            const rawValue = this.getDataValue('amount');
            return parseFloat(rawValue);
        }
    },
    paymentMethod: {
        type: DataTypes.ENUM('VNPAY', 'SENDER_CASH', 'RECEIVER_CASH'),
        allowNull: false,
        field: 'payment_method'
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'),
        allowNull: false,
        defaultValue: 'PENDING',
        field: 'status'
    },
    transactionDate: {
        type: DataTypes.STRING,
        unique: true,
        field: 'transaction_date'
    },
    transactionNo: {
        type: DataTypes.STRING,
        unique: true,
        field: 'transaction_no'
    }
}, {
    tableName: 'payment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Payment;