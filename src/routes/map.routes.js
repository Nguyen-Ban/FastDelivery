const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const validate = require('../validations/validate');
const router = express.Router();
const { suggestPlaces, getPlacesFromLocation, getDistanceBetweenTwoLocation } = require('../controllers/map.controller');

router.post('/suggest', suggestPlaces);

router.get('/revgeocode', getPlacesFromLocation);

router.get('/distance', getDistanceBetweenTwoLocation)



module.exports = router;