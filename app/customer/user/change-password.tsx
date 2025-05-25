import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";

import GLOBAL from "../../../constants/GlobalStyles";
import COLOR from "../../../constants/Colors";
import Button from "../../../components/Button/ButtonComponent";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import userService from "../../../services/user.service";

const { width } = Dimensions.get("window");

const ChangePasswordScreen = () => {
  const router = useRouter();
  const [currentPasscode, setCurrentPasscode] = useState<string>("");
  const [newPasscode, setNewPasscode] = useState<string>("");
  const [confirmPasscode, setConfirmPasscode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  const validateInputs = (): boolean => {
    const newErrors: { current?: string; new?: string; confirm?: string } = {};
    let isValid = true;

    // Check if current password is entered
    if (!currentPasscode.trim()) {
      newErrors.current = "Vui lòng nhập mật khẩu hiện tại";
      isValid = false;
    } else if (currentPasscode.length !== 6 || !/^\d+$/.test(currentPasscode)) {
      newErrors.current = "Mật khẩu phải là 6 chữ số";
      isValid = false;
    }

    // Check if new password is entered and valid
    if (!newPasscode.trim()) {
      newErrors.new = "Vui lòng nhập mật khẩu mới";
      isValid = false;
    } else if (newPasscode.length !== 6 || !/^\d+$/.test(newPasscode)) {
      newErrors.new = "Mật khẩu mới phải là 6 chữ số";
      isValid = false;
    }

    // Check if confirm password matches new password
    if (!confirmPasscode.trim()) {
      newErrors.confirm = "Vui lòng xác nhận mật khẩu mới";
      isValid = false;
    } else if (confirmPasscode !== newPasscode) {
      newErrors.confirm = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangePasscode = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await userService.changePasscode({
        currentPasscode,
        newPasscode,
        confirmPasscode,
      });

      if (response.success) {
        Alert.alert(
          "Thành công",
          "Mật khẩu đã được thay đổi thành công",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert("Lỗi", response.message || "Không thể thay đổi mật khẩu");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Đã xảy ra lỗi khi thay đổi mật khẩu";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasscodeChange = (text: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Only allow 6 digits
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
    setter(cleaned);
  };

  return (
    <View style={GLOBAL.home_container}>
      <View style={styles.header}>
        <LinearGradient
          colors={[COLOR.blue70, COLOR.orange70]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 16 }}
          >
            <FontAwesome6 name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Đổi mật khẩu</Text>
        </LinearGradient>
      </View>
      <View style={styles.content_view}>
        <Text style={styles.label}>Nhập mật khẩu cũ (6 chữ số)</Text>
        <TextInput
          style={[styles.text_input, errors.current ? styles.inputError : null]}
          keyboardType="numeric"
          value={currentPasscode}
          onChangeText={(text) => handlePasscodeChange(text, setCurrentPasscode)}
          secureTextEntry
          maxLength={6}
        />
        {errors.current && <Text style={styles.errorText}>{errors.current}</Text>}
      </View>
      <View style={styles.content_view}>
        <Text style={styles.label}>Nhập mật khẩu mới (6 chữ số)</Text>
        <TextInput
          style={[styles.text_input, errors.new ? styles.inputError : null]}
          keyboardType="numeric"
          value={newPasscode}
          onChangeText={(text) => handlePasscodeChange(text, setNewPasscode)}
          secureTextEntry
          maxLength={6}
        />
        {errors.new && <Text style={styles.errorText}>{errors.new}</Text>}
      </View>
      <View style={styles.content_view}>
        <Text style={styles.label}>Nhập lại mật khẩu mới </Text>
        <TextInput
          style={[styles.text_input, errors.confirm ? styles.inputError : null]}
          keyboardType="numeric"
          value={confirmPasscode}
          onChangeText={(text) => handlePasscodeChange(text, setConfirmPasscode)}
          secureTextEntry
          maxLength={6}
        />
        {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end", padding: 16 }}>
        <Button
          title={isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
          size="large"
          type="primary"
          onPress={handleChangePasscode}
          disabled={isLoading}
        />
      </View>

      {isLoading && (
        <View style={styles.loading_overlay}>
          <ActivityIndicator size="large" color={COLOR.blue40} />
        </View>
      )}
    </View>
  );
};

export default ChangePasswordScreen;
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    paddingLeft: 16,
    fontSize: 24,
    fontWeight: "bold",
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  content_view: { paddingHorizontal: 16, paddingTop: 16 },
  label: { fontSize: 16, marginBottom: 5 },
  text_input: {
    backgroundColor: COLOR.grey90,
    fontSize: 16,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLOR.grey70,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  loading_overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});
