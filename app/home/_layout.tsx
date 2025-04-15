import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import COLOR from "@/constants/Colors";

const HomeLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabs,
        tabBarLabelStyle: { fontSize: 12, marginVertical: "auto" },
        tabBarInactiveTintColor: COLOR.black,
        tabBarActiveTintColor: COLOR.blue40,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? COLOR.blue40 : COLOR.black;
            return <FontAwesome6 name="house" size={24} color={iconColor} />;
          },
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Hoạt động",
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? COLOR.blue40 : COLOR.black;
            return (
              <FontAwesome6 name="clipboard" size={24} color={iconColor} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Thông báo",
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? COLOR.blue40 : COLOR.black;
            return <FontAwesome6 name="bell" size={24} color={iconColor} />;
          },
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Tin nhắn",
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? COLOR.blue40 : COLOR.black;
            return <FontAwesome6 name="envelope" size={24} color={iconColor} />;
          },
        }}
      />
    </Tabs>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: COLOR.grey90,
    height: "8%",
  },
});
