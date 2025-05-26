import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  fullName?: string;
  email?: string;
  // Add other user properties if needed
};

const AccountScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
  const loadUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("user");
      console.log("Dữ liệu userInfo:", userInfoString); // 👈 in ra kiểm tra
      if (userInfoString) {
        const userData = JSON.parse(userInfoString);
        setUser(userData);
      }
    } catch (error) {
      console.error("Lỗi khi lấy userInfo:", error);
    }
  };

  loadUserInfo();
}, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("user");
      router.push("/authentication/auth-method");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <FontAwesome5 name="user-circle" size={60} color="#00BFA5" />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.fullName || '...'}</Text>
            <Text style={styles.email}>{user?.email || '...'}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuItems}>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome5 name="user-edit" size={24} color="#333" />
            <Text style={styles.menuItemText}>Chỉnh sửa thông tin</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome5 name="key" size={24} color="#333" />
            <Text style={styles.menuItemText}>Đổi mật khẩu</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="#333" />
            <Text style={styles.menuItemText}>Cài đặt</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#333" />
            <Text style={styles.menuItemText}>Trợ giúp</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <FontAwesome5 name="sign-out-alt" size={24} color="#FF6B6B" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Đăng xuất</Text>
            <Ionicons name="chevron-forward" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <Text style={styles.version}>Phiên bản 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#666666",
  },
  menuItems: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  logoutItem: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  logoutText: {
    color: "#FF6B6B",
    fontWeight: "500",
  },
  version: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});