import { DELIVERY_TYPE, PACKAGE_TYPES, VEHICLE_TYPES } from "./enums";

interface Order {
    orderMain: OrderMain;
    orderSender: OrderPerson
    Receiver: OrderPerson;
    orderLocation: OrderLocation;
    orderDetail: OrderDetail;
    orderSpecialDemand: OrderSpecialDemand;
}

interface OrderMain {
    carPrice?: number;
    id: string;
    addonPrice?: number;
    deliveryPrice?: number;
    vehicleType?: VEHICLE_TYPES;
    deliveryType?: DELIVERY_TYPE;
    note?: string;
    createdAt: Date;
    status: string
}

interface OrderPerson {
    name?: string;
    phoneNumber?: string;
}

interface OrderSenderReceiver {
    sender?: OrderPerson;
    receiver?: OrderPerson;
}

interface OrderLocation {
    pickupTitle?: string;
    dropoffTitle?: string;
    pickupAddress?: string;
    dropoffAddress?: string;
    pickupLat?: number;
    pickupLng?: number;
    dropoffLat?: number;
    dropoffLng?: number;
}

interface OrderDetail {
    packageType?: PACKAGE_TYPES;
    weightKg?: number;
    lengthCm?: number;
    widthCm?: number;
    heightCm?: number;
    sizeName?: string;
}

interface OrderSpecialDemand {
    handDelivery?: boolean;
    fragileDelivery?: boolean;
    donateDriver?: number;
    homeMoving?: boolean;
    loading?: boolean;
    businessValue?: number;
    eDocument?: boolean;
    waiting?: boolean;
}

export {
    Order, OrderSenderReceiver,
    OrderMain, OrderPerson, OrderDetail,
    OrderLocation, OrderSpecialDemand
}