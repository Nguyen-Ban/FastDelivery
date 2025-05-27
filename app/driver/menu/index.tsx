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
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DriverMenu = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBox}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tổng quan</Text>
                <View style={styles.headerIconBox} />
            </View>
            <ScrollView style={styles.content}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    {/* <Image
                        source={require('../../assets/images/default-avatar.png')}
                        style={styles.avatar}
                    /> */}
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>Tài xế #Tên tài xế#</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.rating}>5.0</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.push("/driver/menu/profile")}>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Menu Items */}
                <View style={styles.menuItems}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push("/driver/menu/my-wallet")}
                    >
                        <View style={styles.menuIconBox}>
                            <Ionicons name="wallet-outline" size={24} color="#333" />
                        </View>
                        <Text style={styles.menuItemText}>Ví của tôi</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push("/driver/menu/delivery-history")}
                    >
                        <View style={styles.menuIconBox}>
                            <MaterialIcons name="history" size={24} color="#333" />
                        </View>
                        <Text style={styles.menuItemText}>Lịch sử vận chuyển</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push("/driver/menu/income-stats")}
                    >
                        <View style={styles.menuIconBox}>
                            <Ionicons name="stats-chart-outline" size={24} color="#333" />
                        </View>
                        <Text style={styles.menuItemText}>Thống kê</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push("/driver/menu/notifications")}
                    >
                        <View style={styles.menuIconBox}>
                            <FontAwesome5 name="bell" size={24} color="#333" />
                        </View>
                        <Text style={styles.menuItemText}>Thông báo</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="settings-outline" size={24} color="#333" />
                        </View>
                        <Text style={styles.menuItemText}>Cài đặt</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="help-circle-outline" size={24} color="#333" />
                        </View>
                        <Text style={styles.menuItemText}>Trợ giúp</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, styles.customerModeItem]}>
                        <View style={styles.menuIconBox}>
                            <MaterialIcons name="switch-account" size={24} color="#e74c3c" />
                        </View>
                        <Text style={[styles.menuItemText, styles.customerModeText]}>Chế độ khách hàng</Text>
                        <Ionicons name="chevron-forward" size={24} color="#e74c3c" />
                    </TouchableOpacity>
                </View>


            </ScrollView>
            <View style={styles.versionBox}>
                <Text style={styles.version}>Phiên bản 1.0.0</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
    },
    headerIconBox: {
        width: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#222",
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
        padding: 20,
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
    menuIconBox: {
        width: 32, // hoặc 36, miễn là lớn hơn icon lớn nhất
        alignItems: 'center',
        justifyContent: 'center',
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
    versionBox: {
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    version: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
});

export default DriverMenu; 