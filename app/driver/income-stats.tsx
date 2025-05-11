import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

const weekTabs = [
    '11 - 17',
    '18 - 24',
    '25 - 31',
    '01 - 05',
];

const dailyStats = [
    {
        date: 'Thứ hai, 01/04/2024',
        trips: 7,
        duration: '4 giờ 7 phút',
        amount: '188.337đ',
    },
    {
        date: 'Thứ ba, 02/04/2024',
        trips: 2,
        duration: '1 giờ 13 phút',
        amount: '48.910đ',
    },
    {
        date: 'Thứ tư, 03/04/2024',
        trips: 3,
        duration: '2 giờ 54 phút',
        amount: '108.768đ',
    },
    {
        date: 'Thứ năm, 04/04/2024',
        trips: 4,
        duration: '2 giờ 5 phút',
        amount: '102.199đ',
    },
];

const IncomeStats = () => {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBox}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerTitleBox}>
                    <Text style={styles.headerTitle}>Thống kê thu nhập</Text>
                </View>
                {/* View giả để cân đối với icon back */}
                <View style={styles.headerIconBox} />
            </View>

            {/* Tabs */}
            <ScrollView horizontal contentContainerStyle={styles.tabs}>
                {weekTabs.map((week, index) => (
                    <TouchableOpacity key={index} style={[styles.tab, index === 3 && styles.activeTab]}>
                        <Text style={[styles.tabText, index === 3 && styles.activeTabText]}>
                            {index < 3 ? `Tháng 3\n${week}` : `Tháng 4\n${week}`}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Summary */}
            <View style={styles.summary}>
                <View>
                    <Text style={styles.summaryLabel}>Thu nhập ròng</Text>
                    <Text style={styles.summaryValue}>448.214đ</Text>
                </View>
                <View>
                    <Text style={styles.summaryLabel}>Số giờ online</Text>
                    <Text style={styles.summaryValue}>10 giờ 21 phút</Text>
                </View>
            </View>

            <ScrollView style={styles.dailyStats}>
                <Text style={styles.tripHeader}>16 CHUYẾN</Text>

                {dailyStats.map((item, index) => (
                    <View key={index} style={styles.dailyItem}>
                        <View>
                            <Text style={styles.dateText}>{item.date}</Text>
                            <Text style={styles.tripInfo}>
                                {item.trips} Chuyến | {item.duration}
                            </Text>
                        </View>
                        <Text style={styles.amount}>{item.amount}</Text>
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 30, // Giảm chiều cao header
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        position: 'relative',
    },
    headerIconBox: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none', // để không chặn sự kiện của icon back
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fafafa',
    },
    tab: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 8,
    },
    tabText: {
        fontSize: 12,
        textAlign: 'center',
        color: '#444',
    },
    activeTab: {
        backgroundColor: '#00B2FF',
        borderColor: '#00B2FF',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#f2f2f2',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dailyStats: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    tripHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dailyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dateText: {
        fontSize: 15,
        fontWeight: '500',
    },
    tripInfo: {
        fontSize: 13,
        color: '#777',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default IncomeStats;
