import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import COLOR from "../constants/Colors";
import GLOBAL from "../constants/GlobalStyles";
import { FontAwesome6 } from "@expo/vector-icons";

interface EventCardProps {
  amount: string;
  date: string;
  time: string;
  vehicleType: string;
  pickup: string;
  dropoff: string;
  status: string;
  onPress: () => void;
  icon_size?: number;
  icon_color?: string;
  amount_text_style?: object;
  img_container_style?: object;
  container_style?: object;
  detail_style?: object;
  date_time_style?: object;
  address_style?: object;
  status_style?: object;
  text_status_style?: object;
}

const EventCard: React.FC<EventCardProps> = ({
  amount,
  date,
  time,
  vehicleType,
  pickup,
  dropoff,
  status,
  onPress,
  icon_size,
  icon_color,
  amount_text_style,
  img_container_style,
  container_style,
  detail_style,
  date_time_style,
  address_style,
  status_style,
  text_status_style,
}) => {
  const name = vehicleType === "MOTORCYCLE" ? "motorcycle" : "truck";
  const size = icon_size ?? 18;
  const color = icon_color ?? COLOR.black;
  const status_color =
    status === "Hoàn thành"
      ? COLOR.blue70
      : status === "Đang giao hàng"
      ? COLOR.orange70
      : COLOR.grey90;
  const status_border_color =
    status === "Hoàn thành"
      ? COLOR.blue40
      : status === "Đang giao hàng"
      ? COLOR.orange50
      : COLOR.grey50;
  const amountTextStyle = [styles.amount_default, amount_text_style];
  const imgContainerStyle = [
    styles.image_container_default,
    { paddingRight: 10 },
    img_container_style,
  ];
  const containerStyle = [styles.container_default, container_style];
  const detailStyle = [styles.detail_default, detail_style];
  const dateTimeStyle = [
    styles.date_time_default,
    { paddingVertical: 2 },
    date_time_style,
  ];
  const addressStyle = [styles.address_default, address_style];
  const statusStyle = [
    styles.status_default,
    { backgroundColor: status_color, borderColor: status_border_color },
    status_style,
  ];
  const textStatusStyle = [styles.text_status_default, text_status_style];
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <View style={imgContainerStyle}>
        <FontAwesome6 name={name} size={size} color={color}></FontAwesome6>
      </View>
      <View style={detailStyle}>
        <Text numberOfLines={1} style={addressStyle}>
          Từ: {pickup}
        </Text>
        <Text numberOfLines={1} style={addressStyle}>
          Đến: {dropoff}
        </Text>
        <Text style={dateTimeStyle}>
          {time}, {date}
        </Text>
        <View style={statusStyle}>
          <Text style={textStatusStyle}>{status}</Text>
        </View>
      </View>
      <Text style={amountTextStyle}>{amount}</Text>
    </TouchableOpacity>
  );
};
export default EventCard;
const styles = StyleSheet.create({
  amount_default: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  container_default: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image_container_default: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detail_default: { flexDirection: "column", flex: 3, padding: 10 },
  date_time_default: { fontSize: 12, color: COLOR.grey50 },
  address_default: { fontSize: 16 },
  status_default: {
    alignContent: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 45,
    padding: 5,
    marginTop: 5,
    width: "auto",
  },
  text_status_default: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
