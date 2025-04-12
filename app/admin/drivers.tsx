import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const COLOR = {
  containerBackground: "#f5f5f5",
  surface: "#ffffff",
  border: "#e0e0e0",
  textPrimary: "#212121",
  textSecondary: "#757575",
  primary: "#2089dc",
  success: "#4caf50",
  error: "#f44336",
  warning: "#ff9800",
  white: "#ffffff",
  grey50: "#9e9e9e",
  grey70: "#757575",
  cardBackground: "#ffffff"
};

interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalTrips: number;
  status: "active" | "inactive";
}

const DriverCard = ({ driver }: { driver: Driver }) => (
  <View style={styles.driverCard}>
    <View style={styles.driverInfo}>
      <View style={styles.avatarContainer}>
        <FontAwesome5 name="user-circle" size={50} color={COLOR.grey50} />
      </View>
      <View style={styles.details}>
        <Text style={styles.driverName}>{driver.name}</Text>
        <Text style={styles.driverPhone}>{driver.phone}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome5 name="star" size={16} color={COLOR.warning} solid />
          <Text style={styles.ratingText}>{driver.rating.toFixed(1)}</Text>
          <Text style={styles.tripsText}>({driver.totalTrips} chuyến)</Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                driver.status === "active" ? COLOR.success : COLOR.grey70,
            },
          ]}
        >
          <Text style={styles.statusText}>
            {driver.status === "active" ? "Hoạt động" : "Không hoạt động"}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

export default function DriversScreen() {
  // Dữ liệu mẫu - sẽ được thay thế bằng dữ liệu thực từ API
  const drivers: Driver[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      phone: "0123456789",
      rating: 4.8,
      totalTrips: 156,
      status: "active",
    },
    {
      id: "2",
      name: "Trần Văn B",
      phone: "0987654321",
      rating: 4.5,
      totalTrips: 98,
      status: "active",
    },
    {
      id: "3",
      name: "Lê Văn C",
      phone: "0369852147",
      rating: 4.2,
      totalTrips: 45,
      status: "inactive",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách tài xế</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{drivers.length}</Text>
            <Text style={styles.statLabel}>Tổng số</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {drivers.filter((d) => d.status === "active").length}
            </Text>
            <Text style={styles.statLabel}>Đang hoạt động</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={drivers}
        renderItem={({ item }) => <DriverCard driver={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.containerBackground,
  },
  header: {
    backgroundColor: COLOR.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLOR.textPrimary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLOR.containerBackground,
    borderRadius: 8,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLOR.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLOR.textSecondary,
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  driverCard: {
    backgroundColor: COLOR.cardBackground,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLOR.textPrimary,
  },
  driverPhone: {
    fontSize: 14,
    color: COLOR.textSecondary,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLOR.textPrimary,
    marginLeft: 8,
  },
  tripsText: {
    fontSize: 14,
    color: COLOR.textSecondary,
    marginLeft: 8,
  },
  statusContainer: {
    marginLeft: "auto",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: COLOR.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});