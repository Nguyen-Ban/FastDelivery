import React, { useRef, useState } from "react";

import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import GLOBAL from "../../constants/GlobalStyles";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const OTPVerify = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [targetOTP, setTargetOTP] = useState("123456"); // Example target OTP 123456
  const otpRef = useRef<OtpInputRef>(null);

  const OTPCheck = (otp: string) => {
    setOtp(otp);
    if (otp === targetOTP) {
      router.push("../authentication/user-info");
    } else {
      Alert.alert("OTP is incorrect");
      otpRef.current?.clear();
    }
  };

  return (
    <View style={GLOBAL.container}>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
      >
        <FontAwesome6 name="arrow-left" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.otpText}>Mã xác thực OTP</Text>
      <FontAwesome6
        name="comment-sms"
        size={100}
        color="black"
        style={{ alignSelf: "center" }}
      />
      <Text style={styles.subTitle}>
        Nhập mã gồm 6 chữ số mà bạn đã nhận được qua tin nhắn điện thoại{"\n"}
        <Text style={styles.phoneNum}>+84xxxxxxxxx</Text>
      </Text>
      <OtpInput
        numberOfDigits={6}
        focusColor={COLOR.blue_theme}
        type="numeric"
        autoFocus={true}
        ref={otpRef}
        onFilled={(otp: string) => {
          OTPCheck(otp);
        }}
      />
      <View style={styles.resendTimerView}>
        <Text style={styles.resendLabel}>Gửi lại mã sau:</Text>
        {/* Set a timer for 30 seconds */}
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
