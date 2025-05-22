import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';

const DELIVERY_STATES = {
    GOING_TO_PICKUP: 'GOING_TO_PICKUP',
    PICKING_UP: 'PICKING_UP',
    DELIVERING: 'DELIVERING',
};

const OnDelivery = () => {
    const router = useRouter();
    const [deliveryState, setDeliveryState] = useState(DELIVERY_STATES.GOING_TO_PICKUP);

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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Map View */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 10.7769,
                    longitude: 106.7009,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{ latitude: 10.7769, longitude: 106.7009 }}
                    title="Vị trí hiện tại"
                />
            </MapView>

            {/* Customer Info Card */}
            <View style={styles.customerCard}>
                <View style={styles.customerHeader}>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            style={styles.detailButton}
                            onPress={() => router.push("/driver/order-detail")}
                        >
                            <Ionicons name="document-text-outline" size={20} color="#007AFF" />
                            <Text style={styles.detailText}>Chi tiết đơn hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.directionButton}
                            onPress={() => router.push("/driver/direct-route")}
                        >
                            <Ionicons name="navigate" size={20} color="#007AFF" />
                            <Text style={styles.directionText}>Điều hướng</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>Nguyen Phuong Trinh</Text>
                    <Text style={styles.locationAddress}>
                        Eddie's New York Deli & Diner{'\n'}
                        73 Đường Pasteur, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, 70000, VNM
                    </Text>
                    <Text style={styles.price}>16.000đ <Text style={styles.paymentMethod}>Thẻ/Ví</Text></Text>
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
});

export default OnDelivery; 