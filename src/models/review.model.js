const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
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
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'rating'
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'comment'
    }
}, {
    tableName: 'review',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Review;