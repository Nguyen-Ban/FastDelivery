const User = require('./user.model');
const Driver = require('./driver.model');
const Order = require('./order.model');
const OrderDetail = require('./orderDetail.model');
const OrderAddon = require('./orderAddon');

// User associations
User.hasOne(Driver, {
    foreignKey: 'userId',
    as: 'driver'
});

User.hasMany(Order, {
    foreignKey: 'customerId',
    as: 'orders'
});

// Driver associations
Driver.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Driver.hasMany(Order, {
    foreignKey: 'driverId',
    as: 'orders'
});

// Order associations
Order.belongsTo(User, {
    foreignKey: 'customerId',
    as: 'customer'
});

Order.belongsTo(Driver, {
    foreignKey: 'driverId',
    as: 'driver'
});

// OrderDetail associations
OrderDetail.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});


Order.hasOne(OrderDetail, {
    foreignKey: 'orderId',
    as: 'details'
});

// OrderAddon associations
OrderAddon.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});

Order.hasOne(OrderAddon, {
    foreignKey: 'orderId',
    as: 'addons'
});



module.exports = {
    User,
    Driver,
    Order,
    OrderDetail,
    OrderAddon
}; 