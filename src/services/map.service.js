const { default: axios } = require("axios");

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
                apiKey: HERE_API_KEY
            }
        });
        return res.data.items[0];
    } catch (error) {
        console.error('Error getting address from coordinates:', error);
        return null;
    }
};

module.exports = { suggestLocation, reverseGeocode }