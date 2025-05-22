import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import mapService from '../services/map.service';
import { LocationPoint } from '@/types/Location';

interface LocationContextType {
    location: LocationPoint | null;
    hasLocationPermission: boolean;
    isLoading: boolean;
    error: string | null;
    requestLocationPermission: () => Promise<boolean>;
    getCurrentLocation: () => Promise<LocationPoint | null>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [location, setLocation] = useState<LocationPoint | null>(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isWatching = useRef(false);

    const fetchAndFormatLocation = async (
        latitude: number,
        longitude: number
    ): Promise<LocationPoint | null> => {
        try {
            const res = await mapService.getAddressFromLocation(longitude, latitude);
            if (res.success && res.data.length > 0) {
                const loc = res.data[0];
                return {
                    title: loc.title,
                    address: loc.address,
                    position: { lat: latitude, lng: longitude },
                };
            }
        } catch (err) {
            console.error('Error fetching address:', err);
        }
        return null;
    };

    const saveLocation = async (loc: LocationPoint) => {
        setLocation(loc);
        await AsyncStorage.setItem('userLocation', JSON.stringify(loc));
    };

    const startWatchingPosition = async () => {
        if (isWatching.current) return;
        isWatching.current = true;

        await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 3000,
                distanceInterval: 3,
            },
            async (loc) => {
                const { latitude, longitude } = loc.coords;
                const updated = await fetchAndFormatLocation(latitude, longitude);
                if (updated) await saveLocation(updated);
            }
        );
    };

    const loadSavedLocation = async () => {
        try {
            const json = await AsyncStorage.getItem('userLocation');
            if (json) {
                const saved: LocationPoint = JSON.parse(json);
                setLocation(saved);
                return saved;
            }
        } catch (err) {
            console.error('Failed to load saved location:', err);
        }
        return null;
    };

    const getCurrentLocation = async (): Promise<LocationPoint | null> => {
        if (!hasLocationPermission) {
            setError('Location permission not granted');
            return null;
        }

        // Nếu đã có location hiện tại thì trả về ngay (không gọi GPS nữa)
        if (location) {
            return location;
        }

        // Nếu chưa có, thì thử lấy lastKnown trước
        try {
            setIsLoading(true);
            setError(null);

            // Fallback nếu lastKnown không có
            const current = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const formatted = await fetchAndFormatLocation(current.coords.latitude, current.coords.longitude);
            if (formatted) {
                await saveLocation(formatted);
                return formatted;
            }

            return null;
        } catch (err) {
            console.error('Error getting current location:', err);
            setError('Failed to get current location');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const requestLocationPermission = async (): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            const granted = status === 'granted';
            setHasLocationPermission(granted);

            if (granted) {
                const loc = await getCurrentLocation();
                if (loc) await startWatchingPosition();
            }

            return granted;
        } catch (err) {
            console.error('Permission request failed:', err);
            setError('Failed to request location permission');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            const saved = await loadSavedLocation();

            const { status } = await Location.getForegroundPermissionsAsync();
            const granted = status === 'granted';
            setHasLocationPermission(granted);

            if (granted) {
                if (!saved) {
                    const loc = await getCurrentLocation();
                    if (loc) await startWatchingPosition();
                } else {
                    await startWatchingPosition();
                }
            }

            setIsLoading(false);
        };

        initialize();
    }, []);

    return (
        <LocationContext.Provider
            value={{
                location,
                hasLocationPermission,
                isLoading,
                error,
                requestLocationPermission,
                getCurrentLocation,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};
