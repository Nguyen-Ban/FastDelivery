import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import orderService from '@/services/order.service';

interface DriverStats {
    totalEarnings: number;
    totalOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    labels: Array<{
        month: string;
        year: number;
    }>;
    monthlyEarnings: number[];
    totalMonthlyEarnings: number;
}

const IncomeStats = () => {
    const router = useRouter();
    const [stats, setStats] = useState<DriverStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await orderService.fetchDriverStats();
            if (res.success) {
                setStats(res.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const chartData = {
        labels: stats?.labels.map(label => label.month) || [],
        datasets: [
            {
                data: stats?.monthlyEarnings || [],
            },
        ],
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBox}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerTitleBox}>
                    <Text style={styles.headerTitle}>Thống kê thu nhập</Text>
                </View>
                <View style={styles.headerIconBox} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text>Đang tải...</Text>
                </View>
            ) : stats ? (
                <ScrollView style={styles.content}>

                    {/* Monthly Stats */}
                    <View style={styles.monthlyStats}>
                        <Text style={styles.monthlyStatsTitle}>Thu nhập tháng này</Text>
                        <Text style={styles.monthlyStatsValue}>{stats.totalMonthlyEarnings.toLocaleString()}đ</Text>
                    </View>
                    {/* Summary Stats */}
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Tổng thu nhập</Text>
                            <Text style={styles.summaryValue}>{stats.totalEarnings.toLocaleString()}đ</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Tổng đơn hàng</Text>
                            <Text style={styles.summaryValue}>{stats.totalOrders}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Đơn đã giao</Text>
                            <Text style={styles.summaryValue}>{stats.deliveredOrders}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Đơn đã hủy</Text>
                            <Text style={styles.summaryValue}>{stats.cancelledOrders}</Text>
                        </View>
                    </View>

                    {/* Monthly Chart */}
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Thu nhập 6 tháng gần nhất</Text>
                        <BarChart
                            data={chartData}
                            width={Dimensions.get('window').width - 40}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix="đ"
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 178, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                barPercentage: 0.5,
                                formatYLabel: (value: string) => Number(value).toLocaleString(),
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                    </View>

                </ScrollView>
            ) : (
                <View style={styles.errorContainer}>
                    <Text>Không thể tải dữ liệu</Text>
                </View>
            )}
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
        paddingVertical: 30,
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
        pointerEvents: 'none',
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
    summaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    summaryItem: {
        width: '50%',
        padding: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    chartContainer: {
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    monthlyStats: {
        padding: 16,
        backgroundColor: '#f8f8f8',
        marginTop: 16,
        alignItems: 'center',
    },
    monthlyStatsTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    monthlyStatsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00B2FF',
    },
});

export default IncomeStats;
