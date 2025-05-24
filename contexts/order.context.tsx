import { DELIVERY_TYPE } from '@/constants/DeliveryTypes';
import { PACKAGE_TYPES } from '@/constants/PackageTypes';
import { VEHICLE_TYPES } from '@/constants/VehicleTypes';
import { LocationPoint } from '@/types/Location';
import { SenderReceiver, GoodsDetails, SpecialDemands } from '@/types/OrderDetails';
import React, { createContext, useContext, useState } from 'react';

interface DriverInfo {
    id: string;
    fullName: string;
    phoneNumber: string;
    vehiclePlate: string;
}

type Message = {
    id: string;
    text: string;
    senderId: string; // 🟢 user ID của người gửi
    senderName: string;
    createdAt: string;
};

interface OrderContextType {
    // State variables and their setters
    driverFound: boolean;
    setDriverFound: (found: boolean) => void;
    driverInfo: DriverInfo | null;
    setDriverInfo: (info: DriverInfo | null) => void;

    orderId: string | null;
    setOrderId: (id: string | null) => void;

    vehicleType: VEHICLE_TYPES;
    deliveryType: DELIVERY_TYPE;
    deliveryPrice: number;
    note: string;

    polyline: string | null;


    sender: SenderReceiver | null;
    receiver: SenderReceiver | null;

    pickupLocation: LocationPoint | null;
    dropoffLocation: LocationPoint | null;

    packageType: PACKAGE_TYPES | null;
    weightKg: number | null;
    lengthCm: number | null;
    widthCm: number | null;
    heightCm: number | null;
    sizeName?: string | null;

    specialDemands: SpecialDemands | null;
    addonPrice: number;

    // State setters
    setPolyline: (polyline: string | null) => void;
    setVehicleType: (type: VEHICLE_TYPES) => void;
    setDeliveryType: (type: DELIVERY_TYPE) => void;
    setDeliveryPrice: (price: number) => void;
    setNote: (note: string) => void;
    setSender: (sender: SenderReceiver | null) => void;
    setReceiver: (receiver: SenderReceiver | null) => void;
    setPickupLocation: (location: LocationPoint | null) => void;
    setDropoffLocation: (location: LocationPoint | null) => void;
    setPackageType: (type: PACKAGE_TYPES | null) => void;
    setWeightKg: (weight: number | null) => void;
    setLengthCm: (length: number | null) => void;
    setWidthCm: (width: number | null) => void;
    setHeightCm: (height: number | null) => void;
    setSizeName: (name: string | null) => void;
    setSpecialDemands: (demands: SpecialDemands | null) => void;
    setAddonPrice: (price: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [vehicleType, setVehicleType] = useState<VEHICLE_TYPES>(VEHICLE_TYPES.VAN);
    const [deliveryType, setDeliveryType] = useState<DELIVERY_TYPE>(DELIVERY_TYPE.ECONOMY);
    const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
    const [packageType, setPackageType] = useState<PACKAGE_TYPES | null>(null);
    const [weightKg, setWeightKg] = useState<number | null>(null);
    const [lengthCm, setLengthCm] = useState<number | null>(null);
    const [widthCm, setWidthCm] = useState<number | null>(null);
    const [heightCm, setHeightCm] = useState<number | null>(null);
    const [sizeName, setSizeName] = useState<string | null>(null);
    const [addonPrice, setAddonPrice] = useState<number>(0);
    const [polyline, setPolyline] = useState<string | null>(null);
    const [note, setNote] = useState<string>('');
    const [sender, setSender] = useState<SenderReceiver | null>(null);
    const [receiver, setReceiver] = useState<SenderReceiver | null>(null);
    const [pickupLocation, setPickupLocation] = useState<LocationPoint | null>(null);
    const [dropoffLocation, setDropoffLocation] = useState<LocationPoint | null>(null);
    const [specialDemands, setSpecialDemands] = useState<SpecialDemands | null>(null);
    const [driverFound, setDriverFound] = useState<boolean>(false);
    return (
        <OrderContext.Provider
            value={{
                driverFound,
                setDriverFound,
                driverInfo,
                setDriverInfo,
                orderId,
                setOrderId,
                polyline,
                vehicleType,
                deliveryType,
                deliveryPrice,
                note,
                sender,
                receiver,
                pickupLocation,
                dropoffLocation,
                packageType,
                weightKg,
                lengthCm,
                widthCm,
                heightCm,
                sizeName,
                specialDemands,

                addonPrice,
                setPolyline,
                setVehicleType,
                setDeliveryType,
                setDeliveryPrice,
                setNote,
                setSender,
                setReceiver,
                setPackageType,
                setWeightKg,
                setLengthCm,
                setWidthCm,
                setHeightCm,
                setSizeName,
                setPickupLocation,
                setDropoffLocation,
                setSpecialDemands,
                setAddonPrice
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
}; 