import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { DELIVERY_STATES, DriverInfo } from '@/types';
import COLOR from '@/constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Fixed panel height
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.45;

interface OnDeliveryProps {
    ON_DELIVERY_STATE: string;
    orderId?: string;
    driverInfo?: DriverInfo;
    onDeliveryDetail?: () => void;
    onChat?: () => void;
}

const OnDeliveryPanel: React.FC<OnDeliveryProps> = ({ ON_DELIVERY_STATE, onDeliveryDetail, orderId, driverInfo, onChat }) => {

    const handleCallDriver = () => {
        const phoneNumber = driverInfo?.phoneNumber;
        if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`);
        }
    };

    const getText = () => {
        switch (ON_DELIVERY_STATE) {
            case DELIVERY_STATES.MOVING_TO_PICKUP:
                return 'Đang đến điểm lấy hàng';
            case DELIVERY_STATES.GOING_TO_PICKUP:
                return 'Đã đến điểm lấy hàng';
            case DELIVERY_STATES.PICKING_UP:
                return 'Đã lấy hàng';
            case DELIVERY_STATES.GOING_TO_DROPOFF:
                return 'Đang đến điểm trả hàng';
            case DELIVERY_STATES.DELIVERING:
                return 'Đã trả hàng';
            default:
                return '';
        }
    };

    return (
        <View>
            {/* Order Summary - Clickable to go to details */}
            <TouchableOpacity
                style={styles.orderSummary}
                onPress={onDeliveryDetail}
            >
                <View style={styles.orderHeader}>
                    <View style={styles.orderStatus}>
                        <View style={styles.statusIndicator}>
                            <FontAwesome5 name="truck" size={24} color={COLOR.orange50} />
                        </View>
                        <View>
                            <Text style={styles.statusText}>{getText()}</Text>
                            <Text style={styles.orderId}>Mã đơn: {orderId}</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </View>
            </TouchableOpacity>

            {/* Driver Information */}
            <View style={styles.driverSection}>
                <Text style={styles.sectionTitle}>Thông tin tài xế</Text>
                <ScrollView style={{ maxHeight: 120 }}>
                    <View style={styles.driverInfo}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <FontAwesome5 name="user" size={20} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Tài xế</Text>
                                <Text style={styles.infoValue}>{driverInfo?.fullName}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Ionicons name="call-outline" size={20} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Liên hệ</Text>
                                <Text style={styles.infoValue}>{driverInfo?.phoneNumber}</Text>
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Ionicons name="call-outline" size={20} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Liên hệ</Text>
                                <Text style={styles.infoValue}>{driverInfo?.vehiclePlate}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>

            {/* Fixed Footer with Action Buttons */}
            <View style={styles.panelFooter}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCallDriver}>
                    <Ionicons name="call" size={24} color={COLOR.orange50} />
                    <Text style={styles.actionText}>Gọi tài xế</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={onChat}>
                    <Ionicons name="chatbubble-ellipses" size={24} color={COLOR.orange50} />
                    <Text style={styles.actionText}>Nhắn tin</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default OnDeliveryPanel;

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
    },
    orderSummary: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        marginRight: 12,
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    orderId: {
        fontSize: 14,
        color: '#666',
    },
    driverSection: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    driverInfo: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    panelFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
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
    zoomButton: {
        position: 'absolute',
        top: 20,
        right: 20,
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
    motorcycleMarker: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLOR.orange50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});