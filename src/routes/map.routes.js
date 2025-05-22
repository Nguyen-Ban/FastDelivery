const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const validate = require('../validations/validate');
const router = express.Router();
const { suggestPlaces, getPlacesFromLocation, getDistanceBetweenTwoLocation, fetchPolyline } = require('../controllers/map.controller');

router.post('/suggest', suggestPlaces);

router.get('/revgeocode', getPlacesFromLocation);

router.get('/distance', getDistanceBetweenTwoLocation)

router.get('/polyline', fetchPolyline);



module.exports = router;