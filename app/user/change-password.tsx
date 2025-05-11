import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Text,
  Dimensions,
} from "react-native";

import GLOBAL from "../../constants/GlobalStyles";
import COLOR from "../../constants/Colors";
import Button from "../../components/Button/ButtonComponent";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const ChangePasswordScreen = () => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

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
        <TextInput style={styles.text_input} keyboardType="numeric"></TextInput>
      </View>
      <View style={styles.content_view}>
        <Text style={styles.label}>Nhập mật khẩu mới (6 chữ số)</Text>
        <TextInput style={styles.text_input} keyboardType="numeric"></TextInput>
      </View>
      <View style={styles.content_view}>
        <Text style={styles.label}>Nhập lại mật khẩu mới </Text>
        <TextInput style={styles.text_input} keyboardType="numeric"></TextInput>
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end", padding: 16 }}>
        <Button
          title="Đổi mật khẩu"
          size="large"
          type="primary"
          onPress={() => {
            router.back();
          }}
        />
      </View>
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
  label: { fontSize: 16 },
  text_input: {
    backgroundColor: COLOR.grey90,
    fontSize: 16,
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLOR.grey70,
  },
});
