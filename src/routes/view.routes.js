const express = require('express');
const router = express.Router();
const { handleVnpayReturn } = require('../controllers/order.controller');

// VNPay return URL route
router.get('/order/vnpay_return', handleVnpayReturn);

module.exports = router; 