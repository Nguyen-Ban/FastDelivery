import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useOrder } from "../../../../../contexts/order.context";
import COLOR from "../../../../../constants/Colors";
import Payment from "./payment";
import mapService from "@/services/map.service";
import { Location, ROLE, VEHICLE_TYPES } from "@/types";
import socket from "@/services/socket";

const OrderConfirm = () => {
  const [selectedMethod, setSelectedMethod] = useState('sendercash');
  const router = useRouter();
  const {
    pickupLocation,
    dropoffLocation,
    polyline,

    sender,
    receiver,
    deliveryType,
    deliveryPrice,
    vehicleType,
    packageType,
    weightKg,
    lengthCm,
    widthCm,
    heightCm,
    sizeName,
    note,
    specialDemands,
    addonPrice,
    setPolyline
  } = useOrder();

  // Calculate total price based on delivery details
  const totalPrice = useMemo(() => {
    return addonPrice + deliveryPrice;
  }, [addonPrice, deliveryPrice]);

  const validateOrder = () => {
    if (!pickupLocation || !dropoffLocation) {
      Alert.alert('Thông báo', 'Vui lòng chọn địa điểm đón và trả hàng');
      return false;
    }
    if (!sender || !receiver) {
      Alert.alert('Thông báo', 'Vui lòng nhập thông tin người gửi và người nhận');
      return false;
    }
    if (!packageType || !weightKg || !lengthCm || !widthCm || !heightCm) {
      Alert.alert('Thông báo', 'Vui lòng nhập thông tin hàng hóa');
      return false;
    }
    return true;
  };

  const fetchPolyline = async (vehicleType: VEHICLE_TYPES, pickupLocation: Location, dropoffLocation: Location) => {
    try {
      const response = await mapService.getPolyline(
        vehicleType,
        {
          lng: pickupLocation?.coord?.lng ?? 0,
          lat: pickupLocation?.coord?.lat ?? 0
        },
        {
          lng: dropoffLocation?.coord?.lng ?? 0,
          lat: dropoffLocation?.coord?.lat ?? 0
        }
      );
      console.log(response)
      setPolyline(response.data.polyline);
    } catch (error) {
      console.error('Error fetching polyline:', error);
      Alert.alert('Lỗi', 'Không thể lấy đường đi. Vui lòng thử lại sau.');
    }
  }

  useEffect(() => {
    if (
      vehicleType &&
      pickupLocation?.coord?.lat !== undefined &&
      pickupLocation?.coord?.lng !== undefined &&
      dropoffLocation?.coord?.lat !== undefined &&
      dropoffLocation?.coord?.lng !== undefined
    ) {
      fetchPolyline(vehicleType, pickupLocation, dropoffLocation);
    }
  }, [vehicleType, pickupLocation, dropoffLocation])

  useEffect(() => {
    socket.connect(ROLE.CUSTOMER);
    return () => {
      socket.disconnect();
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (!validateOrder()) {
      return;
    }


    try {
      // Format order data according to the required structure
      const orderData = {
        orderMain: {
          price: totalPrice,
          vehicleType: vehicleType,
          deliveryType: deliveryType,
          note: note,
        },
        orderSenderReceiver: {
          senderName: sender?.name || "",
          senderPhoneNumber: sender?.phoneNumber || "",
          receiverName: receiver?.name || "",
          receiverPhoneNumber: receiver?.phoneNumber || ""
        },
        orderLocation: {
          pickupTitle: pickupLocation?.title,
          dropoffTitle: dropoffLocation?.title,
          pickupAddress: pickupLocation?.address,
          pickupLat: pickupLocation?.coord?.lat,
          pickupLng: pickupLocation?.coord?.lng,
          dropoffAddress: dropoffLocation?.address,
          dropoffLat: dropoffLocation?.coord?.lat,
          dropoffLng: dropoffLocation?.coord?.lng
        },
        orderDetail: {
          packageType: packageType,
          weightKg: weightKg,
          lengthCm: lengthCm,
          widthCm: widthCm,
          heightCm: heightCm,
          sizeName: sizeName,
        },
        orderSpecialDemand: specialDemands
      };

      socket.emit('order:create', orderData);

      // Navigate to delivery screen
      router.push({
        pathname: "/customer/delivery/delivery",
        params: {
          pickupLocation: JSON.stringify(pickupLocation),
          dropoffLocation: JSON.stringify(dropoffLocation),
          vehicleType: vehicleType,
          polyline: polyline,
        }
      });
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert(
        'Lỗi',
        'Không thể tạo đơn hàng. Vui lòng thử lại sau.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Payment
        selectedMethod={selectedMethod}
        onSelectMethod={setSelectedMethod}
        totalPrice={totalPrice}
      />

      <TouchableOpacity
        style={styles.orderButton}
        onPress={handlePlaceOrder}
      >
        <Text style={styles.orderButtonText}>Đặt đơn</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderConfirm;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
    zIndex: 999,
  },
  orderButton: {
    backgroundColor: COLOR.orange50,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});