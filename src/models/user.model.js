const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'full_name'
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'date_of_birth'
    },
    gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHERS'),
        field: 'gender'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'email',
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'phone',
        validate: {
            is: /^\+[0-9]{9,14}$/ // Bắt đầu bằng +, theo sau 9-14 số
        }
    },
    passcode: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'passcode',
        set(value) {
            const hashedPasscode = bcrypt.hashSync(value, 10);
            this.setDataValue('passcode', hashedPasscode);
        }

    }
}, {
    tableName: 'user',
    timestamps: true, // Adds created_at and updated_at fields
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.prototype.comparePasscode = async function (passcode) {
    return await bcrypt.compare(passcode, this.passcode);
};

module.exports = { User };