import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DriverMenu = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    {/* <Image
                        source={require('../../assets/images/default-avatar.png')}
                        style={styles.avatar}
                    /> */}
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>Tài xế</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.rating}>5.0</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuItems}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push("/driver/my-wallet")}
                    >
                        <Ionicons name="wallet-outline" size={24} color="#333" />
                        <Text style={styles.menuItemText}>Ví của tôi</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push("/driver/delivery-history")}
                    >
                        <MaterialIcons name="history" size={24} color="#333" />
                        <Text style={styles.menuItemText}>Lịch sử vận chuyển</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="stats-chart-outline" size={24} color="#333" />
                        <Text style={styles.menuItemText}>Thống kê</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="settings-outline" size={24} color="#333" />
                        <Text style={styles.menuItemText}>Cài đặt</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="help-circle-outline" size={24} color="#333" />
                        <Text style={styles.menuItemText}>Trợ giúp</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, styles.customerModeItem]}>
                        <MaterialIcons name="switch-account" size={24} color="#e74c3c" />
                        <Text style={[styles.menuItemText, styles.customerModeText]}>Chế độ khách hàng</Text>
                        <Ionicons name="chevron-forward" size={24} color="#e74c3c" />
                    </TouchableOpacity>
                </View>

                {/* Version Info */}
                <Text style={styles.version}>Phiên bản 1.0.0</Text>
            </ScrollView>
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
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 16,
        marginLeft: 5,
        color: '#333',
    },
    menuItems: {
        marginBottom: 30,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 15,
        color: '#333',
    },
    customerModeItem: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    customerModeText: {
        color: '#e74c3c',
        fontWeight: '500',
    },
    version: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
});

export default DriverMenu; 