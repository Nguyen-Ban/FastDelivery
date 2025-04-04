const express = require('express');
const authRoutes = require('./auth.routes');
const driverRoutes = require('./driver.routes');
const adminRoutes = require('./admin.routes');
const orderRoutes = require('./order.routes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/driver', driverRoutes);
router.use('/admin', adminRoutes);
router.use('/order', orderRoutes);

module.exports = router;

