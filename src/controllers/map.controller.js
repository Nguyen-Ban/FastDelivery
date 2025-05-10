const { suggestLocation, reverseGeocode } = require("../services/map.service")

const suggestPlaces = async (req, res) => {
    const query = req.query.q;
    const userLocation = req.body.userLocation;
    try {
        const places = await suggestLocation(userLocation, query);
        if (places) {
            res.status(200).json({
                success: true,
                message: "Places suggested successfully",
                data: places
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

const getPlaceFromLocation = async (req, res) => {
    const { lng, lat } = req.query;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    try {
        const place = await reverseGeocode(latitude, longitude);
        if (place) {
            res.status(200).json({
                success: true,
                message: "Places suggested successfully",
                data: {
                    title: place.title,
                    address: place.address,
                    distance: place.distance,
                    categories: place.categories
                }
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
module.exports = {
    suggestPlaces,
    getPlaceFromLocation
}