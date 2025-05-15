import React, { createContext, useContext, useState } from 'react';

interface LocationPoint {
    title: string;
    address: string;
    position: {
        lat: number;
        lng: number;
    };
}

interface SenderReceiver {
    name: string;
    phone: string;
    note?: string;
}

interface GoodsDetails {
    weight: number;
    length: number;
    width: number;
    height: number;
    quantity: number;
    description?: string;
}

interface OrderContextType {
    // Location information
    pickupLocation: LocationPoint | null;
    deliveryLocation: LocationPoint | null;

    // Sender and receiver information
    sender: SenderReceiver | null;
    receiver: SenderReceiver | null;

    // Delivery details
    deliveryType: 'VAN' | 'MOTORBIKE';
    carType?: string; // Only for VAN deliveries
    goodsDetails: GoodsDetails | null;
    note: string;
    specialDemands: string[];

    // State setters
    setPickupLocation: (location: LocationPoint | null) => void;
    setDeliveryLocation: (location: LocationPoint | null) => void;
    setSender: (sender: SenderReceiver | null) => void;
    setReceiver: (receiver: SenderReceiver | null) => void;
    setDeliveryType: (type: 'VAN' | 'MOTORBIKE') => void;
    setCarType: (type: string) => void;
    setGoodsDetails: (details: GoodsDetails | null) => void;
    setNote: (note: string) => void;
    setSpecialDemands: (demands: string[]) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pickupLocation, setPickupLocation] = useState<LocationPoint | null>(null);
    const [deliveryLocation, setDeliveryLocation] = useState<LocationPoint | null>(null);
    const [sender, setSender] = useState<SenderReceiver | null>(null);
    const [receiver, setReceiver] = useState<SenderReceiver | null>(null);
    const [deliveryType, setDeliveryType] = useState<'VAN' | 'MOTORBIKE'>('VAN');
    const [carType, setCarType] = useState<string>('');
    const [goodsDetails, setGoodsDetails] = useState<GoodsDetails | null>(null);
    const [note, setNote] = useState<string>('');
    const [specialDemands, setSpecialDemands] = useState<string[]>([]);

    return (
        <OrderContext.Provider
            value={{
                pickupLocation,
                deliveryLocation,
                sender,
                receiver,
                deliveryType,
                carType,
                goodsDetails,
                note,
                specialDemands,
                setPickupLocation,
                setDeliveryLocation,
                setSender,
                setReceiver,
                setDeliveryType,
                setCarType,
                setGoodsDetails,
                setNote,
                setSpecialDemands,
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