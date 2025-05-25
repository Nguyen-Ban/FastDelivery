import { DELIVERY_TYPE, PACKAGE_TYPES, VEHICLE_TYPES } from "./enums";

interface User {
    id: string,
    fullName: string,
    phoneNumber: string,
    email: string,
    passcode?: string
}

interface Coordinate {
    lat: number,
    lng: number
}

interface Location {
    title: string;
    address: string;
    coord: Coordinate
}

interface Order {
    orderMain: OrderMain;
    orderSenderReceiver: OrderSenderReceiver;
    orderLocation: OrderLocation;
    orderDetail: OrderDetail;
    orderSpecialDemand: OrderSpecialDemand;
}

interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    nextStep?: string;
    error?: string;
}

interface OrderMain {
    price?: number;
    vehicleType?: VEHICLE_TYPES;
    deliveryType?: DELIVERY_TYPE;
    note?: string;
}

interface OrderSenderReceiver {
    senderName?: string;
    senderPhoneNumber?: string;
    receiverName?: string;
    receiverPhoneNumber?: string;
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
    User, Coordinate, Order,
    OrderMain, OrderSenderReceiver, OrderDetail,
    OrderLocation, OrderSpecialDemand, Location,
    ApiResponse
}