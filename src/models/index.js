const User = require('./user.model');
const Driver = require('./driver.model');
const Order = require('./order.model');
const OrderDetail = require('./order.detail');
const OrderAddon = require('./order.addon');
const OrderLocation = require('./order.location');
const Message = require('./message.model');
const DeviceToken = require('./deviceToken.model');
const Notification = require('./notification.model');
const Review = require('./review.model');
const OrderSenderReceiver = require('./order.senderReceiver');
// User associations
User.hasOne(Driver, {
    foreignKey: 'userId',
    as: 'driver'
});

User.hasMany(Order, {
    foreignKey: 'customerId',
    as: 'orders'
});

User.hasMany(Message, {
    foreignKey: 'senderId',
    as: 'sentMessages'
});

User.hasMany(Message, {
    foreignKey: 'receiverId',
    as: 'receivedMessages'
});

User.hasOne(DeviceToken, {
    foreignKey: 'userId',
    as: 'deviceToken'
});

User.hasMany(Notification, {
    foreignKey: 'userId',
    as: 'notifications'
});


// Notification associations
Notification.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// DeviceToken associations
DeviceToken.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
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

Order.hasMany(Message, {
    foreignKey: 'orderId',
    as: 'messages'
});

// OrderDetail associations
OrderDetail.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});


Order.hasOne(OrderDetail, {
    foreignKey: 'orderId',
    as: 'detail'
});

// OrderAddon associations
OrderAddon.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});

Order.hasOne(OrderAddon, {
    foreignKey: 'orderId',
    as: 'addon'
});


// OrderLocation associations
OrderLocation.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});

Order.hasOne(OrderLocation, {
    foreignKey: 'orderId',
    as: 'location'
});

// OrderSenderReceiver associations
OrderSenderReceiver.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});

Order.hasOne(OrderSenderReceiver, {
    foreignKey: 'orderId',
    as: 'senderReceiver'
});

// Message associations
Message.belongsTo(User, {
    foreignKey: 'senderId',
    as: 'sender'
});

Message.belongsTo(User, {
    foreignKey: 'receiverId',
    as: 'receiver'
});

Message.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});

Review.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});

Order.hasOne(Review, {
    foreignKey: 'orderId',
    as: 'review'
});



module.exports = {
    User,
    Driver,
    Order,
    OrderDetail,
    OrderAddon,
    OrderLocation,
    OrderSenderReceiver,
    Message,
    DeviceToken,
    Notification,
    Review
}; 