const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const validate = require('../validations/validate');
const { checkRole } = require('../middleware/auth.middleware');
const { createDriverSchema, reviewDriverSchema } = require('../validations/driver.validation');
const { registerDriver, checkDriver, getDriverList, fetchDriverById, assessDriverAuth, reviewDriver, autoAccept } = require('../controllers/driver.controller');
const router = express.Router();


// customer
router.post('/register', authenticateToken, checkRole(['CUSTOMER']), validate(createDriverSchema), registerDriver);
router.post('/review', authenticateToken, checkRole(['CUSTOMER']), validate(reviewDriverSchema), reviewDriver);
router.get('/check-registered', authenticateToken, checkRole(['CUSTOMER']), checkDriver);

//driver
router.post('/auto-accept', authenticateToken, autoAccept);

// admin
router.get('/list', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), getDriverList);
router.get('/:id', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), fetchDriverById);
router.patch('/register/:id', authenticateToken, checkRole(['SYSADMIN', 'ADMIN']), assessDriverAuth);


module.exports = router;