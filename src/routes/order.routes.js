const express = require('express');
const router = express.Router();
const { getOrderList, getPrices, getOrderEvent, getCustomerStats, getAdminStats } = require('../controllers/order.controller');
const validate = require('../validations/validate');
const { authenticateToken } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/auth.middleware');


router.get('/prices', getPrices);

router.get('/admin/stats', getAdminStats);

router.get('/customer/stats', authenticateToken, getCustomerStats);

router.get('/event/:id', authenticateToken, getOrderEvent);

// router.post('/:id/review', authenticateToken, checkRole(['CUSTOMER']), validate(reviewOrderValidation), reviewOrder);
router.get('/customer/list', authenticateToken, checkRole(['CUSTOMER']), getOrderList);
// router.get('/customer/stats', authenticateToken, checkRole(['CUSTOMER']), getCustomerOrderStats);

router.get('/driver/list', authenticateToken, checkRole(['DRIVER']), getOrderList);
// router.get('/driver/stats', authenticateToken, checkRole(['DRIVER']), getDriverOrderStats);
module.exports = router;


