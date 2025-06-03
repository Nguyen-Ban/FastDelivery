import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    Linking,
    Animated,
    Alert,
} from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLocation } from '@/contexts';
import { decode } from '@here/flexpolyline';
import COLOR from '@/constants/Colors';
import { DELIVERY_STATES, OrderMain, VEHICLE_TYPES } from '@/types';
import socket from '@/services/socket';




const OnDelivery = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const orderSenderReceiver = JSON.parse(params.orderSenderReceiver as string);
    const orderId = params.orderId as string;
    const orderMain = JSON.parse(params.orderMain as string) as OrderMain;
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
    const markerAnimation = useRef(new Animated.Value(0)).current;
    const [markerPosition, setMarkerPosition] = useState({
        latitude: location?.coord?.lat || 10.762622,
        longitude: location?.coord?.lng || 106.660172,
    });


    const handleActionButton = () => {
        switch (deliveryState) {
            case DELIVERY_STATES.GOING_TO_PICKUP:
                socket.emit('order:picking', {
                    orderId,
                    vehicleType,
                    pickupCoord: {
                        lat: orderLocation.pickupLat,
                        lng: orderLocation.pickupLng
                    },
                    driverCoord:
                    {
                        lat: location?.coord?.lat,
                        lng: location?.coord.lng
                    }
                }, (response) => {
                    if (response.success) setDeliveryState(DELIVERY_STATES.PICKING_UP);
                    else Alert.alert('Bạn phải cách điểm lấy hàng ít nhất 10m')
                })
                break;
            case DELIVERY_STATES.PICKING_UP:
                socket.emit('order:picked', { orderId }, (response) => {
                    if (response.success) setDeliveryState(DELIVERY_STATES.GOING_TO_DROPOFF);
                })
                break;
            case DELIVERY_STATES.GOING_TO_DROPOFF:
                socket.emit('order:delivering', { orderId }, (response) => {
                    if (response.success) setDeliveryState(DELIVERY_STATES.DELIVERING)
                })
                break;
            case DELIVERY_STATES.DELIVERING:
                socket.emit('order:delivered', {
                    orderId,
                    vehicleType,
                    dropoffCoord: {
                        lat: orderLocation.dropoffLat,
                        lng: orderLocation.dropoffLng
                    },
                    driverCoord:
                    {
                        lat: location?.coord?.lat,
                        lng: location?.coord.lng
                    }
                }, (response) => {
                    if (response.success) {
                        router.push({
                            pathname: "/driver/delivery/complete-payment",
                            params: {
                                carPrice: orderMain.carPrice,
                                addonPrice: orderMain.addonPrice,
                                deliveryPrice: orderMain.deliveryPrice,
                                orderId: orderId
                            }
                        }
                        );
                    }
                    else Alert.alert('Bạn phải cách điểm trả hàng ít nhất 10m')
                })
                break;
        }
    };

    const getButtonText = () => {
        switch (deliveryState) {
            case DELIVERY_STATES.GOING_TO_PICKUP:
                return 'Đã đến điểm lấy hàng';
            case DELIVERY_STATES.PICKING_UP:
                return 'Đã lấy hàng';
            case DELIVERY_STATES.GOING_TO_DROPOFF:
                return 'Đang đến điểm trả hàng';
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

    // Update marker position when location changes
    useEffect(() => {
        if (location?.coord?.lat && location.coord.lng) {
            setMarkerPosition({
                latitude: location.coord.lat,
                longitude: location.coord.lng,
            });
        }
    }, [location?.coord]);

    const handleChatCustomer = () => {
        console.log(1)
        router.push({
            pathname: '/driver/delivery/chat',
            params: {
                orderId: orderId,
                customerName: orderSenderReceiver.sender.name
            }
        });
        socket.emit('chat:join', { orderId })

        // Implement chat functionality here
        console.log('Chat with customer');
    };

    const handleCallCustomer = () => {
        const phoneNumber = orderSenderReceiver.sender.phoneNumber;
        if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Map View */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: markerPosition.latitude,
                    longitude: markerPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {/* Animated Pickup Marker */}
                {location?.coord?.lat && location.coord.lng && (
                    <Marker
                        coordinate={markerPosition}
                        title="Vị trí của bạn"
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <View style={styles.motorcycleMarker}>
                            <FontAwesome5 name="motorcycle" size={24} color={COLOR.orange50} />
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
                            onPress={() => router.push({
                                pathname: "/driver/delivery/order-detail",
                                params: { orderId }
                            }
                            )}
                        >
                            <Ionicons name="document-text-outline" size={20} color="#007AFF" />
                            <Text style={styles.detailText}>Chi tiết đơn hàng</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            style={styles.directionButton}
                            onPress={() => router.push("/driver/delivery/direct-route")}
                        >
                            <Ionicons name="navigate" size={20} color="#007AFF" />
                            <Text style={styles.directionText}>Điều hướng</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>

                <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{orderDetail.packageType}</Text>
                    <Text style={styles.locationAddress}>
                        Cân nặng: {orderDetail.weightKg}kg{'\n'}
                        Kích cỡ: {orderDetail.lengthCm}cm x {orderDetail.widthCm}cm x {orderDetail.heightCm}cm
                    </Text>
                    <Text style={styles.price}>Phí thu:  {orderMain?.addonPrice !== undefined && orderMain.deliveryPrice !== undefined && orderMain?.carPrice !== undefined && (orderMain.deliveryPrice + orderMain.addonPrice + orderMain.carPrice).toLocaleString()}đ  <Text style={styles.paymentMethod}>Thẻ/Ví</Text></Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleChatCustomer}>
                        <Ionicons name="chatbubble-outline" size={24} color="#333" />
                        <Text style={styles.actionButtonText}>Nhắn tin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={handleCallCustomer}>
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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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