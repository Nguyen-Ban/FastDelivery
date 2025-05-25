import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import GLOBAL from "../../constants/GlobalStyles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import authService from "../../services/auth.service";

const OTPVerify = () => {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const otpRef = useRef<OtpInputRef>(null);

  const OTPCheck = async (otp: string) => {
    setOtp(otp);
    if (otp.length === 6) {
      try {
        setIsLoading(true);
        const response = await authService.verifyOtp({
          phoneNumber: phoneNumber,
          otp: otp
        });

        if (response.success) {
          if (response.nextStep === 'register') {
            router.push({
              pathname: "../authentication/user-info",
              params: { phoneNumber }
            });
          } else {
            router.push("../home");
          }
        } else {
          Alert.alert("Lỗi", response.message || "Mã OTP không đúng");
          otpRef.current?.clear();
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể kết nối đến server");
        otpRef.current?.clear();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={GLOBAL.container}>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        style={styles.backButton}
      >
        <FontAwesome6 name="arrow-left" size={20} color={COLOR.blue_theme} />
      </TouchableOpacity>

      <Text style={styles.otpText}>Nhập mã OTP</Text>
      <Text style={styles.phoneText}>
        Mã xác thực đã được gửi đến số điện thoại {phoneNumber}
      </Text>

      <FontAwesome6
        name="comment-sms"
        size={100}
        color={COLOR.blue_theme}
        style={styles.icon}
      />

      <Text style={styles.subTitle}>
        Nhập mã gồm 6 chữ số mà bạn đã nhận được qua tin nhắn điện thoại
      </Text>

      <OtpInput
        numberOfDigits={6}
        focusColor={COLOR.blue_theme}
        onTextChange={OTPCheck}
        ref={otpRef}
      />

      {isLoading && (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color={COLOR.blue_theme}
        />
      )}
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
  phoneText: {
    fontSize: 16,
    alignSelf: "center",
    paddingVertical: 10,
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
  backButton: {
    padding: 10,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  icon: {
    alignSelf: "center"
  }
});
