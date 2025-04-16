import React from "react";
import { View, Text, StyleSheet, ScrollView, ViewStyle, Platform, StatusBar } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

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
  // Dữ liệu mẫu - sẽ được thay thế bằng dữ liệu thực từ API
  const statistics = [
    {
      title: "Doanh thu",
      value: "120.5M VND",
      icon: "money-bill-wave",
      color: "#00BFA5",
    },
    {
      title: "Đơn đã đặt",
      value: "256",
      icon: "shopping-cart",
      color: "#00BFA5",
    },
    {
      title: "Đơn đã giao",
      value: "198",
      icon: "check-circle",
      color: "#00BFA5",
    },
    {
      title: "Đơn bị hủy",
      value: "12",
      icon: "times-circle",
      color: "#FF6B6B",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thống kê tổng quan</Text>
      </View>

      <View style={styles.statisticsContainer}>
        <View style={styles.statisticsRow}>
          <StatisticCard {...statistics[0]} style={styles.statisticCard} />
          <StatisticCard {...statistics[1]} style={styles.statisticCard} />
        </View>
        <View style={styles.statisticsRow}>
          <StatisticCard {...statistics[2]} style={styles.statisticCard} />
          <StatisticCard {...statistics[3]} style={styles.statisticCard} />
        </View>
      </View>

      {/* Phần này sẽ thêm biểu đồ thống kê sau */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Biểu đồ doanh thu</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>Đang phát triển...</Text>
        </View>
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