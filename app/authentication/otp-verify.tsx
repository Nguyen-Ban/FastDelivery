import React from "react";

import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import { OtpInput } from "react-native-otp-entry";
import GLOBAL from "../../constants/GlobalStyles";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const OTPVerify = () => {
  return (
    <View style={GLOBAL.container}>
      <TouchableOpacity>
        <MaterialIcons name="arrow-back" size={25} color="black" />
      </TouchableOpacity>
      <Text style={styles.otpText}>Mã xác thực OTP</Text>
      <MaterialIcons
        name="send-to-mobile"
        size={100}
        color="black"
        style={{ alignSelf: "center" }}
      />
      <Text style={styles.subTitle}>
        Nhập mã gồm 6 chữ số mà bạn đã nhận được qua Tin nhắn điện thoại{"\n"}
        <Text style={styles.phoneNum}>+84xxxxxxxxx</Text>
      </Text>
      <OtpInput
        numberOfDigits={6}
        focusColor={COLOR.blue_theme}
        type="numeric"
      />
      <View style={styles.resendTimerView}>
        <Text style={styles.resendLabel}>Gửi lại mã sau:</Text>
        <Text style={styles.timer}>30</Text>
      </View>
      <Button
        title="Gửi lại mã"
        onPress={() => {}}
        size="small"
        type="primary"
        disabled={true}
        style={styles.resendAddStyles}
      />
    </View>
  );
};

export default OTPVerify;

const styles = StyleSheet.create({
  otpText: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 25,
    paddingBottom: 15,
  },
  subTitle: {
    fontSize: 16,
    alignSelf: "flex-start",
    paddingVertical: 16,
  },
  phoneNum: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resendAddStyles: {
    marginTop: 5,
    alignSelf: "center",
  },
  resendTimerView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  resendLabel: {
    paddingHorizontal: 3,
    fontSize: 16,
  },
  timer: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
