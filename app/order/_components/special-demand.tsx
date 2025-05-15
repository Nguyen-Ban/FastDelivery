import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLOR from "../../../constants/Colors";

interface SpecialDemandProps {
  type?: string;
}

const SpecialDemand: React.FC<SpecialDemandProps> = ({ type = 'VAN' }) => {
  const [expanded, setExpanded] = useState(false);
  const isVan = type === 'VAN';

  const vanServices = [
    {
      name: "Gói hỗ trợ chuyển nhà",
      price: "300.000đ",
      alwaysVisible: true
    },
    {
      name: "Dịch vụ bốc xếp",
      price: "0đ",
      alwaysVisible: true
    },
    {
      name: "Khai giá hàng hoá doanh nghiệp",
      price: "0đ",
      alwaysVisible: true
    },
    {
      name: "Chứng từ điện tử",
      price: "5.000đ",
      alwaysVisible: false
    },
    {
      name: "Phí chờ",
      price: "60.000đ",
      alwaysVisible: false
    },
    {
      name: "Hỗ trợ tài xế",
      price: "10.000đ",
      alwaysVisible: false
    },
    {
      name: "Quay lại điểm lấy hàng",
      price: "65.000đ",
      alwaysVisible: false
    }
  ];

  const motorbikeServices = [
    {
      name: "Giao hàng tận tay",
      price: "10.000đ",
      alwaysVisible: true
    },
    {
      name: "Quay lại điểm lấy hàng",
      price: "19.000đ",
      alwaysVisible: true
    },
    {
      name: "Túi giữ nhiệt",
      price: "0đ",
      alwaysVisible: true
    },
    {
      name: "Giao hàng dễ vỡ",
      price: "10.000đ",
      alwaysVisible: true
    },
    {
      name: "Gửi SMS cho người nhận",
      price: "1.000đ",
      alwaysVisible: true
    },
    {
      name: "Hỗ trợ tài xế",
      price: "5.000đ",
      alwaysVisible: true
    }
  ];

  const services = isVan ? vanServices : motorbikeServices;
  const visibleServices = services.filter(service => service.alwaysVisible);
  const expandableServices = services.filter(service => !service.alwaysVisible);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const renderService = (service: typeof services[0]) => (
    <View key={service.name} style={styles.serviceItem}>
      <View style={styles.serviceInfo}>
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Ionicons name="information-circle-outline" size={18} color="#ccc" style={styles.infoIcon} />
        </View>
        <Text style={styles.servicePrice}>{service.price}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={22} color={COLOR.orange50} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yêu cầu đặc biệt</Text>

      {/* Always visible services */}
      {visibleServices.map(renderService)}

      {/* Expandable services for VAN type */}
      {isVan && expanded && expandableServices.map(renderService)}

      {/* Expand/Collapse button only for VAN type */}
      {isVan && expandableServices.length > 0 && (
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
      )}

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