const { default: axios } = require("axios");
const redisClient = require("../config/redis");
const { getDriverSocket } = require("./websocket/driver");
const { Driver } = require("../models/index");

const HERE_API_KEY = process.env.HERE_API_KEY;

const getDurationBasedOnRoadRoute = async (transportMode, origin, destination) => {
    try {
        const res = await axios.get(`https://router.hereapi.com/v8/routes?transportMode=${transportMode}&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&return=summary&apikey=${HERE_API_KEY}`);
        return res.data.routes[0].sections[0].summary.duration;
    } catch (error) {
        console.error('Error getting driver to order duration:', error);
        return null;
    }
}

const getAvailableNearestDrivers = async (transportType, orderPickUpLocation) => {
    const { pickupLat: lat, pickupLng: lng } = orderPickUpLocation;

    const driverKeys = await redisClient.zrange('drivers:locations', 0, -1); // lấy tất cả driver IDs

    const driverLocations = await Promise.all(
        driverKeys.map(id => redisClient.geopos('drivers:locations', id))
    );

    const transportMode = transportType === 'MOTORBIKE' ? 'scooter' : 'car'

    const drivers = driverKeys.map((id, index) => ({
        id,
        duration: driverLocations[index][0] ? getDurationBasedOnRoadRoute(transportMode,
            { lng: driverLocations[index][0][0], lat: driverLocations[index][0][1] }, { lat, lng }) : null,
    }));

    drivers.sort((a, b) => a.duration - b.duration);

    return drivers; // [{id, lng, lat}]
}



const matchDriver = async (transportType, orderPickUpLocation, orderDetail) => {
    let resDriver = null;
    const drivers = await getAvailableNearestDrivers(transportType, orderPickUpLocation)
    for (const driver of drivers) {
        const socket = getDriverSocket(driver.id);
        socket.emit('order:request', {
            success: true,
            message: 'Order request',
            data: orderDetail
        });
        const response = await waitForDriverResponse(socket);
        if (response?.success) {
            resDriver = driver;
            setImmediate(async () => {
                const driverInstance = await Driver.findByPk(driver.id);
                if (driverInstance) {
                    await driverInstance.update({ status: 'BUSY' });
                    console.log(`Driver ${driver.id} went busy.`);
                }
            });
            console.log('1', resDriver)

            break;
        }
        console.log('2', resDriver)

    }
    console.log('3', resDriver)
    return resDriver;
}

const waitForDriverResponse = async (socket) => {
    return await new Promise((resolve) => {
        const onResponse = (data) => {
            clearTimeout(timeout);
            resolve(data);
        };

        const timeout = setTimeout(() => {
            socket.off('order:request', onResponse);
            resolve(null);
        }, 10000);

        socket.once('order:request', onResponse);
    });
}

const driverDirectionSupport = async (transportType, driverLocation, orderLocation) => {
    const transportMode = transportType === 'MOTORBIKE' ? 'scooter' : 'car'
    return await directRoute(transportMode, driverLocation, orderLocation);
}

const directRoute = async (transportMode, origin, destination) => {
    try {
        const res = await axios.get(`https://router.hereapi.com/v8/routes?transportMode=${transportMode}&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&return=summary,polyline,actions,instructions&lang=vi&apikey=${HERE_API_KEY}`);

        const section = res.data.routes[0].sections[0];
        const actions = section.actions;
        const polyline = section.polyline;

        return {
            actions,
            polyline
        };
    } catch (error) {
        console.error('Error getting route direction:', error);
        return null;
    }
}


module.exports = { matchDriver, driverDirectionSupport };
