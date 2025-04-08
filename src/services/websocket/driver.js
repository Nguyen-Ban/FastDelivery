const driverSocketMap = new Map();

const registerDriverSocket = (driverId, socket) => {
    driverSocketMap.set(driverId, socket);
}

const getDriverSocket = (driverId) => {
    return driverSocketMap.get(Number(driverId)) || null;
}

module.exports = {
    registerDriverSocket,
    getDriverSocket,
}
