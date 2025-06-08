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
import { useLocalSearchParams, useRouter } from 'expo-router';
import orderService from '@/services/order.service';
import COLOR from '@/constants/Colors';

interface DeliveryDetail {
    id: string;
    sender: {
        name: string;
        phoneNumber: string;
    };
    receiver: {
        name: string;
        phoneNumber: string;
    };
    vehicleType: string;
    deliveryType: string;
    pickupAddress: string;
    dropoffAddress: string;
    status: "IN_DELIVERY" | "DELIVERED";
    paymentStatus: "COMPLETED" | "PENDING";
    paymentMethod: "VNPAY" | "SENDER_CASH" | "RECEIVER_CASH";
    price: number;
    time: string;
    detail: {
        packageType: string;
        weightKg: number;
        lengthCm: number;
        widthCm: number;
        heightCm: number;
        sizeName?: string;
    };
    specialDemand: {
        handDelivery: boolean;
        fragileDelivery: boolean;
        donateDriver: boolean;
        homeMoving: boolean;
        loading: boolean;
        businessValue: boolean;
        eDocument: boolean;
        waiting: boolean;
    };
}

const DeliveryDetail = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [detail, setDetail] = useState<DeliveryDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "IN_DELIVERY":
                return "#FF9500";
            case "DELIVERED":
                return "#4CD964";
            default:
                return "#00BFA5";
        }
    };

    const getPaymentStatusText = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "Đã thanh toán";
            case "PENDING":
                return "Chưa thanh toán";
            default:
                return status;
        }
    };

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case "VNPAY":
                return "Cổng VNPay";
            case "SENDER_CASH":
                return "Tiền mặt";
            case "RECEIVER_CASH":
                return "Tiền mặt";
            default:
                return method;
        }
    };

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const res = await orderService.fetchDriverEventDetail(id as string);
            if (res.success) {
                setDetail(res.data);
            }
        } catch (error) {
            console.error('Error fetching delivery detail:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết chuyến đi</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text>Đang tải...</Text>
                </View>
            ) : detail ? (
                <ScrollView style={styles.content}>
                    {/* Status and Price */}
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(detail.status) }]}>
                            <Text style={styles.statusText}>
                                {detail.status === "IN_DELIVERY" ? "Đang giao hàng" : "Đã giao"}
                            </Text>
                        </View>
                        <Text style={styles.price}>{detail.price.toLocaleString()}đ</Text>
                    </View>

                    {/* Payment Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
                        <View style={styles.infoContainer}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Trạng thái thanh toán:</Text>
                                <Text style={[styles.detailValue, { color: detail.paymentStatus === "COMPLETED" ? "#4CD964" : "#FF9500" }]}>
                                    {getPaymentStatusText(detail.paymentStatus)}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Phương thức thanh toán:</Text>
                                <Text style={styles.detailValue}>{getPaymentMethodText(detail.paymentMethod)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Vehicle and Delivery Type */}
                    <View style={styles.typeContainer}>
                        <View style={styles.typeItem}>
                            <Text style={styles.typeLabel}>Loại xe</Text>
                            <Text style={styles.typeValue}>
                                {detail.vehicleType === 'MOTORBIKE' ? 'Xe máy' : 'Xe tải'}
                            </Text>
                        </View>
                        <View style={styles.typeItem}>
                            <Text style={styles.typeLabel}>Loại giao hàng</Text>
                            <Text style={styles.typeValue}>
                                {detail.deliveryType === 'EXPRESS' ? 'Siêu tốc' : 'Tiết kiệm'}
                            </Text>
                        </View>
                    </View>

                    {/* Package Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin gói hàng</Text>
                        <View style={styles.infoContainer}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Loại hàng:</Text>
                                <Text style={styles.detailValue}>{detail.detail.packageType}</Text>
                            </View>
                            {detail.detail.sizeName && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Kích thước:</Text>
                                    <Text style={styles.detailValue}>{detail.detail.sizeName}</Text>
                                </View>
                            )}
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Cân nặng:</Text>
                                <Text style={styles.detailValue}>{detail.detail.weightKg} kg</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Kích thước:</Text>
                                <Text style={styles.detailValue}>
                                    {detail.detail.lengthCm} x {detail.detail.widthCm} x {detail.detail.heightCm} cm
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Special Demands */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Yêu cầu đặc biệt</Text>
                        <View style={styles.infoContainer}>
                            {detail.specialDemand.handDelivery && (
                                <View style={styles.demandItem}>
                                    <Ionicons name="hand-left" size={20} color="#00BFA5" />
                                    <Text style={styles.demandText}>Giao tận tay</Text>
                                </View>
                            )}
                            {detail.specialDemand.fragileDelivery && (
                                <View style={styles.demandItem}>
                                    <Ionicons name="warning" size={20} color="#FF9500" />
                                    <Text style={styles.demandText}>Hàng dễ vỡ</Text>
                                </View>
                            )}
                            {detail.specialDemand.donateDriver && (
                                <View style={styles.demandItem}>
                                    <Ionicons name="heart" size={20} color="#FF3B30" />
                                    <Text style={styles.demandText}>Ủng hộ tài xế</Text>
                                </View>
                            )}
                            {detail.specialDemand.homeMoving && (
                                <View style={styles.demandItem}>
                                    <Ionicons name="home" size={20} color="#007AFF" />
                                    <Text style={styles.demandText}>Chuyển nhà</Text>
                                </View>
                            )}
                            {detail.specialDemand.loading && (
                                <View style={styles.demandItem}>
                                    <Ionicons name="cube" size={20} color="#5856D6" />
                                    <Text style={styles.demandText}>Có xếp dỡ</Text>
                                </View>
                            )}
                            {detail.specialDemand.businessValue && (
                                <View style={styles.demandItem}>
                                    <Ionicons name="briefcase" size={20} color="#4CD964" />
                                    <Text style={styles.demandText}>Hàng có giá trị</Text>
                                </View>
                            )}
                            {detail.specialDemand.eDocument && (
                                <View style={styles.demandItem}>
                                    <Ionicons name="document" size={20} color="#8E8E93" />
                                    <Text style={styles.demandText}>Tài liệu điện tử</Text>
                                </View>
                            )}
                            {detail.specialDemand.waiting && (
                                <View style={styles.demandItem}>
                                    <Ionicons name="time" size={20} color="#FF9500" />
                                    <Text style={styles.demandText}>Có chờ đợi</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Sender Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin người gửi</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.name}>{detail.sender.name}</Text>
                            <Text style={styles.phone}>{detail.sender.phoneNumber}</Text>
                            <View style={styles.addressContainer}>
                                <View style={styles.dotBlack} />
                                <Text style={styles.address}>{detail.pickupAddress}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Receiver Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin người nhận</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.name}>{detail.receiver.name}</Text>
                            <Text style={styles.phone}>{detail.receiver.phoneNumber}</Text>
                            <View style={styles.addressContainer}>
                                <View style={styles.dotOrange} />
                                <Text style={styles.address}>{detail.dropoffAddress}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.errorContainer}>
                    <Text>Không thể tải thông tin chuyến đi</Text>
                </View>
            )}
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
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    statusBadge: {
        backgroundColor: '#00BFA5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    typeContainer: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    typeItem: {
        flex: 1,
    },
    typeLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    typeValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    infoContainer: {
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    phone: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    demandItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    demandText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
    },
});

export default DeliveryDetail; 