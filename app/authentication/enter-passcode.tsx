import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";
import authService from "../../services/auth.service";
import { useAuth } from "../../contexts/auth.context";

const EnterPasscode = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { phoneNumber, fullName, email, gender, dateOfBirth, flow } = useLocalSearchParams();
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { login } = useAuth();

  const handlePasscodeChange = (text: string) => {
    const newPasscode = text.replace(/[^0-9]/g, "").slice(0, 6);
    setPasscode(newPasscode);
  };

  const isRegisterFlow = flow === 'register';

  const handlePasscodeSubmit = async () => {
    if (passcode.length !== 6) return;

    try {
      setIsLoading(true);
      let response;

      if (isRegisterFlow) {
        // Flow đăng ký
        response = await authService.register({
          phoneNumber: phoneNumber as string,
          fullName: fullName as string,
          email: email as string,
          gender: gender as string,
          dateOfBirth: new Date(dateOfBirth as string),
          passcode: passcode
        });

        if (response.success) {
          // After registration, log in automatically
          await login(phoneNumber as string, passcode);
        } else {
          Alert.alert("Lỗi", response.message || "Đăng ký không thành công");
          setPasscode("");
        }
      } else {
        // Flow đăng nhập - use the context login function
        await login(phoneNumber as string, passcode);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server");
      setPasscode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoxPress = () => {
    inputRef.current?.focus();
  };

  const renderPasscodeBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 6; i++) {
      boxes.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.passcodeBox,
            passcode[i] ? styles.passcodeBoxFilled : null
          ]}
          onPress={handleBoxPress}
          activeOpacity={0.7}
        >
          <Text style={styles.passcodeText}>
            {passcode[i] || ""}
          </Text>
        </TouchableOpacity>
      );
    }
    return boxes;
  };

  return (
    <View style={[GLOBAL.container, styles.container]}>
      <Text style={styles.title}>Nhập mã bảo mật</Text>
      <Text style={styles.subtitle}>
        Vui lòng nhập mã 6 số để {isRegisterFlow ? 'đăng ký' : 'đăng nhập'}
      </Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.boxesContainer}
          onPress={handleBoxPress}
          activeOpacity={1}
        >
          {renderPasscodeBoxes()}
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={passcode}
          onChangeText={handlePasscodeChange}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />
      </View>

      <Button
        title={isRegisterFlow ? 'Đăng ký' : 'Đăng nhập'}
        onPress={handlePasscodeSubmit}
        disabled={passcode.length !== 6 || isLoading}
        size="large"
        type="primary"
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

export default EnterPasscode;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLOR.blue_theme,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLOR.grey50,
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  boxesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  passcodeBox: {
    width: 45,
    height: 45,
    borderWidth: 1.5,
    borderColor: COLOR.grey50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.white,
  },
  passcodeBoxFilled: {
    borderColor: COLOR.blue_theme,
    backgroundColor: COLOR.blue95,
  },
  passcodeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLOR.blue_theme,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
});
