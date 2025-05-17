const { default: axios, get } = require("axios");

const HERE_API_KEY = process.env.HERE_API_KEY;
const suggestLocation = async (userLocation, query) => {
    try {
        const res = await axios.get(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=${userLocation.lat},${userLocation.lng}&lang=vi&q=${query}&apiKey=${HERE_API_KEY}`);
        return res.data.items;
    } catch (error) {
        console.error('Error getting suggested locations:', error);
        return null;
    }
}

const reverseGeocode = async (lat, lng) => {
    try {
        const res = await axios.get(`https://revgeocode.search.hereapi.com/v1/revgeocode`, {
            params: {
                at: `${lat},${lng}`,
                lang: 'vi',
                limit: 5,
                apiKey: HERE_API_KEY
            }
        });
        return res.data.items;
    } catch (error) {
        console.error('Error getting address from coordinates:', error);
        return null;
    }
};

const getDistanceBasedOnRoadRoute = async (transportMode, origin, destination) => {
    try {
        const res = await axios.get(`https://router.hereapi.com/v8/routes?transportMode=${transportMode}&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&return=summary&apikey=${HERE_API_KEY}`);
        return res.data.routes[0].sections[0].summary.distance;
    } catch (error) {
        console.error('Error getting driver to order duration:', error);
        return null;
    }
}

module.exports = { suggestLocation, reverseGeocode, getDistanceBasedOnRoadRoute };