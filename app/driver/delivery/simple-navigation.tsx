import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocation } from '@/contexts';

interface RoutePoint {
    latitude: number;
    longitude: number;
}

const NavigationMap = () => {
    const { location } = useLocation();
    const [heading, setHeading] = useState(0);
    const [route, setRoute] = useState<RoutePoint[]>([]);
    const mapRef = useRef<MapView>(null);

    const updateCameraPosition = (latitude: number, longitude: number, bearing: number) => {
        if (mapRef.current) {
            mapRef.current.animateCamera({
                center: { latitude, longitude },
                pitch: 0, // Góc nghiêng camera (0-90 độ)
                heading: bearing, // Hướng camera theo compass
                zoom: 18, // Mức zoom cao để thấy rõ đường
                altitude: 500, // Độ cao camera
            }, { duration: 1000 });
        }
    };

    // Tạo route mẫu (trong thực tế sẽ lấy từ API như Google Directions)
    const simulateRoute = () => {
        if (location?.coord) {
            const routePoints: RoutePoint[] = [
                { latitude: location.coord.lat, longitude: location.coord.lng },
                { latitude: location.coord.lat + 0.001, longitude: location.coord.lng + 0.001 },
                { latitude: location.coord.lat + 0.002, longitude: location.coord.lng + 0.002 },
                { latitude: location.coord.lat + 0.003, longitude: location.coord.lng + 0.003 },
            ];
            setRoute(routePoints);
        }
    };

    // Tính toán bearing giữa 2 điểm
    const calculateBearing = (start: RoutePoint, end: RoutePoint): number => {
        const dLon = (end.longitude - start.longitude) * Math.PI / 180;
        const lat1 = start.latitude * Math.PI / 180;
        const lat2 = end.latitude * Math.PI / 180;

        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        const bearing = Math.atan2(y, x) * 180 / Math.PI;
        return (bearing + 360) % 360;
    };

    useEffect(() => {
        let subscription: Location.LocationSubscription;

        const startHeadingUpdates = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required for navigation');
                return;
            }

            subscription = await Location.watchHeadingAsync((heading) => {
                setHeading(heading.magHeading);
                if (location?.coord) {
                    updateCameraPosition(
                        location.coord.lat,
                        location.coord.lng,
                        heading.magHeading
                    );
                }
            });
        };

        startHeadingUpdates();
        simulateRoute();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [location?.coord]);

    if (!location?.coord) {
        return <View style={styles.container} />;
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: location.coord.lat,
                    longitude: location.coord.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsMyLocationButton={true}
                showsCompass={false}
                showsScale={false}
                rotateEnabled={true}
                pitchEnabled={true}
                scrollEnabled={true}
                zoomEnabled={true}
                mapType="standard"
                userLocationPriority="high"
                userLocationUpdateInterval={1000}
                userLocationFastestInterval={500}
            >
                <Marker
                    coordinate={{
                        latitude: location.coord.lat,
                        longitude: location.coord.lng,
                    }}
                    title="Vị trí hiện tại"
                    anchor={{ x: 0.5, y: 0.5 }}
                    rotation={heading}
                />

                {route.length > 0 && (
                    <Polyline
                        coordinates={route}
                        strokeColor="#4285F4"
                        strokeWidth={6}
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});

export default NavigationMap;