const express = require('express');
const validate = require('../validations/validate');
const { createDriverSchema } = require('../validations/driver.validation');
const { registerDriver } = require('../controllers/driver.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/register', authenticateToken, validate(createDriverSchema), registerDriver);
// router.post('/auto-accept', authenticateToken, autoAcceptOrder);
// router.post('/order/:id/accept', authenticateToken, acceptOrder);
// router.post('/order/:id/reject', authenticateToken, rejectOrder);
// router.patch('/order/:id/cancel', authenticateToken, cancelOrder);
// router.patch('/order/:id/complete', authenticateToken, completeOrder);

module.exports = router;    
