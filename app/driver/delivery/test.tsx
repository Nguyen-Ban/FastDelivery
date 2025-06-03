import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '@/contexts';

const MapDemo = () => {
    const { location } = useLocation();
    const [markerPosition, setMarkerPosition] = useState({
        latitude: location?.coord?.lat || 10.762622,
        longitude: location?.coord?.lng || 106.660172,
    });

    // Update marker position when location changes
    useEffect(() => {
        if (location?.coord?.lat && location.coord.lng) {
            setMarkerPosition({
                latitude: location.coord.lat,
                longitude: location.coord.lng,
            });
        }
    }, [location?.coord]);

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: markerPosition.latitude,
                    longitude: markerPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={markerPosition}
                    title="Vị trí hiện tại"
                    description="Vị trí của bạn"
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default MapDemo;
