import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
} from "react-native";

import GLOBAL from "../../constants/GlobalStyles";
import COLOR from "@/constants/Colors";

import InfoCard from "@/components/InfoCard";
import Button from "@/components/Button/ButtonComponent";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { FontAwesome } from "@expo/vector-icons";

const EventDetailScreen = () => {
  //hard code for UI
  const event = {
    date: "04/05/2025",
    items: [
      {
        amount: "35.000đ",
        time: "15:30",
        vehicleType: "MOTORCYCLE",
        packageType: "Bưu kiện nhỏ",
        pickup: "Sample Address",
        dropoff: "Sample Destination",
        status: "Hoàn thành",
      },
    ],
  };

  const driver = {
    name: "Nguyễn Văn A",
    phone: "0123456789",
    vehicleType: "MOTORCYCLE",
    vehiclePlate: "59A1-23456",
  };

  const status =
    event.items[0].status === "Đang giao hàng"
      ? "Hủy đơn hàng"
      : event.items[0].status;

  const color =
    event.items[0].status === "Đang giao hàng"
      ? COLOR.grey90
      : event.items[0].status === "Hoàn thành"
      ? COLOR.blue70
      : COLOR.grey50;
  return (
    <View style={GLOBAL.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <FontAwesome6 name="arrow-left" size={30} color="black" />
      </TouchableOpacity>
      <InfoCard
        title={driver.name}
        icon={<FontAwesome6 name="user" size={25} color="black" />}
        subtitle={driver.phone}
        iconContainerStyle={{ marginRight: 15 }}
        style={styles.driver_card}
        titleStyle={{ fontSize: 18 }}
        subtitleStyle={{ fontSize: 13 }}
        onPress={() => {}}
      />
      <View style={styles.location_card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome6
            name="location-crosshairs"
            size={24}
            color={COLOR.red55}
            paddingRight={15}
          />
          <Text style={{ fontSize: 18 }}>{event.items[0].pickup}</Text>
        </View>
        <View
          style={{ flexDirection: "row", paddingTop: 40, alignItems: "center" }}
        >
          <FontAwesome6
            name="location-crosshairs"
            size={24}
            color={COLOR.blue_theme}
            paddingRight={15}
          />
          <Text style={{ fontSize: 18 }}>{event.items[0].dropoff}</Text>
        </View>
      </View>
      <View style={styles.date_time}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {event.date} {"\t:\t"} {event.items[0].time}
        </Text>
      </View>
      <View style={styles.payment_card}>
        <Text style={{ fontSize: 18 }}>Payment Method</Text>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {event.items[0].amount}
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Button
          title={status}
          onPress={() => {}}
          size="large"
          type="primary"
          textStyle={{ color: COLOR.black, fontSize: 16 }}
          style={{
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  driver_card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.grey50,
    padding: 10,
    justifyContent: "flex-start",
    marginTop: 25,
    marginBottom: 15,
  },
  location_card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.grey50,
    padding: 10,
    marginBottom: 15,
  },
  payment_card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.grey50,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date_time: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.grey50,
    padding: 10,
    marginBottom: 15,
  },
});
