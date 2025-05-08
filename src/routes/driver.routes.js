const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const validate = require('../validations/validate');
const { checkRole } = require('../middleware/auth.middleware');
const { createDriverSchema } = require('../validations/driver.validation');
const { registerDriver, getDriverList, fetchDriverById, approveDriverRegister, rejectDriverRegister, banDriver } = require('../controllers/driver.controller');
const router = express.Router();

// customer
router.post('/register', authenticateToken, checkRole(['CUSTOMER']), validate(createDriverSchema), registerDriver);

// admin
router.get('/list', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), getDriverList);
router.get('/:id', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), fetchDriverById);
router.patch('/register/:id/approve', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), approveDriverRegister);
router.patch('/register/:id/reject', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), rejectDriverRegister);
router.patch('/register/:id/ban', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), banDriver);

module.exports = router;