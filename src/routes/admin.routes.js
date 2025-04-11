const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { getDriverList, fetchDriverById, assessDriverRegister } = require('../controllers/admin.controller');
const { assessDriverRegisterSchema } = require('../validations/driver.validation');
const validate = require('../validations/validate');
const { checkRole } = require('../middleware/auth.middleware');
const router = express.Router();

// Manage drivers
router.get('/driver/list', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), getDriverList);
router.get('/driver/:id', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), fetchDriverById);
router.patch('/driver/:id', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), validate(assessDriverRegisterSchema), assessDriverRegister);


module.exports = router;