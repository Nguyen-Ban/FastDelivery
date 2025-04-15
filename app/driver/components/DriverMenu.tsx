import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

interface DriverMenuProps {
    onClose: () => void;
    driverName?: string;
    rating?: number;
}

const DriverMenu = ({ onClose, driverName = "Tài xế", rating = 5.0 }: DriverMenuProps) => {
    const menuItems = [
        {
            title: 'Chương trình thưởng',
            icon: <FontAwesome5 name="gift" size={20} color="#666" />,
        },
        {
            title: 'Ví tài xế',
            icon: <MaterialIcons name="account-balance-wallet" size={20} color="#666" />,
        },
        {
            title: 'Thống kê thu nhập',
            icon: <MaterialIcons name="bar-chart" size={20} color="#666" />,
        },
        {
            title: 'Lịch sử chuyến đi',
            icon: <MaterialIcons name="history" size={20} color="#666" />,
        },
        {
            title: 'Báo cáo',
            icon: <MaterialIcons name="description" size={20} color="#666" />,
        },
        {
            title: 'Thông báo',
            icon: <Ionicons name="notifications-outline" size={20} color="#666" />,
        },
        {
            title: 'Bảo hiểm PVI',
            icon: <MaterialIcons name="security" size={20} color="#666" />,
        },
    ];

    const stats = [
        { label: 'Nhận đơn', value: '100%' },
        { label: 'Huỷ đơn', value: '0%' },
        { label: 'Hoàn thành', value: '100%' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.profileSection}>
                        {/* <Image
                            source={require('../../../assets/default-avatar.png')}
                            style={styles.avatar}
                        /> */}
                        <View style={styles.profileInfo}>
                            <Text style={styles.name}>{driverName}</Text>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.rating}>{rating.toFixed(1)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statItem}>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <View style={styles.menuIcon}>{item.icon}</View>
                            <Text style={styles.menuText}>{item.title}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Version Info */}
                <Text style={styles.version}>Phiên bản 1.20.1 (78)</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    rating: {
        marginLeft: 5,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        backgroundColor: '#f8f8f8',
        marginBottom: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuIcon: {
        width: 30,
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    version: {
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        marginVertical: 20,
    },
});

export default DriverMenu; 