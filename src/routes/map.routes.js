const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const validate = require('../validations/validate');
const router = express.Router();
const { suggestPlaces, getPlacesFromLocation } = require('../controllers/map.controller');

router.post('/suggest', suggestPlaces);

router.get('/revgeocode', getPlacesFromLocation);





module.exports = router;