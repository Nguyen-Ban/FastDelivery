import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";

import GLOBAL from "../../../constants/GlobalStyles";
import COLOR from "@/constants/Colors";

import InfoCard from "@/components/InfoCard";
import Button from "@/components/Button/ButtonComponent";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Ionicons } from "@expo/vector-icons";
import orderService from "@/services/order.service";

interface EventDetail {
  id: string;
  time: string;
  vehicleType: string;
  deliveryType: string;
  driverName: string;
  driverPhoneNumber: string;
  pickupAddress: string;
  dropoffAddress: string;
  price: string;
  status: "IN_DELIVERY" | "DELIVERED";
  paymentStatus: "COMPLETED" | "PENDING";
  paymentMethod: "VNPAY" | "SENDER_CASH" | "RECEIVER_CASH";
}

const EventDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [event, setEvent] = useState<EventDetail>();

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await orderService.fetchEventDetail(id);
      if (response.success) {
        setEvent(response.data);
      }
    };
    fetchEvent();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_DELIVERY":
        return "#FF9500";
      case "DELIVERED":
        return "#4CD964";
      default:
        return "#00BFA5";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Đã thanh toán";
      case "PENDING":
        return "Chưa thanh toán";
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "VNPAY":
        return "Cổng VNPay";
      case "SENDER_CASH":
        return "Tiền mặt";
      case "RECEIVER_CASH":
        return "Tiền mặt";
      default:
        return method;
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
        <Text style={styles.headerTitle}>Chi tiết chuyến đi</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Status and Price */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event?.status || "") }]}>
            <Text style={styles.statusText}>{event?.status === "IN_DELIVERY" ? "Đang giao hàng" : "Đã giao"}</Text>
          </View>
          <Text style={styles.price}>{event?.price.toLocaleString()}đ</Text>
        </View>

        {/* Driver Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin tài xế</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{event?.driverName}</Text>
            <Text style={styles.phone}>{event?.driverPhoneNumber}</Text>
          </View>
        </View>

        {/* Location Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin địa điểm</Text>
          <View style={styles.infoContainer}>
            <View style={styles.addressContainer}>
              <View style={styles.dotBlack} />
              <Text style={styles.address}>{event?.pickupAddress}</Text>
            </View>
            <View style={styles.addressContainer}>
              <View style={styles.dotOrange} />
              <Text style={styles.address}>{event?.dropoffAddress}</Text>
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
          <View style={styles.infoContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Trạng thái thanh toán:</Text>
              <Text style={[styles.detailValue, { color: event?.paymentStatus === "COMPLETED" ? "#4CD964" : "#FF9500" }]}>
                {getPaymentStatusText(event?.paymentStatus || "")}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phương thức thanh toán:</Text>
              <Text style={styles.detailValue}>{getPaymentMethodText(event?.paymentMethod || "")}</Text>
            </View>
          </View>
        </View>

        {/* Time Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời gian</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.timeText}>
              {new Date(event?.time || "").toLocaleString('vi-VN')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dotBlack: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginRight: 8,
  },
  dotOrange: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9500',
    marginRight: 8,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
});
