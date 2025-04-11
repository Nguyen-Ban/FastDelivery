const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const validate = require('../validations/validate');
const { updateUserSchema } = require('../validations/user.validation');
const { changePasscodeSchema } = require('../validations/profile.validation');
const { getProfile, updateProfile, changePasscode } = require('../controllers/profile.controller');
const router = express.Router();

router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, validate(updateUserSchema), updateProfile);
router.patch('/passcode', authenticateToken, validate(changePasscodeSchema), changePasscode);

module.exports = router;
