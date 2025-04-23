import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLOR from "../../../constants/Colors";

const SpecialDemand = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yêu cầu đặc biệt</Text>

      {/* Gói hỗ trợ chuyển nhà - Always visible */}
      <View style={styles.serviceItem}>
        <View style={styles.serviceInfo}>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceName}>Gói hỗ trợ chuyển nhà</Text>
            <Ionicons name="information-circle-outline" size={18} color="#ccc" style={styles.infoIcon} />
          </View>
          <Text style={styles.servicePrice}>300.000đ</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={22} color={COLOR.orange50} />
        </TouchableOpacity>
      </View>

      {/* Dịch vụ bốc xếp - Always visible */}
      <View style={styles.serviceItem}>
        <View style={styles.serviceInfo}>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceName}>Dịch vụ bốc xếp</Text>
            <Ionicons name="information-circle-outline" size={18} color="#ccc" style={styles.infoIcon} />
          </View>
          <Text style={styles.servicePrice}>0đ</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={22} color={COLOR.orange50} />
        </TouchableOpacity>
      </View>

      {/* Khai giá hàng hoá doanh nghiệp - Always visible */}
      <View style={styles.serviceItem}>
        <View style={styles.serviceInfo}>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceName}>Khai giá hàng hoá doanh nghiệp</Text>
            <Ionicons name="information-circle-outline" size={18} color="#ccc" style={styles.infoIcon} />
          </View>
          <Text style={styles.servicePrice}>0đ</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={22} color={COLOR.orange50} />
        </TouchableOpacity>
      </View>

      {/* Expandable content */}
      {expanded && (
        <>
          {/* Chứng từ điện tử */}
          <View style={styles.serviceItem}>
            <View style={styles.serviceInfo}>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>Chứng từ điện tử</Text>
                <Ionicons name="information-circle-outline" size={18} color="#ccc" style={styles.infoIcon} />
              </View>
              <Text style={styles.servicePrice}>5.000đ</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={22} color={COLOR.orange50} />
            </TouchableOpacity>
          </View>

          {/* Phí chờ */}
          <View style={styles.serviceItem}>
            <View style={styles.serviceInfo}>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>Phí chờ</Text>
                <Ionicons name="information-circle-outline" size={18} color="#ccc" style={styles.infoIcon} />
              </View>
              <Text style={styles.servicePrice}>60.000đ</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={22} color={COLOR.orange50} />
            </TouchableOpacity>
          </View>

          {/* Hỗ trợ tài xế */}
          <View style={styles.serviceItem}>
            <View style={styles.serviceInfo}>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>Hỗ trợ tài xế</Text>
                <Ionicons name="information-circle-outline" size={18} color="#ccc" style={styles.infoIcon} />
              </View>
              <Text style={styles.servicePrice}>10.000đ</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={22} color={COLOR.orange50} />
            </TouchableOpacity>
          </View>

          {/* Quay lại điểm lấy hàng */}
          <View style={styles.serviceItem}>
            <View style={styles.serviceInfo}>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>Quay lại điểm lấy hàng</Text>
                <Ionicons name="information-circle-outline" size={18} color="#ccc" style={styles.infoIcon} />
              </View>
              <Text style={styles.servicePrice}>65.000đ</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={22} color={COLOR.orange50} />
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Expand/Collapse button */}
      <TouchableOpacity style={styles.collapseButton} onPress={toggleExpand}>
        <Text style={styles.collapseText}>
          {expanded ? "Thu gọn" : "Xem thêm"}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#999"
        />
      </TouchableOpacity>

      <View style={styles.verificationRow}>
        <Ionicons name="checkmark-circle" size={20} color={COLOR.blue_theme} />
        <Text style={styles.verificationText}>
          Đơn đã được áp dụng Khai giá hàng hóa
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </View>
  );
};

export default SpecialDemand;

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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoIcon: {
    marginLeft: 6,
  },
  servicePrice: {
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR.orange50,
    justifyContent: "center",
    alignItems: "center",
  },
  collapseButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    marginVertical: 8,
  },
  collapseText: {
    fontSize: 16,
    color: "#666",
    marginRight: 4,
  },
  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 8,
  },
  verificationText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
});