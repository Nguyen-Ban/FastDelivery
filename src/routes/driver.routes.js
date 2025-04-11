const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const validate = require('../validations/validate');
const { checkRole } = require('../middleware/auth.middleware');
const { createDriverSchema } = require('../validations/driver.validation');
const { registerDriver } = require('../controllers/driver.controller');
const router = express.Router();


router.post('/register', authenticateToken, checkRole(['CUSTOMER']), validate(createDriverSchema), registerDriver);




module.exports = router;