import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export interface LocationData {
    latitude: number;
    longitude: number;
    address?: string;
}

interface LocationContextType {
    location: LocationData | null;
    hasLocationPermission: boolean;
    isLoading: boolean;
    error: string | null;
    requestLocationPermission: () => Promise<boolean>;
    updateLocation: (location: LocationData) => void;
    getCurrentLocation: () => Promise<LocationData | null>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Try to load saved location data from AsyncStorage when component mounts
        const loadSavedLocation = async () => {
            try {
                const savedLocationJson = await AsyncStorage.getItem('userLocation');
                if (savedLocationJson) {
                    const savedLocation = JSON.parse(savedLocationJson);
                    setLocation(savedLocation);
                    // console.log('Loaded location from AsyncStorage:', savedLocation);
                } else {
                    // console.log('No saved location found in AsyncStorage');
                }

                // Check if we already have location permissions
                const { status } = await Location.getForegroundPermissionsAsync();
                setHasLocationPermission(status === 'granted');
                // console.log('Location permission status:', status);
            } catch (err) {
                console.error('Error loading saved location:', err);
                setError('Could not load saved location data');
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedLocation();
    }, []);

    const requestLocationPermission = async (): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            const permissionGranted = status === 'granted';
            setHasLocationPermission(permissionGranted);

            if (permissionGranted) {
                // If permission is granted, try to get current location
                await getCurrentLocation();
            }

            return permissionGranted;
        } catch (err) {
            console.error('Error requesting location permission:', err);
            setError('Failed to request location permission');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentLocation = async (): Promise<LocationData | null> => {
        if (!hasLocationPermission) {
            setError('Location permission not granted');
            // console.log('Cannot get location - permission not granted');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const newLocation = {
                latitude: coords.latitude,
                longitude: coords.longitude,
            };

            // console.log('Got current location:', newLocation);

            // Save to state and AsyncStorage
            setLocation(newLocation);
            await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));

            // Verify data was saved to AsyncStorage
            const savedData = await AsyncStorage.getItem('userLocation');
            // console.log('Verified location saved to AsyncStorage:', savedData);

            return newLocation;
        } catch (err) {
            console.error('Error getting current location:', err);
            setError('Failed to get current location');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const updateLocation = async (newLocation: LocationData) => {
        try {
            // console.log('Updating location to:', newLocation);
            setLocation(newLocation);
            await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));

            // Verify data was updated in AsyncStorage
            const savedData = await AsyncStorage.getItem('userLocation');
            // console.log('Verified location updated in AsyncStorage:', savedData);
        } catch (err) {
            console.error('Error saving location:', err);
            setError('Failed to save location');
        }
    };

    return (
        <LocationContext.Provider
            value={{
                location,
                hasLocationPermission,
                isLoading,
                error,
                requestLocationPermission,
                updateLocation,
                getCurrentLocation,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}; 