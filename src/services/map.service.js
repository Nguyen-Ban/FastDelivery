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

module.exports = { suggestLocation }