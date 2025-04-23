const express = require('express');
const authRoutes = require('./auth.routes');
const orderRoutes = require('./order.routes');
const driverRoutes = require('./driver.routes');
const adminRoutes = require('./admin.routes');
const profileRoutes = require('./profile.routes');
const mapRoutes = require('./map.routes');
const notificationRoutes = require('./notification.routes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/order', orderRoutes);
router.use('/driver', driverRoutes);
router.use('/admin', adminRoutes);
router.use('/profile', profileRoutes);
router.use('/map', mapRoutes);
router.use('/notification', notificationRoutes);
module.exports = router;

