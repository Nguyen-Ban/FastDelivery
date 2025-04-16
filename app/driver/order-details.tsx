import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';

const OrderDetails = () => {
    const router = useRouter();
    const [showPackageInfo, setShowPackageInfo] = useState(false);

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
                        <Text style={styles.serviceName}>Fast Delivery Bike</Text>
                    </View>
                </View>

                {/* Price Section */}
                <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Cước phí</Text>
                    <Text style={styles.price}>20.000đ</Text>
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
                    <Text style={styles.tripDistance}>3,3 km - 1 điểm dừng</Text>
                    <Text style={styles.currentDistance}>Đang cách bạn 0,4 km</Text>
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
                            <Text style={styles.locationName}>Eddie's New York Deli & Diner</Text>
                            <Text style={styles.locationAddress}>73 Đường Pasteur, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, 70000, VNM</Text>
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
                            <Text style={styles.locationName}>Chung Cư Khánh Hội 3</Text>
                            <Text style={styles.locationAddress}>360G Đường Bến Vân Đồn, Phường 1, Quận 4, Hồ Chí Minh, Việt Nam</Text>
                        </View>
                    </View>
                </View>

                {/* Accept Button */}
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => router.push("/driver/on-delivery")}
                >
                    <Text style={styles.acceptButtonText}>Nhận chuyến</Text>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>24</Text>
                    </View>
                </TouchableOpacity>
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
                                        <Text style={styles.packageItemValue}>Hàng điện tử</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.packageRow}>
                                <View style={styles.packageItem}>
                                    <MaterialIcons name="line-weight" size={20} color="#666" />
                                    <View style={styles.packageItemContent}>
                                        <Text style={styles.packageItemLabel}>Cân nặng</Text>
                                        <Text style={styles.packageItemValue}>2.5 kg</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.packageRow}>
                                <View style={styles.packageItem}>
                                    <MaterialIcons name="straighten" size={20} color="#666" />
                                    <View style={styles.packageItemContent}>
                                        <Text style={styles.packageItemLabel}>Kích thước</Text>
                                        <Text style={styles.packageItemValue}>30 x 20 x 15 cm</Text>
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
});

export default OrderDetails; 