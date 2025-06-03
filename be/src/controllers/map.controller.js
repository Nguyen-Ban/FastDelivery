const { suggestLocation, reverseGeocode, getInfoBasedOnRoadRoute, getPolyline } = require("../services/map.service")

const suggestPlaces = async (req, res) => {
    const { lat, lng, q } = req.query;
    try {
        const places = await suggestLocation({ lng, lat }, q);
        if (places) {
            res.status(200).json({
                success: true,
                message: "Places suggested successfully",
                data: places.map(place => ({
                    id: place.id,
                    title: place.title,
                    address: place.address?.label,
                    distance: place.distance,
                    coord: place.position,
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

    try {
        const { length: distance } = await getInfoBasedOnRoadRoute(transportType, { lat: orgLat, lng: orgLng }, { lat: desLat, lng: desLng });
        if (distance) {
            res.status(200).json({
                success: true,
                message: "Distance calculated successfully",
                data: {
                    distance
                }
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

const fetchPolyline = async (req, res) => {
    const { vehicleType, origin, destination } = req.query;
    const [orgLatStr, orgLngStr] = origin.split(',')
    const [desLatStr, desLngStr] = destination.split(',')
    const orgLat = parseFloat(orgLatStr);
    const orgLng = parseFloat(orgLngStr)
    const desLat = parseFloat(desLatStr)
    const desLng = parseFloat(desLngStr)
    try {
        const polyline = await getPolyline(vehicleType, { lat: orgLat, lng: orgLng }, { lat: desLat, lng: desLng });
        if (polyline) {
            res.status(200).json({
                success: true,
                message: "Polyline calculated successfully",
                data: {
                    polyline
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No polyline found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error calculating polyline",
            error: error.message
        });
    }
}

module.exports = {
    suggestPlaces,
    getPlacesFromLocation,
    getDistanceBetweenTwoLocation,
    fetchPolyline
}