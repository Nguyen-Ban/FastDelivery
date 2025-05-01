import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLOR from "../../../constants/Colors";

const RouteOverview = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lộ trình 2,98km</Text>
        <TouchableOpacity style={styles.changeButton}>
          <Ionicons name="swap-vertical" size={18} color={COLOR.blue_theme} />
          <Text style={styles.changeButtonText}>Hoán đổi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationItem}>
          <View style={styles.locationIcon}>
            <View style={styles.startPoint} />
          </View>
          <Text style={styles.locationText}>Detech Building</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>

        <View style={styles.separator} />

        <View style={styles.locationItem}>
          <View style={styles.locationIcon}>
            <View style={styles.endPoint} />
          </View>
          <Text style={styles.locationText}>Trường Đại Học Điện Lực</Text>
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
    alignItems: "center",
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
    backgroundColor: "#000",
  },
  endPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLOR.orange50,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 20,
    width: 1,
    backgroundColor: "#ddd",
    marginLeft: 12,
    marginVertical: 4,
  },
});