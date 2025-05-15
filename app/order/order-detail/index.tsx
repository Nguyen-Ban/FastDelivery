import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RouteOverview from "./_components/route-overview";
import DeliveryType from "./_components/delivery-type";
import CarType from "./_components/car-type";
import GoodsDetail from "./_components/goods-detail";
import Note from "./_components/note";
import SpecialDemand from "./_components/special-demand";
import OrderConfirm from "./_components/order-confirm";
import SenderReceiver from "./_components/sender-receiver";
import COLOR from "../../../constants/Colors";
import { useOrder } from "../../../contexts/order.context";

const OrderOverview = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { pickupLocation, deliveryLocation } = useOrder();
  // Ensure type is a string by taking first value if it's an array
  const deliveryType = Array.isArray(params.type) ? params.type[0] : params.type || 'VAN';
  const isVan = deliveryType === 'VAN';

  // Extract receiver information from params
  const receiverInfo = {
    name: Array.isArray(params.name) ? params.name[0] : params.name,
    phone: Array.isArray(params.phone) ? params.phone[0] : params.phone,
    address: Array.isArray(params.address) ? params.address[0] : params.address,
    note: Array.isArray(params.note) ? params.note[0] : params.note,
  };

  // Height for the OrderConfirm component + extra padding
  const orderConfirmHeight = 180;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isVan ? "Giao hàng xe tải" : "Giao hàng xe máy"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: orderConfirmHeight }
        ]}
      >
        <SenderReceiver
          receiverName={receiverInfo.name}
          receiverPhone={receiverInfo.phone}
          receiverNote={receiverInfo.note}
        />
        {pickupLocation && deliveryLocation && (
          <RouteOverview
            pickupLocation={pickupLocation}
            deliveryLocation={deliveryLocation}
          />
        )}
        <DeliveryType />
        {isVan && <CarType />}
        <GoodsDetail type={deliveryType} />
        <Note />
        <SpecialDemand type={deliveryType} />
      </ScrollView>
      <OrderConfirm />
    </SafeAreaView>
  );
};

export default OrderOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.blue_theme,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 26,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 30,
  }
});