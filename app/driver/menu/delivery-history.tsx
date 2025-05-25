import React from 'react';
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

const DeliveryHistory = () => {
    const router = useRouter();

    const deliveries = [
        {
            date: '04/04/2024',
            items: [
                {
                    amount: '56.000đ',
                    time: '15:13',
                    vehicleType: 'Xanh SM Bike',
                    packageType: 'Bưu kiện nhỏ',
                    pickup: '300/23/21 Nguyễn Văn Linh P.Bình Thuận',
                    dropoff: 'Morin Milk Tea - Coffee 64/20 Võ Oanh',
                    status: 'Hoàn thành',
                },
                {
                    amount: '20.000đ',
                    time: '14:38',
                    vehicleType: 'Xanh SM Bike',
                    packageType: 'Bưu kiện nhỏ',
                    pickup: "Eddie's New York Deli & Diner",
                    dropoff: 'Chung Cư Khánh Hội 3',
                    status: 'Hoàn thành',
                },
                {
                    amount: '48.000đ',
                    time: '14:02',
                    vehicleType: 'Xanh SM Bike',
                    packageType: 'Bưu kiện vừa',
                    pickup: '6 Tân Trào 6 Tan Trao St.',
                    dropoff: '140 Nguyễn Văn Thủ P.Da Kao',
                    status: 'Hoàn thành',
                },
                {
                    amount: '20.000đ',
                    time: '13:44',
                    vehicleType: 'Xanh SM Bike',
                    packageType: 'Bưu kiện nhỏ',
                    pickup: 'Q7 Saigon Riverside Complex - Cổng Chính D...',
                    dropoff: 'GO! Nguyễn Thị Thập - Cổng Phụ 99 Nguyen...',
                    status: 'Hoàn thành',
                }
            ]
        },
        {
            date: '03/04/2024',
            items: [
                {
                    amount: '35.000đ',
                    time: '15:30',
                    vehicleType: 'Xanh SM Bike',
                    packageType: 'Bưu kiện nhỏ',
                    pickup: 'Sample Address',
                    dropoff: 'Sample Destination',
                    status: 'Hoàn thành',
                }
            ]
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử chuyến đi</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
                <TouchableOpacity style={[styles.filterTab, styles.activeTab]}>
                    <Text style={[styles.filterText, styles.activeFilterText]}>Hoàn thành</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterTab}>
                    <Text style={styles.filterText}>Hủy</Text>
                </TouchableOpacity>
            </View>

            {/* Delivery List */}
            <ScrollView style={styles.deliveryList}>
                {deliveries.map((dateGroup, dateIndex) => (
                    <View key={dateIndex}>
                        <Text style={styles.dateHeader}>{dateGroup.date}</Text>
                        {dateGroup.items.map((delivery, index) => (
                            <View key={index} style={styles.deliveryItem}>
                                <View style={styles.deliveryHeader}>
                                    <View>
                                        <View style={styles.vehicleInfo}>
                                            <Ionicons name="bicycle" size={20} color="#00BFA5" />
                                            <Text style={styles.amount}>{delivery.amount}</Text>
                                        </View>
                                        <View style={styles.timeVehicleInfo}>
                                            <Text style={styles.time}>{delivery.time}</Text>
                                            <Text style={styles.separator}>|</Text>
                                            <Text style={styles.vehicleType}>{delivery.vehicleType}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.statusButton}>
                                        <Text style={styles.statusText}>{delivery.status}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.addressContainer}>
                                    <View style={styles.packageTypeRow}>
                                        <Ionicons name="cube-outline" size={16} color="#666" />
                                        <Text style={styles.packageType}>{delivery.packageType}</Text>
                                    </View>
                                    <View style={styles.addressRow}>
                                        <View style={styles.dotBlack} />
                                        <Text style={styles.address} numberOfLines={1}>{delivery.pickup}</Text>
                                    </View>
                                    <View style={styles.addressRow}>
                                        <View style={styles.dotOrange} />
                                        <Text style={styles.address} numberOfLines={1}>{delivery.dropoff}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
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
    filterTabs: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    filterTab: {
        marginRight: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    activeTab: {
        backgroundColor: '#e6f7f5',
    },
    filterText: {
        color: '#666',
    },
    activeFilterText: {
        color: '#00BFA5',
        fontWeight: '500',
    },
    deliveryList: {
        flex: 1,
    },
    dateHeader: {
        padding: 16,
        fontSize: 16,
        fontWeight: '500',
        backgroundColor: '#f9f9f9',
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
    timeVehicleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: 12,
        color: '#666',
    },
    separator: {
        fontSize: 12,
        color: '#666',
        marginHorizontal: 4,
    },
    vehicleType: {
        fontSize: 12,
        color: '#00BFA5',
    },
    statusButton: {
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
});

export default DeliveryHistory; 