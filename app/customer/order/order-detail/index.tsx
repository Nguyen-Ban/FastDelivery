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
import COLOR from "../../../../constants/Colors";
import { useOrder } from "../../../../contexts/order.context";

const OrderOverview = () => {
  const router = useRouter();
  const { pickupLocation, dropoffLocation, sender, receiver, vehicleType } = useOrder();

  const isMotorbike = vehicleType === 'MOTORBIKE';

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
          {isMotorbike ? "Giao hàng xe máy" : "Giao hàng xe tải"}
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
        <SenderReceiver />
        <RouteOverview />
        <DeliveryType />
        {!isMotorbike && <CarType />}
        <GoodsDetail />
        <Note />
        <SpecialDemand />
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