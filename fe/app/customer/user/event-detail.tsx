import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import GLOBAL from "../../../constants/GlobalStyles";
import COLOR from "@/constants/Colors";

import InfoCard from "@/components/InfoCard";
import Button from "@/components/Button/ButtonComponent";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
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
  status: string;
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


  return (
    <View style={GLOBAL.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <FontAwesome6 name="arrow-left" size={30} color="black" />
      </TouchableOpacity>
      <InfoCard
        title={event?.driverName || ""}
        icon={<FontAwesome6 name="user" size={25} color="black" />}
        subtitle={event?.driverPhoneNumber || ""}
        iconContainerStyle={{ marginRight: 15 }}
        style={styles.driver_card}
        titleStyle={{ fontSize: 18 }}
        subtitleStyle={{ fontSize: 13 }}
        onPress={() => { }}
      />
      <View style={styles.location_card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome6
            name="location-crosshairs"
            size={24}
            color={COLOR.red55}
            paddingRight={15}
          />
          <Text style={{ fontSize: 18 }}>{event?.pickupAddress || ""}</Text>
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
          <Text style={{ fontSize: 18 }}>{event?.dropoffAddress || ""}</Text>
        </View>
      </View>
      <View style={styles.date_time}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {new Date(event?.time || "").toLocaleString('vi-VN')}
        </Text>
      </View>
      <View style={styles.payment_card}>
        <Text style={{ fontSize: 18 }}>Chi phí</Text>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {event?.price.toLocaleString() || ""}đ
        </Text>

      </View>
      <View style={styles.payment_card}>
        <Text style={{ fontSize: 18 }}>Trạng thái</Text>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {event?.status || ""}
        </Text>

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
