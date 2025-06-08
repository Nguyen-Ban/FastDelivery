import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Linking, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import COLOR from '../../../constants/Colors';
import { decode } from '@here/flexpolyline';
import { useOrder } from '../../../contexts/order.context';
import FindingDriverPanel from './_components/finding-driver-panel';
import { DELIVERY_STATUS, DriverInfo, VEHICLE_TYPES, Coordinate, DELIVERY_STATES, PAYMENT_METHOD } from '@/types';
import OnDeliveryPanel from './_components/on-delivery-panel';
import CompleteDeliveryPanel from './_components/complete-delivery-panel';
import CancelledPanel from './_components/cancelled-panel';
import socket from '@/services/socket';
import { WebView } from 'react-native-webview';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Fixed panel height
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.45;

const DeliveryPage = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const paymentMethod = params.paymentMethod as PAYMENT_METHOD
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    // Parse params for complex objects if needed
    const pickupLocation = JSON.parse(params.pickupLocation as string);
    const dropoffLocation = JSON.parse(params.dropoffLocation as string);
    const polyline = params.polyline as string;
    const vehicleType = params.vehicleType as VEHICLE_TYPES;
    const [driverInfo, setDriverInfo] = useState<DriverInfo>();
    const [driverCoord, setDriverCoord] = useState<Coordinate>();
    const [isDriverFound, setIsDriverFound] = useState(false);
    const [pickupDropoffPolyline, setPickupDropoffPolyline] = useState<string>(polyline);
    const [driverPickupPolyline, setDriverPickupPolyline] = useState<string>();
    const [orderId, setOrderId] = useState('#FD123456'); // Mock order ID, replace with actual data later
    const [hasFitMap, setHasFitMap] = useState(false);

    const mapRef = useRef<MapView>(null);

    const [showFinding, setShowFinding] = useState(true);

    const [deliveryStatus, setDeliveryStatus] = useState<DELIVERY_STATUS>(DELIVERY_STATUS.PENDING);
    const [onDeliveryState, setOnDeliveryState] = useState<DELIVERY_STATES>(DELIVERY_STATES.MOVING_TO_PICKUP)

    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

    // Decode polyline strings
    const pickupDropoffDecoded = pickupDropoffPolyline ? decode(pickupDropoffPolyline).polyline : [];
    const driverPickupDecoded = driverPickupPolyline ? decode(driverPickupPolyline).polyline : [];

    // Calculate route coordinates including driver's location and route
    const routeCoordinates = [
        ...pickupDropoffDecoded.map(point => ({ latitude: point[0], longitude: point[1] })),
        ...(driverCoord ? [{
            latitude: driverCoord.lat,
            longitude: driverCoord.lng
        }] : []),
        ...driverPickupDecoded.map(point => ({ latitude: point[0], longitude: point[1] }))
    ];

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
            { latitude: dropoffLocation.coord.lat, longitude: dropoffLocation.coord.lng },
            ...(driverCoord ? [{
                latitude: driverCoord.lat,
                longitude: driverCoord.lng
            }] : [])
        ];

        mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: PANEL_HEIGHT + 50, left: 50 },
            animated: true
        });
    };

    // Function to fit map to route bounds
    const fitMapToRouteFirst = () => {
        if (!pickupLocation?.coord || !dropoffLocation?.coord || !mapRef.current) return;

        const coordinates = [
            { latitude: pickupLocation.coord.lat, longitude: pickupLocation.coord.lng },
            { latitude: dropoffLocation.coord.lat, longitude: dropoffLocation.coord.lng },
        ];

        mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: PANEL_HEIGHT + 50, left: 50 },
            animated: true
        });
    };

    // Effect to zoom to route when locations are available
    useEffect(() => {
        if (driverCoord && !hasFitMap) {
            fitMapToRoute();
            setHasFitMap(true);
        }
    }, [driverCoord]);


    useEffect(() => {
        fitMapToRouteFirst()
    }, [])

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
                setDriverCoord(response.data.driverCoord);
                setIsDriverFound(true);
                setDeliveryStatus(DELIVERY_STATUS.IN_PROGRESS);
                setOrderId(response.data.orderId);
                setDriverPickupPolyline(response.data.driverPickupPolyline);
            } else {
                console.error('Error finding driver:', response.message);
            }
        });

        socket.on('location:update', (response) => {
            if (response.success) {
                setDriverCoord({ lat: response.data.lat, lng: response.data.lng });
            }
        });

        socket.on('order:completed', (response) => {
            if (response.success) {
                setDeliveryStatus(DELIVERY_STATUS.COMPLETED);
            } else {
                console.error('Error completing delivery:', response.message);
            }
        });

        socket.on('order:picking', (response) => {
            console.log('picking')
            if (response.success) {
                setOnDeliveryState(DELIVERY_STATES.GOING_TO_PICKUP)
            }
        })

        socket.on('order:picked', (response) => {
            console.log('picked')
            if (response.success) {
                setOnDeliveryState(DELIVERY_STATES.PICKING_UP)
            }
        })

        socket.on('order:delivering', (response) => {
            if (response.success) {
                setOnDeliveryState(DELIVERY_STATES.GOING_TO_DROPOFF)
            }
        })

        socket.on('order:delivered', (response) => {
            if (response.success) {
                setOnDeliveryState(DELIVERY_STATES.DELIVERING)
            }
        })

        socket.on('order:cancelled', (response) => {
            if (response.success) {
                setDeliveryStatus(DELIVERY_STATUS.CANCELLED);
                router.back();
            } else {
                console.error('Error cancelling order:', response.message);
            }
        });

        socket.on('driver:coord', (response) => {
            if (response.success) {
                setDriverCoord(response.data.driverCoord)
            }
        })

        // Add payment URL handler
        if (paymentMethod === PAYMENT_METHOD.VNPAY) {
            socket.on('payment:url', (response) => {
                if (response.success) {
                    setPaymentUrl(response.data.paymentUrl);
                }
            });
        }

        // Clean up socket listeners on unmount
        return () => {
            socket.off('order:picked');
            socket.off('order:picking');
            socket.off('order:delivered');
            socket.off('order:driverFound');
            socket.off('driver:location');
            socket.off('order:completed');
            socket.off('order:cancelled');
            socket.off('payment:url');
        };
    }, [paymentMethod]);

    const closeWebView = () => {
        setPaymentUrl(null);
    };

    const handlePaymentResponse = (url: string) => {
        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            const responseCode = params.get('vnp_ResponseCode');

            if (responseCode === '00') {
                setPaymentStatus('success');
                // setPaymentUrl(null);
                // Alert.alert(
                //     'Thành công',
                //     'Thanh toán thành công!',
                //     [{ text: 'OK' }]
                // );
            } else {
                setPaymentStatus('failed');
                // setPaymentUrl(null);
                // Alert.alert(
                //     'Thất bại',
                //     'Thanh toán thất bại. Vui lòng thử lại sau.',
                //     [{ text: 'OK' }]
                // );
            }
        } catch (error) {
            console.error('Error parsing payment response:', error);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                {/* Full Screen Map */}
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={initialRegion}
                >
                    {/* Pickup Marker */}
                    {pickupLocation?.coord && (
                        <Marker
                            coordinate={{
                                latitude: pickupLocation.coord.lat,
                                longitude: pickupLocation.coord.lng
                            }}
                            title="Điểm lấy hàng"
                            pinColor={COLOR.orange50}
                        />
                    )}

                    {/* Dropoff Marker */}
                    {dropoffLocation?.coord && (
                        <Marker
                            coordinate={{
                                latitude: dropoffLocation.coord.lat,
                                longitude: dropoffLocation.coord.lng
                            }}
                            title="Điểm trả hàng"
                            pinColor={COLOR.green40}
                        />
                    )}

                    {/* Driver Marker */}
                    {driverCoord && (
                        <Marker
                            coordinate={{
                                latitude: driverCoord.lat,
                                longitude: driverCoord.lng
                            }}
                            title="Tài xế"
                            anchor={{ x: 0.5, y: 0.5 }}

                        >
                            <View style={styles.motorcycleMarker}>
                                <FontAwesome5 name="motorcycle" size={20} color={COLOR.orange50} />
                            </View>
                        </Marker>
                    )}

                    {/* Route Lines */}
                    <Polyline
                        coordinates={pickupDropoffDecoded.map(point => ({
                            latitude: point[0],
                            longitude: point[1]
                        }))}
                        strokeColor={COLOR.orange50}
                        strokeWidth={4}
                    />
                    {driverPickupDecoded.length > 0 && (
                        <Polyline
                            coordinates={driverPickupDecoded.map(point => ({
                                latitude: point[0],
                                longitude: point[1]
                            }))}
                            strokeColor={COLOR.blue70}
                            strokeWidth={4}
                        />
                    )}
                </MapView>

                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                {/* Bottom Panel */}
                <View style={[styles.infoPanel, { height: deliveryStatus === DELIVERY_STATUS.COMPLETED ? SCREEN_HEIGHT * 0.7 : PANEL_HEIGHT }]}>
                    {deliveryStatus === DELIVERY_STATUS.PENDING && (
                        <FindingDriverPanel onCancel={() => {
                            router.back();
                        }} />
                    )}
                    {deliveryStatus === DELIVERY_STATUS.IN_PROGRESS && (
                        <OnDeliveryPanel
                            ON_DELIVERY_STATE={onDeliveryState}
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
                            orderId={orderId}
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

                {/* Payment WebView Modal */}
                <Modal
                    visible={!!paymentUrl}
                    animationType="slide"
                    onRequestClose={closeWebView}
                >
                    <View style={styles.webViewContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeWebView}
                        >
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                        {paymentUrl && (
                            <WebView
                                source={{ uri: paymentUrl }}
                                style={styles.webView}
                                onError={(syntheticEvent) => {
                                    const { nativeEvent } = syntheticEvent;
                                    if (nativeEvent.url.includes('vnpay_return')) {
                                        handlePaymentResponse(nativeEvent.url);
                                    }
                                }}
                                onNavigationStateChange={(navState) => {
                                    if (navState.url.includes('vnpay_return')) {
                                        handlePaymentResponse(navState.url);
                                    }
                                }}
                            />
                        )}
                    </View>
                </Modal>
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
        elevation: 2,
    },
    webViewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webView: {
        flex: 1,
    },
    closeButton: {
        padding: 16,
        backgroundColor: COLOR.orange50,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DeliveryPage;