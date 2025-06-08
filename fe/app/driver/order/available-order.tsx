import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Platform,
    ScrollView,
    Modal,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import socket from '@/services/socket';
import { OrderDetail, OrderLocation, OrderMain, OrderSenderReceiver } from '@/types';

const OrderDetails = () => {
    const router = useRouter();
    const { vehicleType } = useLocalSearchParams();
    console.log(vehicleType)

    const [orderId, setOrderId] = useState()
    const [showPackageInfo, setShowPackageInfo] = useState(false);
    const [orderMain, setOrderMain] = useState<OrderMain>();
    const [orderDetail, setOrderDetail] = useState<OrderDetail>();
    const [pickupDropoffDistance, setPickupDropoffDistance] = useState(0);
    const [driverPickupDistance, setDriverPickupDistance] = useState(0);
    const [orderLocation, setOrderLocation] = useState<OrderLocation>();
    const [pickupDropoffPolyline, setPickupDropoffPolyline] = useState<string>();
    const [driverPickupPolyline, setDriverPickupPolyline] = useState<string>();
    const [orderSenderReceiver, setOrderSenderReceiver] = useState<OrderSenderReceiver>();
    const [ttl, setTtl] = useState<number | undefined>();

    useEffect(() => {
        console.log('Fetching order details...');
        socket.emit('order:available', {}, (response) => {
            if (response.success) {
                console.log(response);
                setOrderId(response.data.orderId)
                setOrderMain(response.data.orderMain);
                setOrderDetail(response.data.orderDetail);
                setPickupDropoffDistance(response.data.pickupDropoffDistance);
                setDriverPickupDistance(response.data.driverPickupDistance);
                setOrderLocation(response.data.orderLocation);
                setTtl(response.data.ttl);
                setPickupDropoffPolyline(response.data.pickupDropoffPolyline);
                setDriverPickupPolyline(response.data.driverPickupPolyline);
                setOrderSenderReceiver(response.data.orderSenderReceiver)
            } else {
                console.error('Error fetching order details:', response.error);
            }
        });
    }, []);

    // Countdown TTL
    useEffect(() => {
        if (!ttl || ttl <= 0) return;
        const interval = setInterval(() => {
            setTtl((prev) => {
                if (!prev || prev <= 1) {
                    // Reset all order data when TTL expires
                    setOrderMain(undefined);
                    setOrderDetail(undefined);
                    setPickupDropoffDistance(0);
                    setDriverPickupDistance(0);
                    setOrderLocation(undefined);
                    setTtl(undefined);
                    clearInterval(interval);
                    setDriverPickupPolyline(undefined);
                    setPickupDropoffPolyline(undefined);
                    return undefined;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [ttl]);

    const handleOnAccept = () => {
        socket.emit('order:reply', {
            accepted: true,
        })
        router.push({
            pathname: '/driver/delivery/on-delivery',

            params: {
                orderId: orderId,
                orderSenderReceiver: JSON.stringify(orderSenderReceiver),
                orderMain: JSON.stringify(orderMain),
                driverPickupPolyline: driverPickupPolyline,
                pickupDropoffPolyline: pickupDropoffPolyline,
                orderLocation: JSON.stringify(orderLocation),
                pickupDropoffDistance: pickupDropoffDistance,
                orderDetail: JSON.stringify(orderDetail),
            }
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.serviceInfo}>
                        {/* <Image
                            source={require('../../assets/images/bike-icon.png')}
                            style={styles.bikeIcon}
                        /> */}
                        <Text style={styles.serviceName}>
                            {vehicleType === 'MOTORBIKE' ? 'Đơn hàng xe máy' : 'Đơn hàng mới'}
                        </Text>
                    </View>
                </View>

                {!orderId ? (
                    <View style={styles.noOrderContainer}>
                        <MaterialIcons
                            name={vehicleType === 'MOTORBIKE' ? 'two-wheeler' : 'local-shipping'}
                            size={48}
                            color="#ccc"
                        />
                        <Text style={styles.noOrderText}>Chưa có đơn hàng mới</Text>
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.acceptButtonText}>Quay về</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Price Section */}
                        <View style={styles.priceSection}>
                            <Text style={styles.priceLabel}>Cước phí</Text>
                            <Text style={styles.price}>
                                {orderMain?.addonPrice !== undefined && orderMain?.deliveryPrice && orderMain?.carPrice !== undefined &&
                                    (orderMain?.addonPrice + orderMain.deliveryPrice + orderMain.carPrice).toLocaleString()}đ
                            </Text>
                            <View style={styles.paymentMethods}>
                                <View style={styles.paymentMethod}>
                                    <Text style={styles.paymentMethodText}>Thẻ/Ví</Text>
                                </View>
                                <View style={[styles.paymentMethod, styles.paymentMethodInactive]}>
                                    <Text style={styles.paymentMethodTextInactive}>Giảm giá</Text>
                                </View>
                            </View>
                        </View>

                        {/* Trip Info */}
                        <View style={styles.tripInfo}>
                            <Text style={styles.tripDistance}>Khoảng cách: {`${pickupDropoffDistance}`} m</Text>
                            <Text style={styles.currentDistance}>Đang cách bạn {`${driverPickupDistance}`} m</Text>
                        </View>

                        {/* Location Details */}
                        <View style={styles.locationDetails}>
                            {/* Pickup Point */}
                            <View style={styles.locationPoint}>
                                <View style={styles.locationIconContainer}>
                                    <View style={[styles.locationDot, styles.startDot]} />
                                    <Text style={styles.locationLabel}>Điểm lấy hàng</Text>
                                </View>
                                <View style={styles.locationText}>
                                    <Text style={styles.locationName}>{`${orderLocation?.pickupTitle}`}</Text>
                                    <Text style={styles.locationAddress}>{`${orderLocation?.pickupAddress}`}</Text>
                                </View>
                            </View>

                            {/* Package Info Button */}
                            <TouchableOpacity
                                style={styles.packageInfoButton}
                                onPress={() => setShowPackageInfo(true)}
                            >
                                <MaterialIcons name="inventory" size={20} color="#007AFF" />
                                <Text style={styles.packageInfoButtonText}>Thông tin bưu kiện</Text>
                                <MaterialIcons name="chevron-right" size={20} color="#007AFF" />
                            </TouchableOpacity>

                            {/* Delivery Point */}
                            <View style={styles.locationPoint}>
                                <View style={styles.locationIconContainer}>
                                    <View style={[styles.locationDot, styles.endDot]} />
                                    <Text style={styles.locationLabel}>Điểm trả hàng</Text>
                                </View>
                                <View style={styles.locationText}>
                                    <Text style={styles.locationName}>{`${orderLocation?.dropoffTitle}`}</Text>
                                    <Text style={styles.locationAddress}>{`${orderLocation?.dropoffAddress}`}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Accept Button */}
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={handleOnAccept}
                        >
                            <Text style={styles.acceptButtonText}>Nhận chuyến</Text>
                            <View style={styles.timeContainer}>
                                <Text style={styles.timeText}>{ttl ?? 0}</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            {/* Package Info Modal */}
            <Modal
                visible={showPackageInfo}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowPackageInfo(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Thông tin bưu kiện</Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowPackageInfo(false)}
                            >
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.packageDetails}>
                            <View style={styles.packageRow}>
                                <View style={styles.packageItem}>
                                    <MaterialIcons name="category" size={20} color="#666" />
                                    <View style={styles.packageItemContent}>
                                        <Text style={styles.packageItemLabel}>Loại</Text>
                                        <Text style={styles.packageItemValue}>{`${orderDetail?.packageType}`}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.packageRow}>
                                <View style={styles.packageItem}>
                                    <MaterialIcons name="line-weight" size={20} color="#666" />
                                    <View style={styles.packageItemContent}>
                                        <Text style={styles.packageItemLabel}>Cân nặng</Text>
                                        <Text style={styles.packageItemValue}>{`${orderDetail?.weightKg}`} kg</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.packageRow}>
                                <View style={styles.packageItem}>
                                    <MaterialIcons name="straighten" size={20} color="#666" />
                                    <View style={styles.packageItemContent}>
                                        <Text style={styles.packageItemLabel}>Kích thước</Text>
                                        <Text style={styles.packageItemValue}>{`${orderDetail?.lengthCm} x ${orderDetail?.widthCm} x ${orderDetail?.heightCm} cm`}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    serviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bikeIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    priceSection: {
        marginBottom: 20,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    paymentMethods: {
        flexDirection: 'row',
        marginTop: 10,
    },
    paymentMethod: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 10,
    },
    paymentMethodInactive: {
        backgroundColor: '#F0F0F0',
    },
    paymentMethodText: {
        color: 'white',
        fontSize: 14,
    },
    paymentMethodTextInactive: {
        color: '#666',
        fontSize: 14,
    },
    tripInfo: {
        marginBottom: 20,
    },
    tripDistance: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    currentDistance: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    locationDetails: {
        marginBottom: 20,
    },
    locationPoint: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    locationIconContainer: {
        alignItems: 'center',
        marginRight: 10,
        width: 80,
    },
    locationDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginBottom: 4,
    },
    locationLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    startDot: {
        backgroundColor: '#000',
    },
    endDot: {
        backgroundColor: '#FF9500',
    },
    locationText: {
        flex: 1,
    },
    locationName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    locationAddress: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    packageInfoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginLeft: 80,
        marginBottom: 15,
    },
    packageInfoButtonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
        marginHorizontal: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalCloseButton: {
        padding: 4,
    },
    packageDetails: {
        gap: 15,
    },
    packageRow: {
        flexDirection: 'row',
        gap: 15,
    },
    packageItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
    },
    packageItemContent: {
        marginLeft: 10,
    },
    packageItemLabel: {
        fontSize: 12,
        color: '#666',
    },
    packageItemValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginTop: 2,
    },
    acceptButton: {
        backgroundColor: '#00BFA5',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 25,
        marginTop: 20,
        marginBottom: 20,
    },
    acceptButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    timeContainer: {
        backgroundColor: 'white',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        color: '#00BFA5',
        fontSize: 14,
        fontWeight: 'bold',
    },
    noOrderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    noOrderText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
});

export default OrderDetails;