import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLOR from "../../../../../constants/Colors";
import { useOrder } from "../../../../../contexts/order.context";
import { LocationPoint } from "@/types/Location";


const RouteOverview = () => {
  const { pickupLocation, setPickupLocation, dropoffLocation, setDropoffLocation } = useOrder();

  const handleSwapLocations = () => {
    const tempPickup = pickupLocation;
    setPickupLocation(dropoffLocation);
    setDropoffLocation(tempPickup);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lộ trình</Text>
        <TouchableOpacity style={styles.changeButton} onPress={handleSwapLocations}>
          <Ionicons name="swap-vertical" size={18} color={COLOR.blue_theme} />
          <Text style={styles.changeButtonText}>Hoán đổi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationItem}>
          <View style={styles.locationIcon}>
            <View style={styles.startPoint} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>{pickupLocation?.title}</Text>
            <Text style={styles.locationAddress}>{pickupLocation?.address}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>

        <View style={styles.separator} />

        <View style={styles.locationItem}>
          <View style={styles.locationIcon}>
            <View style={styles.endPoint} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>{dropoffLocation?.title}</Text>
            <Text style={styles.locationAddress}>{dropoffLocation?.address}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
      </View>
    </View>
  );
};

export default RouteOverview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeButtonText: {
    color: COLOR.blue_theme,
    marginLeft: 4,
    fontWeight: "500",
  },
  locationContainer: {
    backgroundColor: "#fff",
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  locationIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  startPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLOR.red55,
  },
  endPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLOR.blue40,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: COLOR.grey50,
  },
  separator: {
    height: 20,
    width: 1,
    backgroundColor: "#ddd",
    marginLeft: 12,
    marginVertical: 4,
  },
});