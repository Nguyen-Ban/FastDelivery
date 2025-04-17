import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../../components/Button/ButtonComponent";
import InfoCard from "@/components/Button/InfoCard";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

const OrderDetail = () => {
  const [amount, setAmount] = React.useState(0);
  const [disabled, setDisabled] = React.useState(true);
  const [origin, setOrigin] = React.useState("origin");
  const [destination, setDestination] = React.useState("destination");
  const [name_origin, setNameOrigin] = React.useState("name_origin");
  const [name_destination, setNameDestination] =
    React.useState("name_destination");
  const [phone_origin, setPhoneOrigin] = React.useState("phone_origin");
  const [phone_destination, setPhoneDestination] =
    React.useState("phone_destination");
  const [vihicle, setVihicle] = React.useState("bike");
  const [date, setDate] = React.useState("date");
  const [time, setTime] = React.useState("time");

  const router = useRouter();

  return (
    <View style={[GLOBAL.container, { justifyContent: "space-between" }]}>
      <LinearGradient
        colors={[COLOR.blue70, COLOR.white]}
        style={styles.background}
        locations={[0.12, 0.12]}
      />
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome6 name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Chi tiết đơn hàng</Text>
        </View>
        <View style={styles.detailCard}>
          {/* Origin */}
          <InfoCard
            style={styles.detailOption}
            onPress={() => {
              router.push("../order/location-pick");
            }}
            title={origin}
            subtitle={`${name_origin} - ${phone_origin}`}
            icon={
              <FontAwesome6 name="location-dot" size={24} color={COLOR.red55} />
            }
            iconContainerStyle={styles.additionalIconViewStyle}
          ></InfoCard>
          {/* Destination */}
          <InfoCard
            style={styles.detailOption}
            onPress={() => {
              router.push("../order/client-info");
            }}
            title={destination}
            subtitle="Thêm thông tin người nhận"
            icon={
              <FontAwesome6
                name="location-dot"
                size={24}
                color={COLOR.blue40}
              />
            }
            iconContainerStyle={styles.additionalIconViewStyle}
          ></InfoCard>
          {/* Date time TODO: datetime select*/}
          <InfoCard
            style={styles.detailOption}
            onPress={() => {}}
            title={`Ngày giao hàng: ${date}`}
            subtitle={`Thời gian giao hàng: ${time}`}
            icon={<FontAwesome6 name="clock" size={24} color={COLOR.black} />}
            iconContainerStyle={styles.additionalIconViewStyle}
          ></InfoCard>
          {/* Delivery Method */}
          <InfoCard
            style={styles.detailOption}
            title={vihicle}
            subtitle="Đề xuất dựa trên chi tiết món hàng"
            onPress={() => {}}
            icon={
              <FontAwesome6 name="motorcycle" size={24} color={COLOR.black} />
            }
            iconContainerStyle={styles.additionalIconViewStyle}
          ></InfoCard>
          {/* Goods detail */}
          <InfoCard
            style={styles.detailOption}
            onPress={() => {
              router.push("../order/goods-detail");
            }}
            title="Thông tin món hàng"
            subtitle="Thêm chi tiết món hàng"
            icon={<FontAwesome6 name="box" size={24} color={COLOR.black} />}
            iconContainerStyle={styles.additionalIconViewStyle}
          ></InfoCard>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.amountView}>
          <Text style={{ fontSize: 20 }}>Tổng cộng</Text>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {amount}
            <Text style={{ textDecorationLine: "underline" }}>đ</Text>
          </Text>
        </View>
        <Button
          title="Kiểm tra đơn hàng"
          onPress={() => {}}
          type="primary"
          size="large"
          disabled={disabled}
        />
      </View>
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  image: {
    width: 30,
    height: 30,
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 5,
  },
  option_text: {
    fontSize: 16,
    paddingLeft: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 30,
  },
  amountView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  detailCard: {
    boxShadow: "1px 2px 4px 4px rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    marginTop: 30,
    backgroundColor: COLOR.white,
  },
  detailOption: {
    paddingVertical: 10,
    borderBottomColor: COLOR.grey90,
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  additionalIconViewStyle: {
    width: "12%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  footer: {
    paddingBottom: 10,
    paddingTop: 5,
    borderTopColor: COLOR.grey50,
    borderTopWidth: 1,
  },
});
