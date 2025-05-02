import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
} from "react-native";

import GLOBAL from "../../constants/GlobalStyles";
import COLOR from "../../constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import Button from "../../components/Button/ButtonComponent";
import { Fontisto } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const router = useRouter();

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
          <Text style={styles.title}>Thông tin người dùng</Text>
        </LinearGradient>
      </View>
      <View style={styles.button_group}>
        <View style={styles.content_container}>
          <Button
            title="Đăng xuất"
            onPress={() => router.replace("/authentication/auth-method")}
            size="medium"
            type="sub"
            textStyle={{ fontSize: 16 }}
          />
          <Button
            title="Đổi mật khẩu"
            onPress={() => router.push("/user/change-password")}
            size="medium"
            type="sub"
            textStyle={{ fontSize: 16 }}
          />
        </View>
        <Button
          title="Cập nhật thông tin"
          onPress={() => router.push("/home")}
          size="large"
          type="primary"
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

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
  content_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  button_group: {
    padding: 16,
    flex: 1,
    justifyContent: "flex-end",
  },
});
