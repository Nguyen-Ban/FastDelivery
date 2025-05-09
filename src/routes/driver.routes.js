const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const validate = require('../validations/validate');
const { checkRole } = require('../middleware/auth.middleware');
const { createDriverSchema } = require('../validations/driver.validation');
const { registerDriver, getDriverList, fetchDriverById, assessDriverAuth } = require('../controllers/driver.controller');
const router = express.Router();

// customer
router.post('/register', authenticateToken, checkRole(['CUSTOMER']), validate(createDriverSchema), registerDriver);

// admin
router.get('/list', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), getDriverList);
router.get('/:id', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), fetchDriverById);
router.patch('/register/:id', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), assessDriverAuth);


module.exports = router;