import { DRIVER_STATUS } from "./enums";

interface RegisterDriverReqBody {
    vehicleType: string,
    vehiclePlate: string,
    licenseNumber: string,
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
}

interface DriverAdminInfo extends DriverInfo {
    rating: number;
    totalTrips: number;
    status: DRIVER_STATUS;
}

export { RegisterDriverReqBody, DriverInfo, DriverAdminInfo, ReviewDriverReqBody };