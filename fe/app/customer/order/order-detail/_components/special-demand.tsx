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
  donateAmount: number;
}

const DEFAULT_STATE: SpecialDemandState = {
  selectedDemands: [],
  addonPrice: 0,
  donateAmount: 0
};

const SpecialDemand = () => {
  const [expanded, setExpanded] = useState(false);
  const { specialDemands, setSpecialDemands, addonPrice, setAddonPrice, vehicleType } = useOrder();
  const [state, setState] = useState<SpecialDemandState>(() => {
    const selectedDemands: string[] = [];
    let donateAmount = 0;

    // Map specialDemands back to selectedDemands array
    if (specialDemands?.handDelivery) selectedDemands.push("handDelivery");
    if (specialDemands?.fragileDelivery) selectedDemands.push("fragileDelivery");
    if (specialDemands?.homeMoving) selectedDemands.push("homeMoving");
    if (specialDemands?.loading) selectedDemands.push("loading");
    if (specialDemands?.eDocument) selectedDemands.push("eDocument");
    if (specialDemands?.waiting) selectedDemands.push("waiting");
    if (specialDemands?.donateDriver) {
      selectedDemands.push("donateDriver");
      donateAmount = specialDemands.donateDriver;
    }

    return {
      selectedDemands,
      donateAmount,
      addonPrice: addonPrice || 0
    };
  });

  const isMotorbike = vehicleType === 'MOTORBIKE';
  const services = isMotorbike ? motorbikeServices : vanServices;

  const visibleServices = services.filter(s => s.alwaysVisible);
  const expandableServices = services.filter(s => !s.alwaysVisible);

  const updateStateAndContext = (selectedDemands: string[], donateAmount: number) => {
    const serviceTotal = services
      .filter(service => selectedDemands.includes(service.id) && service.id !== "donateDriver")
      .reduce((sum, s) => sum + s.priceValue, 0);

    const addonPrice = serviceTotal + donateAmount;

    setState({ selectedDemands, donateAmount, addonPrice });
    setSpecialDemands(mapSelectedDemandsToSpecialDemands(selectedDemands, donateAmount));
    setAddonPrice(addonPrice);
  };

  const toggleService = (serviceId: string) => {
    if (serviceId === "donateDriver") return;

    const selected = state.selectedDemands.includes(serviceId)
      ? state.selectedDemands.filter(id => id !== serviceId)
      : [...state.selectedDemands, serviceId];

    // Keep donateDriver if donateAmount > 0
    if (state.donateAmount > 0 && !selected.includes("donateDriver")) {
      selected.push("donateDriver");
    }

    updateStateAndContext(selected, state.donateAmount);
  };

  const adjustDonateAmount = (increase: boolean) => {
    const newAmount = increase
      ? state.donateAmount + 5000
      : Math.max(0, state.donateAmount - 5000);

    let selected = [...state.selectedDemands];
    if (newAmount > 0 && !selected.includes("donateDriver")) {
      selected.push("donateDriver");
    } else if (newAmount === 0) {
      selected = selected.filter(id => id !== "donateDriver");
    }

    updateStateAndContext(selected, newAmount);
  };

  const mapSelectedDemandsToSpecialDemands = (selected: string[], donate: number): OrderSpecialDemand => {
    const sd: OrderSpecialDemand = {};
    selected.forEach(id => {
      switch (id) {
        case "handDelivery": sd.handDelivery = true; break;
        case "fragileDelivery": sd.fragileDelivery = true; break;
        case "donateDriver": sd.donateDriver = donate; break;
        case "homeMoving": sd.homeMoving = true; break;
        case "loading": sd.loading = true; break;
        case "businessValue": sd.businessValue = 0; break;
        case "eDocument": sd.eDocument = true; break;
        case "waiting": sd.waiting = true; break;
      }
    });
    return sd;
  };

  const renderService = (service: ServiceItem) => {
    const isSelected = state.selectedDemands.includes(service.id);

    if (service.id === "donateDriver") {
      return (
        <View key={service.id} style={styles.serviceItem}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>{state.donateAmount.toLocaleString()}đ</Text>
          </View>
          <View style={styles.donateControls}>
            <TouchableOpacity
              style={[styles.donateButton, state.donateAmount === 0 && styles.disabledButton]}
              onPress={() => adjustDonateAmount(false)}
              disabled={state.donateAmount === 0}
            >
              <Ionicons name="remove" size={22} color={state.donateAmount === 0 ? "#ccc" : COLOR.orange50} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.donateButton} onPress={() => adjustDonateAmount(true)}>
              <Ionicons name="add" size={22} color={COLOR.orange50} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View key={service.id} style={styles.serviceItem}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.servicePrice}>{service.price}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, isSelected && styles.selectedButton]}
          onPress={() => toggleService(service.id)}
        >
          <Ionicons
            name={isSelected ? "checkmark" : "add"}
            size={22}
            color={isSelected ? "#fff" : COLOR.orange50}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yêu cầu đặc biệt</Text>

      {visibleServices.map(renderService)}

      {isMotorbike && expanded && expandableServices.map(renderService)}

      {!isMotorbike && expandableServices.length > 0 && (
        <TouchableOpacity style={styles.collapseButton} onPress={() => setExpanded(!expanded)}>
          <Text style={styles.collapseText}>{expanded ? "Thu gọn" : "Xem thêm"}</Text>
          <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color="#999" />
        </TouchableOpacity>
      )}

      {state.addonPrice > 0 && (
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceLabel}>Tổng phí dịch vụ:</Text>
          <Text style={styles.totalPriceValue}>{state.addonPrice.toLocaleString()}đ</Text>
        </View>
      )}

      <View style={styles.verificationRow}>
        <Ionicons name="checkmark-circle" size={20} color={COLOR.blue_theme} />
        <Text style={styles.verificationText}>Đơn đã được áp dụng Khai giá hàng hóa</Text>
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
  donateControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  donateButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR.orange50,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    borderColor: "#ccc",
  },
});

export default SpecialDemand;