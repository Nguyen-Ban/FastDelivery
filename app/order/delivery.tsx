import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import COLOR from '../../constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Fixed panel height
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.4;

const DeliveryPage = () => {
    const router = useRouter();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                {/* Full Screen Map */}
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 10.762622,
                        longitude: 106.660172,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: 10.762622,
                            longitude: 106.660172,
                        }}
                        title="Vị trí hiện tại"
                    />
                </MapView>

                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                {/* Fixed Info Panel */}
                <View style={styles.infoPanel}>
                    {/* Panel Header */}
                    <View style={styles.panelHeader}>
                        <View style={styles.orderStatus}>
                            <View style={styles.statusIndicator}>
                                <FontAwesome5 name="truck" size={24} color={COLOR.orange50} />
                            </View>
                            <Text style={styles.statusText}>Đơn hàng đang được giao</Text>
                        </View>
                    </View>

                    {/* Scrollable Content */}
                    <ScrollView
                        style={styles.scrollContent}
                        contentContainerStyle={styles.scrollContentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Delivery Information */}
                        <View style={styles.deliveryInfo}>
                            <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>

                            <View style={styles.infoRow}>
                                <View style={styles.infoIcon}>
                                    <Ionicons name="time-outline" size={20} color="#666" />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Thời gian dự kiến</Text>
                                    <Text style={styles.infoValue}>45 phút</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoIcon}>
                                    <FontAwesome5 name="route" size={20} color="#666" />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Khoảng cách</Text>
                                    <Text style={styles.infoValue}>12.5 km</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoIcon}>
                                    <FontAwesome5 name="user" size={20} color="#666" />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Tài xế</Text>
                                    <Text style={styles.infoValue}>Nguyễn Văn A</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoIcon}>
                                    <Ionicons name="call-outline" size={20} color="#666" />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Liên hệ</Text>
                                    <Text style={styles.infoValue}>0123456789</Text>
                                </View>
                            </View>
                        </View>

                        {/* Order Details */}
                        <View style={styles.orderDetails}>
                            <Text style={styles.sectionTitle}>Chi tiết đơn hàng</Text>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Mã đơn hàng:</Text>
                                <Text style={styles.detailValue}>#FD123456</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Trạng thái thanh toán:</Text>
                                <Text style={[styles.detailValue, styles.paidStatus]}>Đã thanh toán</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Phương thức thanh toán:</Text>
                                <Text style={styles.detailValue}>Tiền mặt (Người gửi)</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Tổng phí:</Text>
                                <Text style={[styles.detailValue, styles.totalFee]}>đ132.000</Text>
                            </View>
                        </View>
                    </ScrollView>

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
        overflow: 'hidden',
    },
    panelHeader: {
        backgroundColor: '#fff',
        paddingTop: 15,
        paddingHorizontal: 20,
        paddingBottom: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
        marginRight: 15,
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContent: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    deliveryInfo: {
        marginBottom: 20,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 15,
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
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    orderDetails: {
        marginBottom: 70, // Add extra space at the bottom to ensure all content is visible when scrolled
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    paidStatus: {
        color: '#4CAF50',
    },
    totalFee: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.orange50,
    },
    panelFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
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
});

export default DeliveryPage; 