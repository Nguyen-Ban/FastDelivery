import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { useFonts } from "expo-font";

const HomeScreen = () => {
  const [Cascadia] = useFonts({
    "Cascadia-Bold": require("../../assets/font/CascadiaCode-Bold.ttf"),
  });
  const [name, setName] = React.useState<string>("User");
  const services = [
    { id: "1", name: "Giao hàng", icon: "box" },
    { id: "2", name: "Lịch sử", icon: "sticky-note" },
    { id: "3", name: "Chi tiêu", icon: "chart-simple" },
    { id: "4", name: "Tài xế", icon: "car-on" },
    { id: "5", name: "Trở thành tài xế", icon: "user-plus" },
  ];
  const ads = [
    require("../../assets/ad_1.png"),
    require("../../assets/ad_2.png"),
    require("../../assets/ad_3.png"),
  ];

  type ServiceRoute = "/location" | "/home" | "/driver";

  const getRouteById = (id: string): ServiceRoute => {
    switch (id) {
      case "1":
        return "/location";
      case "4":
        return "/driver";
      default:
        return "/home";
    }
  };

  return (
    <View style={GLOBAL.home_container}>
      <View style={styles.banner}>
        <LinearGradient
          colors={[COLOR.blue70, COLOR.orange70]}
          locations={[0.1, 1]}
          style={styles.gradient}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{ width: 120, height: 120 }}
          />
          <Text
            style={{
              fontSize: 30,
              fontFamily: "Cascadia-Bold",
            }}
          >
            Fast{"\n"}Delivery
          </Text>
        </LinearGradient>
      </View>
      <View style={styles.content_view_1}>
        <Text style={styles.greeting}>
          Xin chào, {"\n"}
          {name}
        </Text>
        <TouchableOpacity style={styles.user_img}>
          <FontAwesome6
            name="user"
            size={25}
            color={COLOR.black}
          ></FontAwesome6>
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        numColumns={4}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.service}
            onPress={() => router.push(getRouteById(item.id))}
          >
            <FontAwesome6
              name={item.icon}
              size={30}
              color={COLOR.black}
            ></FontAwesome6>
            <Text style={styles.service_name}>{item.name}</Text>
          </TouchableOpacity>
        )}
        columnWrapperStyle={{ paddingVertical: 5 }}
        contentContainerStyle={styles.service_view}
      ></FlatList>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        persistentScrollbar={true}
      >
        {ads.map((ad, i) => (
          <TouchableOpacity key={i} onPress={() => {}}>
            <Image source={ad} style={styles.ad} resizeMode="center" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  banner: {
    height: "15%",
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: { fontSize: 30, height: "20%" },
  subtitle: {},
  content_view_1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  greeting: { fontSize: 27 },
  user_img: {
    borderRadius: 45,
    backgroundColor: COLOR.blue95,
    borderColor: COLOR.blue40,
    borderWidth: 1,
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  service_view: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLOR.grey50,
    borderStyle: "dashed",
    marginHorizontal: 16,
  },
  service: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLOR.blue40,
    backgroundColor: COLOR.blue95,
    alignItems: "center",
    paddingVertical: 10,
    width: "22%",
    justifyContent: "space-between",
    marginHorizontal: "1.5%",
  },
  service_name: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    paddingTop: 5,
  },
  scroll_view: {
    alignContent: "center",
  },
  ad: { width: 200, height: 200 },
});
