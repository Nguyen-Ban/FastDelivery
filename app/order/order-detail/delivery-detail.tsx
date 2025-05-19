import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLOR from '../../../constants/Colors';

const DeliveryDetailPage = () => {
    const router = useRouter();

    // Mock order data (will be replaced with API data later)
    const orderDetails = {
        orderId: '#FD123456',
        status: 'Đang giao hàng',
        pickupAddress: '123 Nguyễn Văn A, Quận 1, TP.HCM',
        dropoffAddress: '456 Lê Văn B, Quận 2, TP.HCM',
        items: [
            { id: 1, name: 'Gói hàng #1', size: 'Nhỏ', weight: '0.5kg' },
            { id: 2, name: 'Gói hàng #2', size: 'Trung bình', weight: '1.2kg' },
        ],
        payment: {
            method: 'Tiền mặt (Người gửi)',
            status: 'Đã thanh toán',
            deliveryFee: 50000,
            totalAmount: 132000,
        },
        notes: 'Xin gọi trước khi giao hàng',
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLOR.orange50} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Order Status */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trạng thái đơn hàng</Text>
                    <View style={styles.statusContainer}>
                        <View style={styles.statusIndicator} />
                        <Text style={styles.statusText}>{orderDetails.status}</Text>
                    </View>
                </View>

                {/* Addresses */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Địa chỉ</Text>
                    <View style={styles.addressContainer}>
                        <View style={styles.addressItem}>
                            <Text style={styles.addressLabel}>Điểm đón:</Text>
                            <Text style={styles.addressText}>{orderDetails.pickupAddress}</Text>
                        </View>
                        <View style={styles.addressItem}>
                            <Text style={styles.addressLabel}>Điểm trả:</Text>
                            <Text style={styles.addressText}>{orderDetails.dropoffAddress}</Text>
                        </View>
                    </View>
                </View>

                {/* Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin hàng hóa</Text>
                    {orderDetails.items.map((item) => (
                        <View key={item.id} style={styles.itemContainer}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDetails}>Kích thước: {item.size}</Text>
                            <Text style={styles.itemDetails}>Cân nặng: {item.weight}</Text>
                        </View>
                    ))}
                </View>

                {/* Payment */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thanh toán</Text>
                    <View style={styles.paymentContainer}>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Phương thức:</Text>
                            <Text style={styles.paymentValue}>{orderDetails.payment.method}</Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Trạng thái:</Text>
                            <Text style={[styles.paymentValue, styles.paidStatus]}>
                                {orderDetails.payment.status}
                            </Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Phí vận chuyển:</Text>
                            <Text style={styles.paymentValue}>
                                đ{orderDetails.payment.deliveryFee.toLocaleString()}
                            </Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Tổng cộng:</Text>
                            <Text style={[styles.paymentValue, styles.totalAmount]}>
                                đ{orderDetails.payment.totalAmount.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Notes */}
                {orderDetails.notes && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ghi chú</Text>
                        <Text style={styles.notesText}>{orderDetails.notes}</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        color: '#333',
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLOR.orange50,
        marginRight: 8,
    },
    statusText: {
        fontSize: 16,
        color: COLOR.orange50,
        fontWeight: '500',
    },
    addressContainer: {
        gap: 12,
    },
    addressItem: {
        marginBottom: 8,
    },
    addressLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 15,
        color: '#333',
    },
    itemContainer: {
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 4,
        color: '#333',
    },
    itemDetails: {
        fontSize: 14,
        color: '#666',
    },
    paymentContainer: {
        gap: 8,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentLabel: {
        fontSize: 14,
        color: '#666',
    },
    paymentValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    paidStatus: {
        color: '#4CAF50',
    },
    totalAmount: {
        color: COLOR.orange50,
        fontSize: 16,
        fontWeight: 'bold',
    },
    notesText: {
        fontSize: 14,
        color: '#666',
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 8,
    },
});

export default DeliveryDetailPage; 