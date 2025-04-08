import React, { useRef, useState } from "react";

import { View, Text, StyleSheet } from "react-native";
import PhoneInput from "react-native-international-phone-number";
import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

const AuthMethod = () => {
  const phoneInput = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter();

  const handlePhoneNumberChange = (formattedNumber: string) => {
    setPhoneNumber(formattedNumber);
    setIsDisabled(formattedNumber.length < 10);
  };

  const nextButtonHandler = () => {
    if (isDisabled === false) {
      router.push("./otp-verify");
    }
  };

  return (
    <View style={GLOBAL.container}>
      <Text style={styles.title}>Đăng ký/Đăng nhập với số điện thoại</Text>
      <PhoneInput
        ref={phoneInput}
        defaultCountry="VN"
        placeholder="Nhập số điện thoại"
        allowZeroAfterCallingCode={false}
        phoneInputStyles={{
          container: {
            borderColor: isFocused ? COLOR.blue_theme : COLOR.grey90,
            borderWidth: 2,
          },
        }}
        onChange={(e) => handlePhoneNumberChange(e.nativeEvent.text)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Text style={styles.policy}>
        Bằng cách nhấn nút Tiếp tục, bạn đã đồng ý với các{" "}
        <Text style={styles.policy_link}>Điều kiện và Điều khoản</Text> của Fast
        Delivery.
      </Text>
      <Button
        title="Tiếp tục"
        onPress={() => {
          nextButtonHandler();
        }}
        size="large"
        type="primary"
        disabled={isDisabled}
      />
      <View style={styles.otherAuthContainer}>
        <View style={styles.line} />
        <Text style={styles.otherAuthText}>Hoặc đăng nhập bằng</Text>
        <View style={styles.line} />
      </View>
      <Button
        title="Google"
        onPress={() => {}}
        size="large"
        type="sub"
        leftImg={<FontAwesome6 name="google" size={20} color="black" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 16,
    alignSelf: "flex-start",
  },
  policy: {
    fontSize: 12,
    color: COLOR.grey50,
    paddingVertical: 16,
    alignSelf: "flex-start",
  },
  policy_link: {
    fontSize: 12,
    color: COLOR.blue_theme,
    textDecorationLine: "underline",
  },
  otherAuthText: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    fontSize: 12,
    color: COLOR.grey50,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLOR.grey90,
  },
  otherAuthContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthMethod;
