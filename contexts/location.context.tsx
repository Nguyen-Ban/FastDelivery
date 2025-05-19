import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import mapService from '../services/map.service';

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

const isLocationSignificantlyDifferent = (loc1: LocationData, loc2: LocationData, threshold = 0.0001) => {
    return Math.abs(loc1.latitude - loc2.latitude) > threshold ||
        Math.abs(loc1.longitude - loc2.longitude) > threshold;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAndSetAddress = async (latitude: number, longitude: number) => {
        try {
            const response = await mapService.getAddressFromLocation(longitude, latitude);
            if (response.success && response.data.length > 0) {
                return response.data[0].title;
            }
        } catch (err) {
            console.error('Error fetching address:', err);
        }
        return undefined;
    };

    useEffect(() => {
        const loadSavedLocation = async () => {
            try {
                const savedLocationJson = await AsyncStorage.getItem('userLocation');
                if (savedLocationJson) {
                    const savedLocation = JSON.parse(savedLocationJson);
                    setLocation(savedLocation);

                    // Check current location if we have permission
                    const { status } = await Location.getForegroundPermissionsAsync();
                    if (status === 'granted') {
                        const currentPosition = await Location.getCurrentPositionAsync({
                            accuracy: Location.Accuracy.Balanced,
                        });

                        const currentLocation = {
                            latitude: currentPosition.coords.latitude,
                            longitude: currentPosition.coords.longitude,
                        };

                        // If location has changed significantly, update it
                        if (isLocationSignificantlyDifferent(savedLocation, currentLocation)) {
                            const address = await fetchAndSetAddress(currentLocation.latitude, currentLocation.longitude);
                            const newLocation = { ...currentLocation, address };
                            setLocation(newLocation);
                            await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));
                        }
                    }
                }

                const { status } = await Location.getForegroundPermissionsAsync();
                setHasLocationPermission(status === 'granted');
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
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const address = await fetchAndSetAddress(coords.latitude, coords.longitude);

            const newLocation = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                address
            };

            setLocation(newLocation);
            await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));

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
            if (!newLocation.address) {
                const address = await fetchAndSetAddress(newLocation.latitude, newLocation.longitude);
                newLocation = { ...newLocation, address };
            }

            setLocation(newLocation);
            await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));
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