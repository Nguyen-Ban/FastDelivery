import React, { createContext, useContext, useState } from 'react';
import { DriverInfo, VEHICLE_TYPES } from '@/types';



type DriverContextType = {
    driverInfo?: DriverInfo
    setDriverInfo: (driverInfo: DriverInfo) => void
    online: boolean;
    setOnline: (isOnline: boolean) => void;
    vehicleType: string;
    updateVehicleType: (type: VEHICLE_TYPES) => void;
};

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [vehicleType, setVehicleType] = useState(VEHICLE_TYPES.MOTORBIKE);
    const [online, setOnline] = useState(false);
    const [driverInfo, setDriverInfo] = useState<DriverInfo>()

    const updateVehicleType = (type: VEHICLE_TYPES) => {
        setVehicleType(type);
    };

    const value: DriverContextType = {
        driverInfo,
        setDriverInfo,
        online,
        setOnline,
        vehicleType,
        updateVehicleType,
    };

    return (
        <DriverContext.Provider value={value}>
            {children}
        </DriverContext.Provider>
    );
};

export const useDriver = () => {
    const context = useContext(DriverContext);
    if (context === undefined) {
        throw new Error('useDriver must be used within a DriverProvider');
    }
    return context;
};
