const express = require('express');
const { getDriverList, fetchDriverById, patchDriverApprovalStatus } = require("../controllers/admin.controller");
const validate = require("../validations/validate");
const { patchDriverApprovalStatusSchema } = require("../validations/driver.validation");
const router = express.Router();

router.get('/driver-list', getDriverList);
router.get('/driver/:id', fetchDriverById);
router.patch('/driver/:id', validate(patchDriverApprovalStatusSchema), patchDriverApprovalStatus);

module.exports = router;

