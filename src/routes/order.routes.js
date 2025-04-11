const express = require('express');
const router = express.Router();
const { getOrderList } = require('../controllers/order.controller');
const validate = require('../validations/validate');
const { authenticateToken } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/auth.middleware');




// router.post('/:id/review', authenticateToken, checkRole(['CUSTOMER']), validate(reviewOrderValidation), reviewOrder);
router.get('/customer/list', authenticateToken, checkRole(['CUSTOMER']), getOrderList);
// router.get('/customer/stats', authenticateToken, checkRole(['CUSTOMER']), getCustomerOrderStats);

router.get('/driver/list', authenticateToken, checkRole(['DRIVER']), getOrderList);
// router.get('/driver/stats', authenticateToken, checkRole(['DRIVER']), getDriverOrderStats);
module.exports = router;


