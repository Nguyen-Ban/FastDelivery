import { DRIVER_STATUS, VEHICLE_TYPES } from "./enums";

interface RegisterDriverReqBody {
    vehicleType: string,
    vehiclePlate: string,
    licenseNumber: string,
}

interface AutoAcceptReqBody {
    autoAccept: boolean
}


interface ReviewDriverReqBody {
    orderId: string,
    rating: number,
    comment: string,
}

interface DriverInfo {
    id: string;
    fullName: string;
    phoneNumber: string;
    vehiclePlate: string;
    licenseNumber?: string;
    rating?: number;
    approvalStatus?: number;
    vehicleType?: VEHICLE_TYPES
}

interface DriverAdminInfo extends DriverInfo {
    rating: number;
    totalTrips: number;
    status: DRIVER_STATUS;
}

export { RegisterDriverReqBody, AutoAcceptReqBody, DriverInfo, DriverAdminInfo, ReviewDriverReqBody };