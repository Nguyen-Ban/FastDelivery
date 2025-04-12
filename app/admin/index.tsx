import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface StatisticCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const StatisticCard = ({ title, value, icon, color }: StatisticCardProps) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
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
      color: COLOR.green,
    },
    {
      title: "Đơn đã đặt",
      value: "256",
      icon: "shopping-cart",
      color: COLOR.blue_theme,
    },
    {
      title: "Đơn đã giao",
      value: "198",
      icon: "check-circle",
      color: COLOR.success,
    },
    {
      title: "Đơn bị hủy",
      value: "12",
      icon: "times-circle",
      color: COLOR.error,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thống kê tổng quan</Text>
        <Text style={styles.subtitle}>Hôm nay</Text>
      </View>

      <View style={styles.statisticsContainer}>
        {statistics.map((stat, index) => (
          <StatisticCard key={index} {...stat} />
        ))}
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

// Custom COLOR object defined directly in this file
const COLOR = {
  primary: "#FF6B00",
  secondary: "#FFA559",
  white: "#FFFFFF",
  black: "#000000",
  grey10: "#1A1A1A",
  grey30: "#4D4D4D",
  grey50: "#808080",
  grey95: "#F2F2F2",
  blue_theme: "#3498DB",
  green: "#2ECC71",
  success: "#27AE60",
  error: "#E74C3C",
  warning: "#F39C12",
  info: "#3498DB",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.grey95,
  },
  header: {
    padding: 16,
    backgroundColor: COLOR.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLOR.grey10,
  },
  subtitle: {
    fontSize: 14,
    color: COLOR.grey50,
    marginTop: 4,
  },
  statisticsContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    color: COLOR.grey30,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  chartContainer: {
    backgroundColor: COLOR.white,
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLOR.grey10,
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: COLOR.grey95,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: COLOR.grey50,
    fontSize: 16,
  },
});