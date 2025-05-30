import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import COLOR from '../../../constants/Colors';
import { decode } from '@here/flexpolyline';
import { useOrder } from '../../../contexts/order.context';
import FindingDriverPanel from './_components/finding-driver-panel';
import { DELIVERY_STATUS, DriverInfo, VEHICLE_TYPES } from '@/types';
import OnDeliveryPanel from './_components/on-delivery-panel';
import CompleteDeliveryPanel from './_components/complete-delivery-panel';
import CancelledPanel from './_components/cancelled-panel';
import socket from '@/services/socket';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Fixed panel height
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.45;

const DeliveryPage = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    // Parse params for complex objects if needed
    const pickupLocation = JSON.parse(params.pickupLocation as string);
    const dropoffLocation = JSON.parse(params.dropoffLocation as string);
    const polyline = params.polyline as string;
    const vehicleType = params.vehicleType as VEHICLE_TYPES;
    const [driverInfo, setDriverInfo] = useState<DriverInfo>();
    const [isDriverFound, setIsDriverFound] = useState(false);
    const [deliveryPolyline, setDeliveryPolyline] = useState<string>(polyline);
    const [orderId, setOrderId] = useState('#FD123456'); // Mock order ID, replace with actual data later

    const mapRef = useRef<MapView>(null);

    const [showFinding, setShowFinding] = useState(true);

    const [deliveryStatus, setDeliveryStatus] = useState<DELIVERY_STATUS>(DELIVERY_STATUS.PENDING);

    // Decode polyline string
    const polylineString = deliveryPolyline || 'gfo}Eto~u`@_';
    const decodedPolyline = decode(polylineString);
    const routeCoordinates = pickupLocation?.coord ? [
        {
            latitude: pickupLocation.coord.lat,
            longitude: pickupLocation.coord.lng
        },
        ...decodedPolyline.polyline.map(point => ({
            latitude: point[0],
            longitude: point[1]
        }))
    ] : decodedPolyline.polyline.map(point => ({
        latitude: point[0],
        longitude: point[1]
    }));


    // Calculate the center point between pickup and dropoff for initial map region
    const initialRegion = pickupLocation?.coord && dropoffLocation?.coord ? {
        latitude: (pickupLocation.coord.lat + dropoffLocation.coord.lat) / 2,
        longitude: (pickupLocation.coord.lng + dropoffLocation.coord.lng) / 2,
        latitudeDelta: Math.max(0.01, Math.abs(pickupLocation.coord.lat - dropoffLocation.coord.lat) / 2),
        longitudeDelta: Math.max(0.01, Math.abs(pickupLocation.coord.lng - dropoffLocation.coord.lng) / 2),
    } : {
        latitude: 10.762622,
        longitude: 106.660172,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };


    // Function to fit map to route bounds
    const fitMapToRoute = () => {
        if (!pickupLocation?.coord || !dropoffLocation?.coord || !mapRef.current) return;

        const coordinates = [
            { latitude: pickupLocation.coord.lat, longitude: pickupLocation.coord.lng },
            { latitude: dropoffLocation.coord.lat, longitude: dropoffLocation.coord.lng }
        ];

        mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: PANEL_HEIGHT + 50, left: 50 },
            animated: true
        });
    };

    // Effect to zoom to route when locations are available
    useEffect(() => {
        if (pickupLocation?.coord && dropoffLocation?.coord) {
            fitMapToRoute();
        }
    }, [pickupLocation, dropoffLocation]);

    // Hiển thị panel tìm tài xế cho đến khi driverFound là true
    useEffect(() => {
        if (isDriverFound) {
            setShowFinding(false);
        } else {
            setShowFinding(true);
        }
    }, [isDriverFound]);



    const handleChatDriver = () => {
        router.push({
            pathname: '/customer/delivery/chat',
            params: {
                orderId: orderId,
                driverName: driverInfo?.fullName
            }
        });
        socket.emit('chat:join', { orderId })

        // Implement chat functionality here
        console.log('Chat with driver');
    };


    useEffect(() => {
        socket.on('order:driverFound', (response) => {
            if (response.success) {
                console.log('Driver found:');
                setDriverInfo(response.data.driverInfo);
                setIsDriverFound(true);
                setDeliveryStatus(DELIVERY_STATUS.IN_PROGRESS);
                setOrderId(response.data.orderId)
            } else {
                console.error('Error finding driver:', response.message);
            }
        })

        socket.on('order:completed', (response) => {
            if (response.success) {
                setDeliveryStatus(DELIVERY_STATUS.COMPLETED);
            } else {
                console.error('Error completing delivery:', response.message);
            }
        });

        socket.on('order:cancelled', (response) => {
            if (response.success) {
                setDeliveryStatus(DELIVERY_STATUS.CANCELLED);
                router.back();
            } else {
                console.error('Error cancelling order:', response.message);
            }
        });

        socket.on('order:deliveryPolyline', (response) => {
            if (response.success) setDeliveryPolyline(response.data.polyline);
            else console.error('Error fetching delivery polyline:', response.message);
        });
        // Clean up socket listeners on unmount
        return () => {
            socket.off('order:driverFound');
            socket.off('order:completed');
            socket.off('order:cancelled');
            socket.off('order:deliveryPolyline');
        };
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                {/* Full Screen Map */}
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={initialRegion}
                    mapPadding={{ top: 40, right: 40, bottom: PANEL_HEIGHT + 40, left: 40 }}
                >
                    {/* Pickup Marker */}
                    {pickupLocation?.coord && (
                        <Marker
                            coordinate={{
                                latitude: pickupLocation.coord.lat,
                                longitude: pickupLocation.coord.lng
                            }}
                            title="Điểm đón"
                            pinColor={COLOR.orange50}
                        >

                        </Marker>
                    )}

                    {/* Dropoff Marker */}
                    {dropoffLocation?.coord && (
                        <Marker
                            coordinate={{
                                latitude: dropoffLocation.coord.lat,
                                longitude: dropoffLocation.coord.lng
                            }}
                            title="Điểm trả"
                            pinColor={COLOR.green40}
                        />
                    )}

                    {/* Route Line */}
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor={COLOR.orange50}
                        strokeWidth={4}
                    />
                </MapView>

                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                {/* Bottom Panel */}
                <View style={styles.infoPanel}>
                    {deliveryStatus === DELIVERY_STATUS.PENDING && (
                        <FindingDriverPanel onCancel={() => {
                            router.back();
                        }} />
                    )}
                    {deliveryStatus === DELIVERY_STATUS.IN_PROGRESS && (
                        <OnDeliveryPanel
                            orderId={orderId}
                            driverInfo={driverInfo}
                            onChat={handleChatDriver}
                            onDeliveryDetail={() => {
                                router.push({
                                    pathname: '/customer/delivery/delivery-detail',
                                    params: { orderId }
                                });
                            }}
                        />
                    )}
                    {deliveryStatus === DELIVERY_STATUS.COMPLETED && (
                        <CompleteDeliveryPanel
                            driverName={driverInfo?.fullName || 'Nguyễn Văn A'}
                            onSubmit={() => {
                                // Optionally reset or navigate away after rating
                                router.push('/customer/home');
                            }}
                        />
                    )}
                    {deliveryStatus === DELIVERY_STATUS.CANCELLED && (
                        <CancelledPanel onBackHome={() => router.push('/customer/home')} />
                    )}
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: COLOR.orange50,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    infoPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: PANEL_HEIGHT,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    orderSummary: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF3E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    orderId: {
        fontSize: 14,
        color: '#666',
    },
    driverSection: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    driverInfo: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        width: 30,
        alignItems: 'center',
        marginRight: 10,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    panelFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF3E0',
        borderRadius: 10,
        padding: 12,
        width: '48%',
    },
    actionText: {
        color: COLOR.orange50,
        fontWeight: '600',
        marginLeft: 8,
    },
    zoomButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: COLOR.orange50,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    motorcycleMarker: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLOR.orange50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default DeliveryPage;