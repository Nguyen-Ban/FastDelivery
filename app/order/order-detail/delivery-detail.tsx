import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import COLOR from '../../../constants/Colors';
import { useOrder } from '@/contexts/order.context';

const DeliveryDetailPage = () => {
    const router = useRouter();
    const { specialDemands, packageType,
        orderId, sender, receiver,
        pickupLocation, dropoffLocation,
        weightKg, lengthCm, widthCm, heightCm, sizeName, note, addonPrice, deliveryPrice } = useOrder();

    // Mock order data (có thể thay đổi khi tích hợp API)
    const orderDetails = {
        orderId: '#FD123456',
        status: 'Đang giao hàng',
        sender: {
            name: 'Nguyễn Văn A',
            phone: '0909123456',
        },
        pickupAddress: '123 Nguyễn Văn A, Quận 1, TP.HCM',
        receiver: {
            name: 'Trần Thị B',
            phone: '0909988776',
        },
        dropoffAddress: '456 Lê Văn B, Quận 2, TP.HCM',
        item: {
            name: 'Tài liệu quan trọng',
            packageType: 'DOCUMENT',
            weight: 0.5,
            size: '50 x 40 x 30 cm',
            value: 200000,
        },
        payment: {
            method: 'Tiền mặt (Người gửi)',
            status: 'Đã thanh toán',
            totalAmount: 132000,
        },
        specialRequests: {
            handDelivery: true,
            fragileDelivery: true,
            donateDriver: 10000,
            homeMoving: false,
            loading: false,
            businessValue: 200000,
            eDocument: false,
            waiting: true,
        },
        notes: 'Xin gọi trước khi giao hàng',
    };

    // Khai báo type cho icon name
    type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];
    type SpecialTag = { label: string; icon: MaterialIconName };
    const specialTags: SpecialTag[] = [];
    if (specialDemands?.handDelivery) specialTags.push({ label: 'Giao tận tay', icon: 'hand' as MaterialIconName });
    if (specialDemands?.fragileDelivery) specialTags.push({ label: 'Hàng dễ vỡ', icon: 'broken-image' as MaterialIconName });
    if (specialDemands?.waiting) specialTags.push({ label: 'Tài xế chờ', icon: 'timer' as MaterialIconName });
    if (specialDemands?.donateDriver && specialDemands?.donateDriver > 0) specialTags.push({ label: `Tip tài xế: ${specialDemands?.donateDriver.toLocaleString()}đ`, icon: 'volunteer-activism' as MaterialIconName });
    if (specialDemands?.businessValue && specialDemands?.businessValue > 0) specialTags.push({ label: `Giá trị khai báo: ${specialDemands?.businessValue.toLocaleString()}đ`, icon: 'attach-money' as MaterialIconName });
    if (specialDemands?.eDocument) specialTags.push({ label: 'Chứng từ điện tử', icon: 'description' as MaterialIconName });
    if (specialDemands?.homeMoving) specialTags.push({ label: 'Chuyển nhà', icon: 'home' as MaterialIconName });
    if (specialDemands?.loading) specialTags.push({ label: 'Cần bốc xếp', icon: 'local-shipping' as MaterialIconName });

    const packageTypeLabel: Record<string, string> = {
        FOOD: 'Đồ ăn',
        DOCUMENT: 'Tài liệu',
        PARCEL: 'Bưu kiện',
        OTHER: 'Khác',
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

                {/* Sender & Pickup Address */}
                <View style={styles.cardBox}>

                    <View style={styles.addressBox}>
                        <MaterialIcons name="place" size={22} color={COLOR.orange50} style={{ marginRight: 8 }} />
                        <View>
                            <Text style={styles.addressLabel}>Điểm lấy hàng</Text>
                            <Text style={styles.addressText}>{pickupLocation?.address}</Text>
                        </View>
                    </View>
                    <View style={styles.addressBox}>
                        <MaterialIcons name="place" size={22} color={COLOR.orange50} style={{ marginRight: 8 }} />
                        <View>
                            <Text style={styles.addressLabel}>Điểm trả hàng</Text>
                            <Text style={styles.addressText}>{dropoffLocation?.address}</Text>
                        </View>
                    </View>
                </View>

                {/* Receiver & Dropoff Address */}
                <View style={styles.cardBox}>
                    <View style={styles.personBox}>
                        <Ionicons name="person-circle-outline" size={28} color={COLOR.orange50} style={{ marginRight: 8 }} />
                        <View>
                            <Text style={styles.personLabel}>Người gửi</Text>
                            <Text style={styles.personName}>{sender?.name}</Text>
                            <Text style={styles.personPhone}>{sender?.phoneNumber}</Text>
                        </View>
                    </View>
                    <View style={styles.personBox}>
                        <Ionicons name="person-circle-outline" size={28} color={COLOR.orange50} style={{ marginRight: 8 }} />
                        <View>
                            <Text style={styles.personLabel}>Người nhận</Text>
                            <Text style={styles.personName}>{receiver?.name}</Text>
                            <Text style={styles.personPhone}>{receiver?.phoneNumber}</Text>
                        </View>
                    </View>


                </View>

                {/* Item Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin hàng hóa</Text>
                    <View style={styles.itemCard}>
                        <View style={styles.itemRow}>
                            <MaterialIcons name="category" size={20} color="#666" style={{ marginRight: 6 }} />
                            <Text style={styles.itemType}>{packageType}</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <MaterialIcons name="straighten" size={18} color="#666" style={{ marginRight: 4 }} />
                            <Text style={styles.itemDetails}>Kích thước: {`${lengthCm} x ${widthCm} x ${heightCm} cm`}</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <MaterialIcons name="line-weight" size={18} color="#666" style={{ marginRight: 4 }} />
                            <Text style={styles.itemDetails}>Cân nặng: {weightKg} kg</Text>
                        </View>
                    </View>
                </View>

                {/* Special Requests as Chips */}
                {specialTags.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Yêu cầu đặc biệt</Text>
                        <View style={styles.chipContainer}>
                            {specialTags.map((tag, idx) => (
                                <View key={idx} style={styles.chip}>
                                    <MaterialIcons name={tag.icon} size={16} color="#fff" style={{ marginRight: 4 }} />
                                    <Text style={styles.chipText}>{tag.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

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
                            <Text style={styles.paymentLabel}>Tổng cộng:</Text>
                            <Text style={[styles.paymentValue, styles.totalAmount]}>
                                đ{(addonPrice + deliveryPrice).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Notes */}
                {orderDetails.notes && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ghi chú</Text>
                        <Text style={styles.notesText}>{note}</Text>
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
    cardBox: {
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        padding: 12,
        gap: 12,
    },
    personBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    addressBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    personLabel: {
        fontSize: 13,
        color: '#888',
        marginBottom: 2,
    },
    personName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    personPhone: {
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 2,
    },
    personAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    addressLabel: {
        fontSize: 13,
        color: '#888',
        marginBottom: 2,
    },
    addressText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    itemCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 14,
        marginBottom: 4,
        gap: 6,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    itemType: {
        fontSize: 14,
        color: COLOR.orange50,
        fontWeight: 'bold',
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
        marginBottom: 2,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR.orange50,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginBottom: 6,
        marginRight: 6,
    },
    chipText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
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