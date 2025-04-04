const express = require('express');
const router = express.Router();
const { placeOrder, getOrderList } = require('../controllers/order.controller');
const validate = require('../validations/validate');
const { placeOrderValidation, getOrderListValidation } = require('../validations/order.validation');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/', authenticateToken, validate(placeOrderValidation), placeOrder);
router.post('/list', authenticateToken, validate(getOrderListValidation), getOrderList);

module.exports = router;


