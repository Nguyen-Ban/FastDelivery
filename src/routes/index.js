const express = require('express');
const authRoutes = require('./auth.routes');
const orderRoutes = require('./order.routes');
const driverRoutes = require('./driver.routes');
const adminRoutes = require('./admin.routes');
const profileRoutes = require('./profile.routes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/order', orderRoutes);
router.use('/driver', driverRoutes);    
router.use('/admin', adminRoutes);
router.use('/profile', profileRoutes);

module.exports = router;

