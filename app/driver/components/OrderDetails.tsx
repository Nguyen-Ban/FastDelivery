import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface OrderDetailsProps {
    visible: boolean;
    onClose: () => void;
    onAccept: () => void;
}

const OrderDetails = ({ visible, onClose, onAccept }: OrderDetailsProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.serviceInfo}>
                            {/* <Image
                                source={require('../../../assets/bike-icon.png')}
                                style={styles.bikeIcon}
                            /> */}
                            <Text style={styles.serviceName}>Xanh SM Bike</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
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
                        <View style={styles.locationPoint}>
                            <View style={[styles.locationDot, styles.startDot]} />
                            <View style={styles.locationText}>
                                <Text style={styles.locationName}>Eddie's New York Deli & Diner</Text>
                                <Text style={styles.locationAddress}>73 Đường Pasteur, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, 70000, VNM</Text>
                            </View>
                        </View>
                        <View style={styles.locationLine} />
                        <View style={styles.locationPoint}>
                            <View style={[styles.locationDot, styles.endDot]} />
                            <View style={styles.locationText}>
                                <Text style={styles.locationName}>Chung Cư Khánh Hội 3</Text>
                                <Text style={styles.locationAddress}>360G Đường Bến Vân Đồn, Phường 1, Quận 4, Hồ Chí Minh, Việt Nam</Text>
                            </View>
                        </View>
                    </View>

                    {/* Accept Button */}
                    <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
                        <Text style={styles.acceptButtonText}>Nhận chuyến</Text>
                        <View style={styles.timeContainer}>
                            <Text style={styles.timeText}>25</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: '70%',
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
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    locationDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
        marginTop: 4,
    },
    startDot: {
        backgroundColor: '#000',
    },
    endDot: {
        backgroundColor: '#FF9500',
    },
    locationLine: {
        width: 2,
        height: 30,
        backgroundColor: '#DDD',
        marginLeft: 5,
        marginBottom: 15,
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
    acceptButton: {
        backgroundColor: '#00BFA5',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 25,
        marginTop: 'auto',
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