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

const getInfoBasedOnRoadRoute = async (transportType, origin, destination) => {
    try {
        console.log('Getting route info for:', transportType, origin, destination);
        const transportMode = transportType === 'MOTORBIKE' ? 'scooter' : 'car';
        const res = await axios.get(`https://router.hereapi.com/v8/routes?transportMode=${transportMode}&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&return=summary&routingMode=fast&departureTime=${new Date().toISOString()}&apikey=${HERE_API_KEY}`);
        console.log('Route info response:', res.data);
        return res.data.routes[0].sections[0].summary;
    } catch (error) {
        console.error('Error getting driver to order duration:', error);
        return null;
    }
}

const getPolyline = async (transportType, origin, destination) => {
    try {
        const transportMode = transportType === 'MOTORBIKE' ? 'scooter' : 'car';

        const res = await axios.get(`https://router.hereapi.com/v8/routes?transportMode=${transportMode}&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&return=polyline&lang=vi&apikey=${HERE_API_KEY}`);

        const section = res.data.routes[0].sections[0];
        const polyline = section.polyline;
        console.log('Polyline:', polyline);

        return polyline;
    } catch (error) {
        console.error('Error getting route direction:', error);
        return null;
    }
}

module.exports = { suggestLocation, reverseGeocode, getInfoBasedOnRoadRoute, getPolyline };