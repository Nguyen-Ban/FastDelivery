import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

const AccountScreen = () => {
  const handleLogout = () => {
    // TODO: Implement logout logic
    router.replace("/authentication/auth-method");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="user-circle" size={80} color={COLOR.blue_theme} />
        <Text style={styles.name}>Admin</Text>
        <Text style={styles.email}>admin@fastdelivery.com</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome5 name="user-edit" size={24} color={COLOR.blue_theme} />
          <Text style={styles.menuText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome5 name="key" size={24} color={COLOR.blue_theme} />
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={24} color={COLOR.red_admin} />
          <Text style={[styles.menuText, { color: COLOR.red_admin }]}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountScreen;

const COLOR = {
  blue_theme: "#2089dc",
  red_admin: "#dc3545",
  white: "#ffffff",
  black: "#000000",
  grey90: "#e1e1e1",
  grey50: "#7f7f7f"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.grey90,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    color: COLOR.black,
  },
  email: {
    fontSize: 16,
    color: COLOR.grey50,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.grey90,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: COLOR.black,
  },
});