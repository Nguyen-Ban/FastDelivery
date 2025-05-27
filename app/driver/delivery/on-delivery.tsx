import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLocation } from '@/contexts';
import { decode } from '@here/flexpolyline';
import COLOR from '@/constants/Colors';
import { VEHICLE_TYPES } from '@/types';
import socket from '@/services/socket';


const DELIVERY_STATES = {
    GOING_TO_PICKUP: 'GOING_TO_PICKUP',
    PICKING_UP: 'PICKING_UP',
    DELIVERING: 'DELIVERING',
};

const OnDelivery = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const orderMain = JSON.parse(params.orderMain as string);
    const orderDetail = JSON.parse(params.orderDetail as string) || {};
    const orderLocation = JSON.parse(params.orderLocation as string) || {};
    const pickupDropoffDistance = parseFloat(params.pickupDropoffDistance as string) || 0;
    const pickupDropoffPolyline = params.pickupDropoffPolyline as string
    const driverPickupPolyline = params.driverPickupPolyline as string
    const [deliveryState, setDeliveryState] = useState(DELIVERY_STATES.GOING_TO_PICKUP);

    const vehicleType = VEHICLE_TYPES.MOTORBIKE
    const pickupLat = orderLocation.pickupLat;
    const pickupLng = orderLocation.pickupLng;
    const dropoffLat = orderLocation.dropoffLat;
    const dropoffLng = orderLocation.dropoffLng;
    const mapRef = useRef<MapView>(null);
    const { location } = useLocation();


    const handleActionButton = () => {
        switch (deliveryState) {
            case DELIVERY_STATES.GOING_TO_PICKUP:
                setDeliveryState(DELIVERY_STATES.PICKING_UP);
                break;
            case DELIVERY_STATES.PICKING_UP:
                setDeliveryState(DELIVERY_STATES.DELIVERING);
                break;
            case DELIVERY_STATES.DELIVERING:
                router.push("../driver/complete-payment");
                break;
        }
    };

    const getButtonText = () => {
        switch (deliveryState) {
            case DELIVERY_STATES.GOING_TO_PICKUP:
                return 'Đã đến điểm lấy hàng';
            case DELIVERY_STATES.PICKING_UP:
                return 'Đã lấy hàng';
            case DELIVERY_STATES.DELIVERING:
                return 'Hoàn tất vận chuyển';
            default:
                return '';
        }
    };

    const driverPickupDecoded = driverPickupPolyline ? decode(driverPickupPolyline).polyline : [];
    const pickupDropoffDecoded = pickupDropoffPolyline ? decode(pickupDropoffPolyline).polyline : [];

    // Calculate the center point between pickup and dropoff for initial map region
    const routeCoordinates = [
        location?.coord ? { latitude: location.coord.lat, longitude: location.coord.lng } : null,
        ...driverPickupDecoded.map(point => ({ latitude: point[0], longitude: point[1] })),
        pickupLat && pickupLng ? { latitude: pickupLat, longitude: pickupLng } : null,
        ...pickupDropoffDecoded.map(point => ({ latitude: point[0], longitude: point[1] })),
        dropoffLat && dropoffLng ? { latitude: dropoffLat, longitude: dropoffLng } : null,
    ].filter((p): p is { latitude: number; longitude: number } => !!p);


    // Calculate the center point between pickup and dropoff for initial map region
    const initialRegion = pickupLat && pickupLng && dropoffLat && dropoffLng ? {
        latitude: (pickupLat + dropoffLat) / 2,
        longitude: (pickupLng + dropoffLng) / 2,
        latitudeDelta: Math.max(0.01, Math.abs(pickupLat - dropoffLat) / 2),
        longitudeDelta: Math.max(0.01, Math.abs(pickupLng - dropoffLng) / 2),
    } : {
        latitude: 10.762622,
        longitude: 106.660172,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };


    // Fit map to route when locations are available
    useEffect(() => {
        if (pickupLat && pickupLng && dropoffLat && dropoffLng && mapRef.current) {
            const coordinates = [
                { latitude: pickupLat, longitude: pickupLng },
                { latitude: dropoffLat, longitude: dropoffLng },
                { latitude: location?.coord?.lat, longitude: location?.coord?.lng },
            ];
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 200, left: 50 },
                animated: true
            });
        }
    }, [pickupLat, pickupLng, dropoffLat, dropoffLng]);




    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Map View */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                mapPadding={{ top: 40, right: 40, bottom: 200, left: 40 }}
            >
                {/* Pickup Marker */}
                {location?.coord?.lat && location.coord.lng && (
                    <Marker
                        coordinate={{ latitude: location?.coord?.lat, longitude: location?.coord?.lng }}
                        title="Vị trí của bạn"
                        anchor={{ x: 0.5, y: 0.5 }} // Chính giữa icon
                    >
                        <View style={styles.motorcycleMarker}>
                            {vehicleType === 'MOTORBIKE' ? (
                                <FontAwesome5 name="motorcycle" size={24} color={COLOR.orange50} />
                            ) : (
                                <MaterialCommunityIcons name="car" size={24} color={COLOR.orange50} />
                            )}
                        </View>
                    </Marker>
                )}
                {/* Dropoff Marker */}
                {pickupLat && pickupLng && (
                    <Marker
                        coordinate={{ latitude: pickupLat, longitude: pickupLng }}
                        title="Điểm lấy hàng"
                        pinColor={COLOR.orange50}
                    />
                )}
                {dropoffLat && dropoffLng && (
                    <Marker
                        coordinate={{ latitude: dropoffLat, longitude: dropoffLng }}
                        title="Điểm trả hàng"
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


            {/* Customer Info Card */}
            <View style={styles.customerCard}>
                <View style={styles.customerHeader}>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            style={styles.detailButton}
                            onPress={() => router.push("/driver/delivery/order-detail")}
                        >
                            <Ionicons name="document-text-outline" size={20} color="#007AFF" />
                            <Text style={styles.detailText}>Chi tiết đơn hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.directionButton}
                            onPress={() => router.push("/driver/delivery/direct-route")}
                        >
                            <Ionicons name="navigate" size={20} color="#007AFF" />
                            <Text style={styles.directionText}>Điều hướng</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{orderDetail.packageType}</Text>
                    <Text style={styles.locationAddress}>
                        Cân nặng: {orderDetail.weightKg}kg{'\n'}
                        Kích cỡ: {orderDetail.lengthCm}cm x {orderDetail.widthCm}cm x {orderDetail.heightCm}cm
                    </Text>
                    <Text style={styles.price}>Phí thu: {orderMain.price.toLocaleString()}đ  <Text style={styles.paymentMethod}>Thẻ/Ví</Text></Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={24} color="#333" />
                        <Text style={styles.actionButtonText}>Nhắn tin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="call-outline" size={24} color="#333" />
                        <Text style={styles.actionButtonText}>Gọi điện</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[
                        styles.arrivalButton,
                        deliveryState === DELIVERY_STATES.DELIVERING && styles.completionButton
                    ]}
                    onPress={handleActionButton}
                >
                    <Text style={styles.arrivalButtonText}>{getButtonText()}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    map: {
        flex: 1,
    },
    customerCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    customerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    customerLabel: {
        fontSize: 14,
        color: '#666',
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    detailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    detailText: {
        color: '#007AFF',
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '500',
    },
    directionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    directionText: {
        color: '#007AFF',
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '500',
    },
    customerInfo: {
        marginBottom: 16,
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    locationAddress: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    paymentMethod: {
        color: '#007AFF',
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 'normal',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    actionButton: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    actionButtonText: {
        marginTop: 4,
        fontSize: 12,
        color: '#333',
    },
    arrivalButton: {
        backgroundColor: '#00BFA5',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    completionButton: {
        backgroundColor: '#FF9500',
    },
    arrivalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    motorcycleMarker: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 6,
        elevation: 2,
    },
    infoTag: {
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 6,
    },
    infoValue: {
        fontSize: 15,
        color: '#222',
        fontWeight: '500',
        marginBottom: 2,
    },
});
export default OnDelivery; 