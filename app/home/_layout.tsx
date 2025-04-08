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
        tabBarLabelStyle: { fontSize: 13 },
        tabBarInactiveTintColor: COLOR.black,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: () => {
            return <FontAwesome6 name="house" size={24} color="black" />;
          },
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Hoạt động",
          tabBarIcon: () => {
            return <FontAwesome6 name="clipboard" size={24} color="black" />;
          },
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Tin nhắn",
          tabBarIcon: () => {
            return <FontAwesome6 name="envelope" size={24} color="black" />;
          },
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Thông báo",
          tabBarIcon: () => {
            return <FontAwesome6 name="bell" size={24} color="black" />;
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
    height: "7%",
  },
});
