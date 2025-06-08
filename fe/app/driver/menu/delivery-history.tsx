import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import orderService from '@/services/order.service';
import COLOR from '@/constants/Colors';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'IN_DELIVERY':
            return COLOR.orange50;
        case 'DELIVERED':
            return COLOR.green40;
        case 'CANCELLED':
            return COLOR.red55;
        default:
            return COLOR.blue70;
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'IN_DELIVERY':
            return 'Đang giao hàng';
        case 'DELIVERED':
            return 'Đã giao';
        case 'CANCELLED':
            return 'Đã hủy';
        default:
            return 'Chờ xác nhận';
    }
};

interface DeliveryItem {
    id: string;
    price: number;
    time: string;
    vehicleType: string;
    deliveryType: string;
    packageType: string;
    pickupAddress: string;
    dropoffAddress: string;
    status: string;
}

const DeliveryHistory = () => {
    const router = useRouter();
    const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDeliveries = async () => {
        try {
            setLoading(true);
            const res = await orderService.getDriverOrderList();
            if (res.success) {
                setDeliveries(res.data);
            }
        } catch (error) {
            console.error('Error fetching deliveries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveries();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử vận chuyển</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Delivery List */}
            <ScrollView style={styles.deliveryList}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Đang tải...</Text>
                    </View>
                ) : deliveries.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text>Không có lịch sử chuyến đi</Text>
                    </View>
                ) : (
                    deliveries.map((delivery, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.deliveryItem}
                            onPress={() => router.push({
                                pathname: '/driver/menu/delivery-detail',
                                params: { id: delivery.id }
                            })}
                        >
                            <View style={styles.deliveryHeader}>
                                <View>
                                    <View style={styles.vehicleInfo}>
                                        <Ionicons name="bicycle" size={20} color="#00BFA5" />
                                        <Text style={styles.amount}>{delivery.price.toLocaleString()}đ</Text>
                                    </View>
                                    <Text style={styles.time}>
                                        {new Date(delivery.time).toLocaleString('vi-VN')}
                                    </Text>
                                    <View style={styles.typeInfo}>
                                        <Text style={styles.vehicleType}>
                                            {delivery.vehicleType === 'MOTORBIKE' ? 'Xe máy' : 'Xe tải'}
                                        </Text>
                                        <Text style={styles.separator}>|</Text>
                                        <Text style={styles.deliveryType}>
                                            {delivery.deliveryType === 'EXPRESS' ? 'Siêu tốc' : 'Tiết kiệm'}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.statusButton, { backgroundColor: getStatusColor(delivery.status) }]}
                                >
                                    <Text style={styles.statusText}>{getStatusText(delivery.status)}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.addressContainer}>
                                <View style={styles.packageTypeRow}>
                                    <Ionicons name="cube-outline" size={16} color="#666" />
                                    <Text style={styles.packageType}>
                                        {delivery.packageType}
                                    </Text>
                                </View>
                                <View style={styles.addressRow}>
                                    <View style={styles.dotBlack} />
                                    <Text style={styles.address} numberOfLines={1}>{delivery.pickupAddress}</Text>
                                </View>
                                <View style={styles.addressRow}>
                                    <View style={styles.dotOrange} />
                                    <Text style={styles.address} numberOfLines={1}>{delivery.dropoffAddress}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    deliveryList: {
        flex: 1,
    },
    deliveryItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    deliveryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    vehicleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    amount: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    typeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleType: {
        fontSize: 12,
        color: '#00BFA5',
    },
    deliveryType: {
        fontSize: 12,
        color: COLOR.orange50,
    },
    statusButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    addressContainer: {
        marginTop: 8,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dotBlack: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#333',
        marginRight: 8,
    },
    dotOrange: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF9500',
        marginRight: 8,
    },
    address: {
        flex: 1,
        fontSize: 14,
        color: '#666',
    },
    packageTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    packageType: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    separator: {
        fontSize: 12,
        color: '#666',
        marginHorizontal: 4,
    },
});

export default DeliveryHistory; 