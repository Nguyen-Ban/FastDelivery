import { Tabs } from "expo-router";
import COLOR from "@/constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLOR.blue_theme,
        tabBarInactiveTintColor: COLOR.grey50,
        tabBarStyle: {
          backgroundColor: COLOR.white,
          borderTopWidth: 1,
          borderTopColor: COLOR.grey90,
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: COLOR.blue_theme,
        },
        headerTintColor: COLOR.white,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Thống kê",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="chart-bar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="drivers"
        options={{
          title: "Tài xế",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="users" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="driver-registers"
        options={{
          title: "Đăng ký",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-plus" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}