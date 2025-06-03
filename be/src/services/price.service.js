const { getInfoBasedOnRoadRoute } = require("./map.service");

// Bảng giá theo từng loại phương tiện
const FARE_CONFIG = {
    MOTORBIKE: {
        baseFare: 10000,
        distanceFare: 3000, // per km
        timeFare: 300,       // per minute
    },
    VAN: {
        baseFare: 20000,
        distanceFare: 6000, // per km
        timeFare: 600,       // per minute
    },
    PICKUP_TRUCK: {
        baseFare: 40000,
        distanceFare: 9000, // per km
        timeFare: 900,       // per minute
    },
    TRUCK: {
        baseFare: 80000,
        distanceFare: 12000, // per km
        timeFare: 1200,       // per minute
    },
};

const calPrice = async (vehicleType, origin, destination,) => {
    // Lấy thông tin từ API: quãng đường (km), thời gian (phút)
    const { length: distance, duration } = await getInfoBasedOnRoadRoute(
        vehicleType,
        origin,
        destination
    );


    const fare = FARE_CONFIG[vehicleType];

    if (!fare) {
        throw new Error(`Unsupported vehicle type: ${vehicleType}`);
    }

    // Tính tổng chi phí
    const price =
        fare.baseFare +
        fare.distanceFare * distance / 1000 +
        fare.timeFare * duration / 60;

    return {
        economyPrice: price,
        expressPrice: price * 1.5,
    };
};


module.exports = { calPrice };
