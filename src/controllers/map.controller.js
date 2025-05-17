const { suggestLocation, reverseGeocode, getDistanceBasedOnRoadRoute } = require("../services/map.service")

const suggestPlaces = async (req, res) => {
    const query = req.query.q;
    const userLocation = req.body.userLocation;
    try {
        const places = await suggestLocation(userLocation, query);
        if (places) {
            res.status(200).json({
                success: true,
                message: "Places suggested successfully",
                data: places.map(place => ({
                    id: place.id,
                    title: place.title,
                    address: place.address?.label,
                    distance: place.distance,
                    position: place.position,
                }))
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No places found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error suggesting places",
            error: error.message
        });
    }
}

const getPlacesFromLocation = async (req, res) => {
    const { lng, lat } = req.query;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    try {
        const places = await reverseGeocode(latitude, longitude);
        if (places) {
            res.status(200).json({
                success: true,
                message: "Places suggested successfully",
                data: places.map(place => {
                    return {
                        id: place.id,
                        title: place.title,
                        address: place.address?.label,
                        distance: place.distance,
                        position: place.position,
                    }
                })
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No place found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error get place",
            error: error.message
        });
    }
}

const getDistanceBetweenTwoLocation = async (req, res) => {
    const { transportType, orgLat, orgLng, desLat, desLng } = req.query;
    const transportMode = transportType === 'MOTORBIKE' ? 'scooter' : 'car'

    try {
        const distance = await getDistanceBasedOnRoadRoute(transportMode, { lat: orgLat, lng: orgLng }, { lat: desLat, lng: desLng });
        if (distance) {
            res.status(200).json({
                success: true,
                message: "Distance calculated successfully",
                data: distance
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No distance found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error calculating distance",
            error: error.message
        });
    }
}

module.exports = {
    suggestPlaces,
    getPlacesFromLocation,
    getDistanceBetweenTwoLocation
}