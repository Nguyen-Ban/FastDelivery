const express = require('express');
const router = express.Router();
const { placeOrder, getOrderList } = require('../controllers/order.controller');
const validate = require('../validations/validate');
const { placeOrderValidation, getOrderListValidation } = require('../validations/order.validation');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/', authenticateToken, validate(placeOrderValidation), placeOrder);
// router.put('/:id/cancel', authenticateToken, validate(cancelOrderValidation), cancelOrder);
// router.post('/:id/review', authenticateToken, validate(reviewOrderValidation), reviewOrder);
router.post('/list', authenticateToken, validate(getOrderListValidation), getOrderList);

module.exports = router;


