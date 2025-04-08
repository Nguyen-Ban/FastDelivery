const redisClient = require("../config/redis");
const { getDriverSocket } = require("./websocket/driver");

const geoSearchNearbyDrivers = async (longitude, latitude) => {
    const key = "drivers:locations";
    const radius = 3; // km

    const results = await redisClient.send_command("GEOSEARCH", [
        key,
        "FROMLONLAT",
        longitude,
        latitude,
        "BYRADIUS",
        radius,
        "km",
        "WITHDIST",
        "WITHCOORD",
        "ASC",
    ]);

    return results;
};

const matchDriver = async (order) => {
    let resDriver = null;
    const drivers = await geoSearchNearbyDrivers(order.pickup_location.lng, order.pickup_location.lat);
    for (const driver of drivers) {
        const socket = getDriverSocket(driver[0]);
        socket.emit('order:request', {
            success: true,
            message: 'Order request',
            data: { order }
        });
        const response = await waitForDriverResponse(socket);
        console.log(response);
        if (response?.success) {
            resDriver = driver;
            break;
        }
    }
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

module.exports = { matchDriver };
