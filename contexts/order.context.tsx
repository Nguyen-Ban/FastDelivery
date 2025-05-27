
import { DELIVERY_TYPE, Location, OrderPerson, OrderSpecialDemand, PACKAGE_TYPES, VEHICLE_TYPES } from '@/types';
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
    vehicleType?: VEHICLE_TYPES;
    deliveryType?: DELIVERY_TYPE;
    deliveryPrice: number;
    note?: string;

    polyline?: string;


    sender?: OrderPerson;
    receiver?: OrderPerson;

    pickupLocation?: Location;
    dropoffLocation?: Location;

    packageType?: PACKAGE_TYPES;
    weightKg?: number;
    lengthCm?: number;
    widthCm?: number;
    heightCm?: number;
    sizeName?: string;

    specialDemands?: OrderSpecialDemand;
    addonPrice: number;

    // State setters
    setPolyline: (polyline: string) => void;
    setVehicleType: (type: VEHICLE_TYPES) => void;
    setDeliveryType: (type: DELIVERY_TYPE) => void;
    setDeliveryPrice: (price: number) => void;
    setNote: (note: string) => void;
    setSender: (sender: OrderPerson) => void;
    setReceiver: (receiver: OrderPerson) => void;
    setPickupLocation: (location: Location) => void;
    setDropoffLocation: (location: Location) => void;
    setPackageType: (type: PACKAGE_TYPES) => void;
    setWeightKg: (weight: number) => void;
    setLengthCm: (length: number) => void;
    setWidthCm: (width: number) => void;
    setHeightCm: (height: number) => void;
    setSizeName: (name: string) => void;
    setSpecialDemands: (demands: OrderSpecialDemand) => void;
    setAddonPrice: (price: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [vehicleType, setVehicleType] = useState<VEHICLE_TYPES>();
    const [deliveryType, setDeliveryType] = useState<DELIVERY_TYPE>(DELIVERY_TYPE.ECONOMY);
    const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
    const [packageType, setPackageType] = useState<PACKAGE_TYPES>();
    const [weightKg, setWeightKg] = useState<number>();
    const [lengthCm, setLengthCm] = useState<number>();
    const [widthCm, setWidthCm] = useState<number>();
    const [heightCm, setHeightCm] = useState<number>();
    const [sizeName, setSizeName] = useState<string>();
    const [addonPrice, setAddonPrice] = useState<number>(0);
    const [polyline, setPolyline] = useState<string>();
    const [note, setNote] = useState<string>('');
    const [sender, setSender] = useState<OrderPerson>();
    const [receiver, setReceiver] = useState<OrderPerson>();
    const [pickupLocation, setPickupLocation] = useState<Location>();
    const [dropoffLocation, setDropoffLocation] = useState<Location>();
    const [specialDemands, setSpecialDemands] = useState<OrderSpecialDemand>();
    return (
        <OrderContext.Provider
            value={{
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