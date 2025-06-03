import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLOR from "../../../../../constants/Colors";
import { useOrder } from "../../../../../contexts/order.context";
import { OrderSpecialDemand } from "@/types";



interface ServiceItem {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  alwaysVisible: boolean;
}

const vanServices: ServiceItem[] = [
  {
    id: "homeMoving",
    name: "Gói hỗ trợ chuyển nhà",
    price: "300.000đ",
    priceValue: 300000,
    alwaysVisible: true
  },
  {
    id: "loading",
    name: "Dịch vụ bốc xếp",
    price: "100.000đ",
    priceValue: 100000,
    alwaysVisible: true
  },
  {
    id: "businessValue",
    name: "Khai giá hàng hoá doanh nghiệp",
    price: "0đ",
    priceValue: 0,
    alwaysVisible: true
  },
  {
    id: "eDocument",
    name: "Chứng từ điện tử",
    price: "5.000đ",
    priceValue: 5000,
    alwaysVisible: false
  },
  {
    id: "waiting",
    name: "Phí chờ",
    price: "60.000đ",
    priceValue: 60000,
    alwaysVisible: false
  },
  {
    id: "donateDriver",
    name: "Hỗ trợ tài xế",
    price: "10.000đ",
    priceValue: 10000,
    alwaysVisible: false
  }
];

const motorbikeServices: ServiceItem[] = [
  {
    id: "handDelivery",
    name: "Giao hàng tận tay",
    price: "10.000đ",
    priceValue: 10000,
    alwaysVisible: true
  },
  {
    id: "fragileDelivery",
    name: "Giao hàng dễ vỡ",
    price: "10.000đ",
    priceValue: 10000,
    alwaysVisible: true
  },
  {
    id: "donateDriver",
    name: "Hỗ trợ tài xế",
    price: "5.000đ",
    priceValue: 5000,
    alwaysVisible: true
  }
];

interface SpecialDemandState {
  selectedDemands: string[];
  addonPrice: number;
}

const DEFAULT_STATE: SpecialDemandState = {
  selectedDemands: [],
  addonPrice: 0
};

const SpecialDemand = () => {
  const [expanded, setExpanded] = useState(false);
  const { specialDemands, setSpecialDemands, setAddonPrice, vehicleType } = useOrder();
  const [state, setState] = useState<SpecialDemandState>(DEFAULT_STATE);

  const isMotorbike = vehicleType === 'MOTORBIKE';
  const services = isMotorbike ? motorbikeServices : vanServices;
  const visibleServices = services.filter(service => service.alwaysVisible);
  const expandableServices = services.filter(service => !service.alwaysVisible);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const calculateTotalPrice = (selectedIds: string[]): number => {
    return services
      .filter(service => selectedIds.includes(service.id))
      .reduce((total, service) => total + service.priceValue, 0);
  };

  const toggleService = (serviceId: string) => {
    const newSelectedDemands = state.selectedDemands.includes(serviceId)
      ? state.selectedDemands.filter(id => id !== serviceId)
      : [...state.selectedDemands, serviceId];

    const newTotalPrice = calculateTotalPrice(newSelectedDemands);

    setState({
      selectedDemands: newSelectedDemands,
      addonPrice: newTotalPrice
    });

    setSpecialDemands(mapSelectedDemandsToSpecialDemands(state.selectedDemands));
    setAddonPrice(newTotalPrice);
  };

  const mapSelectedDemandsToSpecialDemands = (selectedDemands: string[]): OrderSpecialDemand => {
    const specialDemands: OrderSpecialDemand = {};

    selectedDemands.forEach(id => {
      switch (id) {
        case "handDelivery":
          specialDemands.handDelivery = true;
          break;
        case "fragileDelivery":
          specialDemands.fragileDelivery = true;
          break;
        case "donateDriver":
          // Nếu donateDriver là số (ví dụ tiền hỗ trợ), bạn có thể set mặc định hoặc lấy giá từ đâu đó
          specialDemands.donateDriver = 10000; // ví dụ
          break;
        case "homeMoving":
          specialDemands.homeMoving = true;
          break;
        case "loading":
          specialDemands.loading = true;
          break;
        case "businessValue":
          specialDemands.businessValue = 0; // hoặc giá phù hợp
          break;
        case "eDocument":
          specialDemands.eDocument = true;
          break;
        case "waiting":
          specialDemands.waiting = true;
          break;
      }
    });

    return specialDemands;
  };

  const renderService = (service: ServiceItem) => (
    <View key={service.id} style={styles.serviceItem}>
      <View style={styles.serviceInfo}>
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Ionicons name="information-circle-outline" size={18} color="#ccc" style={styles.infoIcon} />
        </View>
        <Text style={styles.servicePrice}>{service.price}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.addButton,
          state.selectedDemands.includes(service.id) && styles.selectedButton
        ]}
        onPress={() => toggleService(service.id)}
      >
        <Ionicons
          name={state.selectedDemands.includes(service.id) ? "checkmark" : "add"}
          size={22}
          color={state.selectedDemands.includes(service.id) ? "#fff" : COLOR.orange50}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yêu cầu đặc biệt</Text>

      {/* Always visible services */}
      {visibleServices.map(renderService)}

      {/* Expandable services for motorbike type */}
      {isMotorbike && expanded && expandableServices.map(renderService)}

      {/* Expand/Collapse button only for VAN type */}
      {!isMotorbike && expandableServices.length > 0 && (
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

      {state.selectedDemands.length > 0 && (
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceLabel}>Tổng phí dịch vụ:</Text>
          <Text style={styles.totalPriceValue}>
            {state.addonPrice.toLocaleString()}đ
          </Text>
        </View>
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
  selectedButton: {
    backgroundColor: COLOR.orange50,
    borderColor: COLOR.orange50,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 16,
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.orange50,
  },
});

export default SpecialDemand;