import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import socket from "@/services/socket";
import { useDriver } from "@/contexts";

const CompletePayment = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const carPrice = parseFloat(params.carPrice as string)

  const deliveryPrice = parseFloat(params.deliveryPrice as string)
  const addonPrice = parseFloat(params.addonPrice as string)
  const orderId = params.orderId as string
  const { driverInfo } = useDriver()

  const handleComplete = async () => {
    const response: any = await new Promise((resolve) => {
      socket.emit("order:complete", { orderId }, (res) => {
        resolve(res);
      });
    });

    if (response.success) {
      router.push({
        pathname: "/driver",
        params: {
          driverInfo: JSON.stringify(driverInfo)
        }
      }
      );
    } else {
      console.error("Error completing order:", response.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Payment Details */}
      <View style={styles.content}>
        {/* Service Fee */}
        <View style={styles.row}>
          <Text style={styles.label}>Phí dịch vụ</Text>
          <Text style={styles.value}>{(deliveryPrice + carPrice).toLocaleString()}đ</Text>
        </View>

        {/* Additional Service */}
        <View style={styles.row}>
          <Text style={styles.label}>Dịch vụ thêm</Text>
          <Text style={styles.value}>{addonPrice.toLocaleString()}đ</Text>
        </View>

        {/* Total */}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Tổng thanh toán</Text>
          <Text style={styles.totalValue}>{(addonPrice + deliveryPrice + carPrice).toLocaleString()}đ</Text>
        </View>

        {/* Payment Method */}
        <View style={[styles.row, styles.paymentMethodRow]}>
          <Text style={styles.label}>Nhận thanh toán</Text>
          <Text style={styles.paymentMethod}>Thẻ/Ví</Text>
        </View>

        {/* Cash Collection */}
        <View style={styles.row}>
          <Text style={styles.label}>Thu tiền mặt</Text>
          <Text style={styles.value}>0đ</Text>
        </View>
      </View>

      {/* Complete Button */}
      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleComplete}
      >
        <Text style={styles.completeButtonText}>Hoàn thành</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  discount: {
    color: "#00BFA5",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentMethodRow: {
    marginTop: 24,
  },
  paymentMethod: {
    fontSize: 16,
    color: "#007AFF",
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  completeButton: {
    backgroundColor: "#00BFA5",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CompletePayment;
