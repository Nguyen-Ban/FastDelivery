import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ViewStyle, Platform, StatusBar, Dimensions, LogBox } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import orderService from "@/services/order.service";
import { LineChart } from "react-native-chart-kit";

// Ignore specific warning from react-native-chart-kit
LogBox.ignoreLogs(['Text strings must be rendered within a <Text> component']);

interface StatisticCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  style?: ViewStyle;
}

const StatisticCard = ({ title, value, icon, color, style }: StatisticCardProps) => (
  <View style={[styles.card, style]}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <FontAwesome5 name={icon} size={24} color={color} />
    </View>
    <Text style={[styles.cardValue, { color }]}>{value}</Text>
  </View>
);

export default function AdminDashboard() {
  const screenWidth = Dimensions.get("window").width;
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 191, 165, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
    barPercentage: 0.9,
    propsForHorizontalLabels: {
      dx: 0,
      dy: 20,
      fontSize: 11,
      translateX: -15,
    },
    horizontalLabelRotation: -45,
    horizontalOffset: 30,
    spacing: 0.5,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
      paddingRight: 20,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: "500",
    },
    propsForBackgroundLines: {
      stroke: "#E7E7E7",
      strokeWidth: 1,
    },
    formatYLabel: (value: string) => {
      const num = parseInt(value);
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toString();
    },
    formatXLabel: (value: string) => value,
  };
  const [chartData, setChartData] = useState({
    labels: [],
    monthlyRevenue: [],
  });
  const [statistics, setStatistics] = useState([
    {
      title: "Doanh thu",
      value: "...",
      icon: "money-bill-wave",
      color: "#00BFA5",
    },
    {
      title: "Đơn đã đặt",
      value: "...",
      icon: "shopping-cart",
      color: "#00BFA5",
    },
    {
      title: "Đơn đã giao",
      value: "...",
      icon: "check-circle",
      color: "#00BFA5",
    },
    // {
    //   title: "Đơn bị hủy",
    //   value: "...",
    //   icon: "times-circle",
    //   color: "#FF6B6B",
    // },
  ]);

  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API
    const fetchData = async () => {
      const res = await orderService.fetchAdminStats();
      if (res.success && res.data) {
        const data = res.data;
        setStatistics([
          {
            ...statistics[0],
            value: `${data.revenue.toLocaleString()} VND`
          },
          {
            ...statistics[1],
            value: data.totalOrders.toString()
          },
          {
            ...statistics[2],
            value: data.deliveredOrders.toString()
          },
          // {
          //   ...statistics[3],
          //   value: data.cancelledOrders.toString()
          // }
        ]);
        setChartData({
          labels: data.labels.map((label: { month: string; year: string }) => `${label.month}/${label.year}`),
          monthlyRevenue: data.monthlyRevenue
        });
      } else {
        console.error("Failed to fetch statistics:", res.message);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thống kê tổng quan</Text>
      </View>

      <View style={styles.statisticsContainer}>
        <View style={styles.statisticsRow}>
          <StatisticCard {...statistics[2]} style={styles.statisticCard} />

          <StatisticCard {...statistics[1]} style={styles.statisticCard} />
        </View>
        <View style={styles.statisticsRow}>
          <StatisticCard {...statistics[0]} style={styles.statisticCard} />

          {/* <StatisticCard {...statistics[3]} style={styles.statisticCard} /> */}
        </View>
      </View>      {/* Phần này sẽ thêm biểu đồ thống kê sau */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Doanh thu 6 tháng gần nhất</Text>
        {chartData.labels.length > 0 ? (
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  data: chartData.monthlyRevenue,
                  color: (opacity = 1) => `rgba(0, 191, 165, ${opacity})`,
                  strokeWidth: 2
                }
              ]
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginLeft: -25
            }}
            withDots={true}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            fromZero={true}
          />
        ) : (
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>Đang tải dữ liệu...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  statisticsContainer: {
    padding: 16,
  },
  statisticsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statisticCard: {
    flex: 1,
    marginHorizontal: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#666666",
    fontSize: 14,
  },
});