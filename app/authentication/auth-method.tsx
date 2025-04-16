import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import PhoneInput from "react-native-international-phone-number";
import { useRouter } from "expo-router";
import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";
import authService from "../../services/auth.service";
import { parsePhoneNumber } from 'libphonenumber-js';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const AuthMethod = () => {
  const phoneInput = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePhoneNumberChange = (e: any) => {
    const text = e.nativeEvent.text;
    setPhoneNumber(text);
    setIsDisabled(text.length < 10);
  };

  const nextButtonHandler = async () => {
    if (isDisabled) return;

    try {
      setIsLoading(true);
      // Parse số điện thoại với mã quốc gia VN
      const parsedNumber = parsePhoneNumber(phoneNumber, 'VN');
      if (!parsedNumber?.isValid()) {
        Alert.alert("Lỗi", "Số điện thoại không hợp lệ");
        return;
      }
    

      const response = await authService.startAuth({ 
        phoneNumber: parsedNumber.format('E.164') // Format E.164 chuẩn quốc tế
      });

      if (response.success) {
        if (response.nextStep === 'login') {
          router.push({
            pathname: "./enter-passcode",
            params: { 
              phoneNumber: parsedNumber.format('E.164'),
              flow: 'login'
            }
          });
        } else if (response.nextStep === 'verify-otp') {
          router.push({
            pathname: "./otp-verify",
            params: { phoneNumber: parsedNumber.format('E.164') }
          });
        }
      } else {
        Alert.alert("Lỗi", response.message || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server");
    } finally {
      setIsLoading(false);
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
        onChange={handlePhoneNumberChange}
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
        onPress={nextButtonHandler}
        size="large"
        type="primary"
        disabled={isDisabled || isLoading}
      />
      {isLoading && (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color={COLOR.blue_theme}
        />
      )}
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
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],

  },
});

export default AuthMethod;
