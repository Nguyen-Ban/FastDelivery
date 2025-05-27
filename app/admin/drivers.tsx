import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Platform, StatusBar } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { DRIVER_STATUS, DriverAdminInfo } from "@/types";
import driverService from "@/services/driver.service";

const DriverCard = ({ driver }: { driver: DriverAdminInfo }) => (
  <View style={styles.driverCard}>
    <View style={styles.driverInfo}>
      <View style={styles.avatarContainer}>
        <FontAwesome5 name="user-circle" size={50} color="#9e9e9e" />
      </View>
      <View style={styles.details}>
        <Text style={styles.driverName}>{driver.fullName}</Text>
        <Text style={styles.driverPhone}>{driver.phoneNumber}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome5 name="star" size={16} color="#ffc107" solid />
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
                driver.status === DRIVER_STATUS.AVAILABLE ? "#00BFA5" : "#757575",
            },
          ]}
        >
          <Text style={styles.statusText}>
            {driver.status === DRIVER_STATUS.AVAILABLE ? "Hoạt động" : "Không hoạt động"}
          </Text>
        </View>
      </View>
    </View>
  </View>
);



export default function DriversScreen() {
  const [drivers, setDrivers] = useState<DriverAdminInfo[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const res = await driverService.fetchAllDrivers();
      if (res.success && res.data) {
        setDrivers(res.data);
      };
    }
    fetchDrivers();

  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách tài xế</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{drivers.length}</Text>
            <Text style={styles.statLabel}>Tổng số</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {drivers.filter((d) => d.status === DRIVER_STATUS.AVAILABLE).length}
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
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00BFA5",
  },
  statLabel: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  driverCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  driverPhone: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginLeft: 8,
  },
  tripsText: {
    fontSize: 14,
    color: "#666666",
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
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
});