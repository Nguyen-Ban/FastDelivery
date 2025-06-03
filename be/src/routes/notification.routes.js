const express = require('express');
const router = express.Router();
const { registerDevice, unregisterDevice } = require('../controllers/notification.controller');

router.post('/register-device', registerDevice);
router.post('/unregister-device', unregisterDevice);

module.exports = router;






