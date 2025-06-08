enum DELIVERY_TYPE {
    EXPRESS = 'EXPRESS',
    ECONOMY = 'ECONOMY'
}

enum VEHICLE_TYPES {
    MOTORBIKE = 'MOTORBIKE',
    VAN = 'VAN',
    PICKUP_TRUCK = 'PICKUP_TRUCK',
    TRUCK = 'TRUCK',
}

const vehicleOptions = [
    {
        id: VEHICLE_TYPES.VAN,
        name: "Xe VAN",
        dimensions: "Hàng hoá 145 x 145 x 95 cm. Tối đa 500kg",
        price: 132000,
        sizeLabel: "500",
    },
    {
        id: VEHICLE_TYPES.PICKUP_TRUCK,
        name: "Xe Bán Tải",
        dimensions: "Hàng hoá 180 x 160 x 110 cm. Tối đa 700kg",
        price: 159000,
        sizeLabel: "700",
    },
    {
        id: VEHICLE_TYPES.TRUCK,
        name: "Xe tải",
        dimensions: "Hàng hoá 290 x 160 x 160 cm. Tối đa 1000kg",
        price: 195000,
        sizeLabel: "1000",
    },
];

enum PACKAGE_TYPES {
    DOCUMENT = 'DOCUMENT',
    ELECTRONICS = 'ELECTRONICS',
    FOOD = 'FOOD',
    CLOTHING = 'CLOTHING',
    FRAGILE = 'FRAGILE',
    OTHERS = 'OTHERS'
}

enum ORDER_TYPES {
    MOTORBIKE_DELIVERY = 'MOTORBIKE_DELIVERY',
    CAR_DELIVERY = 'CAR_DELIVERY',
}

enum GENDER {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHERS = 'OTHERS'
}

enum ROLE {
    CUSTOMER = 'CUSTOMER',
    DRIVER = 'DRIVER',
    ADMIN = 'ADMIN',
    SYSADMIN = 'SYSADMIN'
}

enum LOCATION_TYPE {
    PICKUP = 'PICKUP',
    DROP_OFF = 'DROP_OFF',
}

enum DELIVERY_STATUS {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

enum DELIVERY_STATES {
    MOVING_TO_PICKUP = 'MOVING_TO_PICKUP',
    GOING_TO_PICKUP = 'GOING_TO_PICKUP',
    PICKING_UP = 'PICKING_UP',
    GOING_TO_DROPOFF = 'GOING_TO_DROPOFF',
    DELIVERING = 'DELIVERING',
}

enum DRIVER_STATUS {
    AVAILABLE = 'AVAILABLE',
    BUSY = 'BUSY',
    OFFLINE = 'OFFLINE',
}

enum DRIVER_APPROVAL_STATUS {
    APPROVED = 'APPROVED',
    BAN = 'BAN',
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
}

enum PAYMENT_METHOD {
    VNPAY = 'VNPAY',
    SENDER_CASH = 'SENDER_CASH',
    RECEIVER_CASH = 'RECEIVER_CASH'
}

export {
    DELIVERY_TYPE, VEHICLE_TYPES, PAYMENT_METHOD,
    PACKAGE_TYPES, ORDER_TYPES, DRIVER_STATUS,
    GENDER, ROLE, LOCATION_TYPE, DELIVERY_STATUS,
    DELIVERY_STATES, vehicleOptions, DRIVER_APPROVAL_STATUS

}