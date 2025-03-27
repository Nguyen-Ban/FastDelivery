const express = require('express');
const validate = require('../validations/validate');
const { createDriverSchema } = require('../validations/driver.validation');
const { registerDriver } = require('../controllers/driver.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/register', authenticateToken, validate(createDriverSchema), registerDriver);

module.exports = router;    
