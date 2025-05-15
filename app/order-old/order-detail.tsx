import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../../components/Button/ButtonComponent";
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
          <TouchableOpacity
            style={styles.detailOption}
            onPress={() => {
              router.push("/order/location/location-pick");
            }}
          >
            <FontAwesome6 name="location-dot" size={30} color={COLOR.red55} />
            <Text style={styles.option_text}>
              {origin}
              {"\n"}
              <Text style={{ color: COLOR.grey70 }}>
                {name_origin} - {phone_origin}
              </Text>
            </Text>
          </TouchableOpacity>
          {/* Destination */}
          <TouchableOpacity
            style={styles.detailOption}
            onPress={() => {
              router.push("/order-old/client-info");
            }}
          >
            <FontAwesome6 name="location-dot" size={30} color={COLOR.blue40} />
            <Text style={styles.option_text}>
              {destination}
              {"\n"}
              <Text style={{ color: COLOR.blue40 }}>
                Thêm thông tin người nhận
              </Text>
              <Text style={{ color: COLOR.red55 }}>*</Text>
            </Text>
          </TouchableOpacity>
          {/* Date time TODO: datetime select*/}
          <TouchableOpacity style={styles.detailOption}>
            <FontAwesome6 name="clock" size={30} color="black" />
            <Text style={styles.option_text}>
              <Text>Ngày giao hàng: {date}</Text>
              {"\n"}
              <Text style={{ color: COLOR.grey70 }}>
                Thời gian giao hàng: {time}
              </Text>
            </Text>
          </TouchableOpacity>
          {/* Delivery Method */}
          <TouchableOpacity style={styles.detailOption}>
            <FontAwesome6 name="motorcycle" size={24} color="black" />
            <Text style={styles.option_text}>
              {vihicle}
              {"\n"}
              <Text style={{ color: COLOR.grey70 }}>
                Đề xuất dựa trên chi tiết món hàng
              </Text>
            </Text>
          </TouchableOpacity>
          {/* Goods detail */}
          <TouchableOpacity
            style={styles.detailOption}
            onPress={() => {
              router.push("/order-old/goods-detail");
            }}
          >
            <FontAwesome6 name="box" size={30} color="black" />
            <Text style={styles.option_text}>
              <Text style={{ color: COLOR.blue40 }}>
                Thêm chi tiết món hàng
              </Text>
              <Text style={{ color: COLOR.red55 }}>*</Text>
              {"\n"}
              <Text style={{ color: COLOR.grey70 }}>Thông tin món hàng</Text>
            </Text>
          </TouchableOpacity>
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
          onPress={() => { }}
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
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: COLOR.grey90,
    borderBottomWidth: 1,
    marginHorizontal: 10,
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
