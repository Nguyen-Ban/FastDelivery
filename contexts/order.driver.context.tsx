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

interface OrderDriverContextType {
    hasOrder: boolean,
    setHasOrder: (hasOrder: boolean) => void;

    pickupDropoffDistance: number | null;
    setPickupDropoffDistance: (distance: number | null) => void;

    driverPickupDistance: number | null;
    setDriverPickupDistance: (distance: number | null) => void;

    price: number | null;
    setPrice: (price: number | null) => void;

    dropoffLocation: LocationForDriver | null;
    setDropoffLocation: (location: LocationForDriver | null) => void;
    pickupLocation: LocationForDriver | null;
    setPickupLocation: (location: LocationForDriver | null) => void;

    packageDetails: OrderDetailsForDriver | null;
    setPackageDetails: (details: OrderDetailsForDriver | null) => void;
}

const OrderDriverContext = createContext<OrderDriverContextType | undefined>(undefined);

export const OrderDriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasOrder, setHasOrder] = useState<boolean>(false);
    const [price, setPrice] = useState<number | null>(null);
    const [dropoffLocation, setDropoffLocation] = useState<LocationForDriver | null>(null);
    const [pickupLocation, setPickupLocation] = useState<LocationForDriver | null>(null);
    const [packageDetails, setPackageDetails] = useState<OrderDetailsForDriver | null>(null);
    const [pickupDropoffDistance, setPickupDropoffDistance] = useState<number | null>(null);
    const [driverPickupDistance, setDriverPickupDistance] = useState<number | null>(null);



    return (
        <OrderDriverContext.Provider
            value={{
                hasOrder,
                setHasOrder,
                price,
                setPrice,
                dropoffLocation,
                setDropoffLocation,
                pickupLocation,
                setPickupLocation,
                packageDetails,
                setPackageDetails,
                pickupDropoffDistance,
                setPickupDropoffDistance,
                driverPickupDistance,
                setDriverPickupDistance,

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