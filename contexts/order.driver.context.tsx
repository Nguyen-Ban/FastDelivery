import { DELIVERY_TYPE } from '@/constants/DeliveryTypes';
import { PACKAGE_TYPES } from '@/constants/PackageTypes';
import { VEHICLE_TYPES } from '@/constants/VehicleTypes';
import { LocationPoint } from '@/types/Location';
import { SenderReceiver, GoodsDetails, SpecialDemands } from '@/types/OrderDetails';
import React, { createContext, useContext, useState } from 'react';

interface LocationForDriver {
    title: string;
    address: string;
}

interface OrderDetailsForDriver {
    packageType: PACKAGE_TYPES | null;
    weightKg: number | null;
    size: string | null;
}

interface OrderMain {
    price: number | null;
    vehicleType: VEHICLE_TYPES | null;
    deliveryType: DELIVERY_TYPE | null;
    note: string | null;
}

interface OrderSenderReceiver {
    senderName: string | null;
    senderPhoneNumber: string | null;
    receiverName: string | null;
    receiverPhoneNumber: string | null;
}

interface OrderLocation {
    pickupTitle: string | null;
    dropoffTitle: string | null;
    pickupAddress: string | null;
    dropoffAddress: string | null;
    pickupLat: number | null;
    pickupLng: number | null;
    dropoffLat: number | null;
    dropoffLng: number | null;
}

interface OrderDetail {
    packageType: PACKAGE_TYPES | null;
    weightKg: number | null;
    lengthCm: number | null;
    widthCm: number | null;
    heightCm: number | null;
    sizeName: string | null;
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


interface OrderDriverContextType {
    hasOrder: boolean,
    setHasOrder: (hasOrder: boolean) => void;

    polyline: string | null;
    setPolyline: (polyline: string | null) => void;

    pickupDropoffDistance: number | null;
    setPickupDropoffDistance: (distance: number | null) => void;

    driverPickupDistance: number | null;
    setDriverPickupDistance: (distance: number | null) => void;

    orderMain: OrderMain | null;
    setOrderMain: (orderMain: OrderMain | null) => void;
    orderSenderReceiver: OrderSenderReceiver | null;
    setOrderSenderReceiver: (orderSenderReceiver: OrderSenderReceiver | null) => void;
    orderLocation: OrderLocation | null;
    setOrderLocation: (orderLocation: OrderLocation | null) => void;
    orderDetail: OrderDetail | null;
    setOrderDetail: (orderDetail: OrderDetail | null) => void;
    orderSpecialDemand: OrderSpecialDemand | null;
    setOrderSpecialDemand: (orderSpecialDemand: OrderSpecialDemand | null) => void;
}

const OrderDriverContext = createContext<OrderDriverContextType | undefined>(undefined);

export const OrderDriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasOrder, setHasOrder] = useState<boolean>(false);
    const [pickupDropoffDistance, setPickupDropoffDistance] = useState<number | null>(null);
    const [driverPickupDistance, setDriverPickupDistance] = useState<number | null>(null);
    const [orderMain, setOrderMain] = useState<OrderMain | null>(null);
    const [orderSenderReceiver, setOrderSenderReceiver] = useState<OrderSenderReceiver | null>(null);
    const [orderLocation, setOrderLocation] = useState<OrderLocation | null>(null);
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
    const [orderSpecialDemand, setOrderSpecialDemand] = useState<OrderSpecialDemand | null>(null);
    const [polyline, setPolyline] = useState<string | null>(null);

    return (
        <OrderDriverContext.Provider
            value={{
                hasOrder,
                setHasOrder,
                pickupDropoffDistance,
                setPickupDropoffDistance,
                driverPickupDistance,
                setDriverPickupDistance,
                orderMain,
                setOrderMain,
                orderSenderReceiver,
                setOrderSenderReceiver,
                orderLocation,
                setOrderLocation,
                orderDetail,
                setOrderDetail,
                orderSpecialDemand,
                setOrderSpecialDemand,
                polyline,
                setPolyline,
            }}
        >
            {children}
        </OrderDriverContext.Provider>
    );
};

export const useOrderDriver = () => {
    const context = useContext(OrderDriverContext);
    if (context === undefined) {
        throw new Error('useOrderDriver must be used within an OrderDriverProvider');
    }
    return context;
}; 