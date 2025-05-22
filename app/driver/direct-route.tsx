import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DirectRoute = () => {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    // Mock data
    const instruction = '50 m\nVòng ngược lại';
    const nextStep = 'Sau đó rẽ phải';
    const distance = '120 m';
    const duration = '1 phút';
    const arrivalTime = '14:51';
    const currentLocation = { latitude: 10.762622, longitude: 106.660172 };

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0007,
                longitudeDelta: 0.0007,
            }, 500);
        }
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            {/* Instruction */}
            <View style={styles.instructionBox}>
                <Text style={styles.instructionMain}>50 m</Text>
                <Text style={styles.instructionAction}>Vòng ngược lại</Text>
                <Text style={styles.instructionNext}>{nextStep}</Text>
            </View>
            {/* Map */}
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                <Marker coordinate={currentLocation} title="Vị trí của bạn" />
            </MapView>
            {/* Bottom info */}
            <View style={styles.bottomBox}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
                <View style={styles.bottomInfo}>
                    <Text style={styles.bottomTime}>{duration}</Text>
                    <Text style={styles.bottomDistance}>{distance} • {arrivalTime}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    instructionBox: {
        position: 'absolute',
        top: 40,
        left: 16,
        right: 16,
        backgroundColor: '#137a3c',
        borderRadius: 12,
        zIndex: 10,
        padding: 16,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    instructionMain: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    instructionAction: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 4,
    },
    instructionNext: {
        color: '#d0f5e8',
        fontSize: 14,
        marginTop: 2,
    },
    map: {
        flex: 1,
        marginTop: 110,
        marginBottom: 90,
    },
    bottomBox: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        height: 80,
    },
    closeBtn: {
        marginRight: 16,
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        padding: 6,
    },
    bottomInfo: {
        flex: 1,
        alignItems: 'flex-start',
    },
    bottomTime: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    bottomDistance: {
        fontSize: 15,
        color: '#666',
        marginTop: 2,
    },
});

export default DirectRoute; 