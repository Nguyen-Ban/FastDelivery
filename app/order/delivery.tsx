import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import COLOR from '../../constants/Colors';
import { decode } from '@here/flexpolyline';
import { useOrder } from '../../contexts/order.context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Fixed panel height
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.45;

const DeliveryPage = () => {
    const router = useRouter();
    const { pickupLocation, dropoffLocation, polyline } = useOrder();
    const mapRef = useRef<MapView>(null);

    // Mock order data (will be replaced with API data later)
    const [orderData, setOrderData] = useState({
        orderId: '#FD123456',
        status: 'Đang giao hàng',
        estimatedTime: '45 phút',
        distance: '12.5 km',
        driver: {
            name: 'Nguyễn Văn A',
            phone: '0123456789',
        },
        payment: {
            status: 'Đã thanh toán',
            method: 'Tiền mặt (Người gửi)',
            totalFee: 132000,
        },
    });

    // Decode polyline string
    const polylineString = polyline || 'gfo}Eto~u`@_';
    const decodedPolyline = decode(polylineString);
    const routeCoordinates = pickupLocation?.position ? [
        {
            latitude: pickupLocation.position.lat,
            longitude: pickupLocation.position.lng
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
    const initialRegion = pickupLocation?.position && dropoffLocation?.position ? {
        latitude: (pickupLocation.position.lat + dropoffLocation.position.lat) / 2,
        longitude: (pickupLocation.position.lng + dropoffLocation.position.lng) / 2,
        latitudeDelta: Math.max(0.01, Math.abs(pickupLocation.position.lat - dropoffLocation.position.lat) / 2),
        longitudeDelta: Math.max(0.01, Math.abs(pickupLocation.position.lng - dropoffLocation.position.lng) / 2),
    } : {
        latitude: 10.762622,
        longitude: 106.660172,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    // Function to fit map to route bounds
    const fitMapToRoute = () => {
        if (!pickupLocation?.position || !dropoffLocation?.position || !mapRef.current) return;

        const coordinates = [
            { latitude: pickupLocation.position.lat, longitude: pickupLocation.position.lng },
            { latitude: dropoffLocation.position.lat, longitude: dropoffLocation.position.lng }
        ];

        mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: PANEL_HEIGHT + 50, left: 50 },
            animated: true
        });
    };

    // Effect to zoom to route when locations are available
    useEffect(() => {
        if (pickupLocation?.position && dropoffLocation?.position) {
            fitMapToRoute();
        }
    }, [pickupLocation, dropoffLocation]);

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
                    {pickupLocation?.position && (
                        <Marker
                            coordinate={{
                                latitude: pickupLocation.position.lat,
                                longitude: pickupLocation.position.lng
                            }}
                            title="Điểm đón"
                        >
                            <View style={styles.motorcycleMarker}>
                                <FontAwesome5 name="motorcycle" size={24} color={COLOR.orange50} />
                            </View>
                        </Marker>
                    )}

                    {/* Dropoff Marker */}
                    {dropoffLocation?.position && (
                        <Marker
                            coordinate={{
                                latitude: dropoffLocation.position.lat,
                                longitude: dropoffLocation.position.lng
                            }}
                            title="Điểm trả"
                            pinColor="red"
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

                {/* Zoom Button */}
                {/* <TouchableOpacity
                    style={styles.zoomButton}
                    onPress={fitMapToRoute}
                >
                    <Ionicons name="locate" size={24} color="white" />
                </TouchableOpacity> */}

                {/* Fixed Info Panel */}
                <View style={styles.infoPanel}>
                    {/* Order Summary - Clickable to go to details */}
                    <TouchableOpacity
                        style={styles.orderSummary}
                        onPress={() => router.push('/order/order-detail/delivery-detail')}
                    >
                        <View style={styles.orderHeader}>
                            <View style={styles.orderStatus}>
                                <View style={styles.statusIndicator}>
                                    <FontAwesome5 name="truck" size={24} color={COLOR.orange50} />
                                </View>
                                <View>
                                    <Text style={styles.statusText}>{orderData.status}</Text>
                                    <Text style={styles.orderId}>Mã đơn: {orderData.orderId}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#666" />
                        </View>
                    </TouchableOpacity>

                    {/* Driver Information */}
                    <View style={styles.driverSection}>
                        <Text style={styles.sectionTitle}>Thông tin tài xế</Text>
                        <View style={styles.driverInfo}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoIcon}>
                                    <FontAwesome5 name="user" size={20} color="#666" />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Tài xế</Text>
                                    <Text style={styles.infoValue}>{orderData.driver.name}</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoIcon}>
                                    <Ionicons name="call-outline" size={20} color="#666" />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Liên hệ</Text>
                                    <Text style={styles.infoValue}>{orderData.driver.phone}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Fixed Footer with Action Buttons */}
                    <View style={styles.panelFooter}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="call" size={24} color={COLOR.orange50} />
                            <Text style={styles.actionText}>Gọi tài xế</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="chatbubble-ellipses" size={24} color={COLOR.orange50} />
                            <Text style={styles.actionText}>Nhắn tin</Text>
                        </TouchableOpacity>
                    </View>
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