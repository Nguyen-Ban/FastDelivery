import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CompletePayment = () => {
  const router = useRouter();
  const [showEarningsModal, setShowEarningsModal] = useState(false);

  const handleComplete = () => {
    setShowEarningsModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Earnings Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showEarningsModal}
        onRequestClose={() => setShowEarningsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* <Image
                            source={require('../../assets/bike-icon.png')}
                            style={styles.earningsIcon}
                        /> */}
            <Text style={styles.earningsTitle}>Thu nhập rồng</Text>
            <Text style={styles.earningsAmount}>13.870đ</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowEarningsModal(false);
                router.push("../driver");
              }}
            >
              <Text style={styles.modalButtonText}>Tuyệt vời</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
          <Text style={styles.value}>19.000đ</Text>
        </View>

        {/* Additional Service */}
        <View style={styles.row}>
          <Text style={styles.label}>Dịch vụ thêm</Text>
          <Text style={styles.value}>1.000đ</Text>
        </View>

        {/* OPES Fee */}
        <View style={styles.row}>
          <Text style={styles.label}>OPES</Text>
          <Text style={styles.value}>1.000đ</Text>
        </View>

        {/* Discount */}
        <View style={styles.row}>
          <Text style={styles.label}>Giảm giá</Text>
          <Text style={[styles.value, styles.discount]}>-4.000đ</Text>
        </View>

        {/* Total */}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Tổng thanh toán</Text>
          <Text style={styles.totalValue}>16.000đ</Text>
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
        onPress={() => router.push("../driver")}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "80%",
    maxWidth: 320,
  },
  earningsIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  earningsTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: "#00BFA5",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    width: "100%",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CompletePayment;
