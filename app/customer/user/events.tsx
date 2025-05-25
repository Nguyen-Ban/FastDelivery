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

import GLOBAL from "../../../constants/GlobalStyles";
import COLOR from "../../../constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import EventCard from "@/components/EventCard";

const { width } = Dimensions.get("window");

const EventsScreen = () => {
  const deliveries = [
    {
      date: "03/04/2024",
      items: [
        {
          amount: "56.000đ",
          time: "15:13",
          vehicleType: "MOTORCYCLE",
          packageType: "Bưu kiện nhỏ",
          pickup: "300/23/21 Nguyễn Văn Linh P.Bình Thuận",
          dropoff: "Morin Milk Tea - Coffee 64/20 Võ Oanh",
          status: "Hoàn thành",
        },
        {
          amount: "20.000đ",
          time: "14:38",
          vehicleType: "MOTORCYCLE",
          packageType: "Bưu kiện nhỏ",
          pickup: "Eddie's New York Deli & Diner",
          dropoff: "Chung Cư Khánh Hội 3",
          status: "Hoàn thành",
        },
        {
          amount: "48.000đ",
          time: "14:02",
          vehicleType: "CAR",
          packageType: "Bưu kiện vừa",
          pickup: "6 Tân Trào 6 Tan Trao St.",
          dropoff: "140 Nguyễn Văn Thủ P.Da Kao",
          status: "Hoàn thành",
        },
        {
          amount: "20.000đ",
          time: "13:44",
          vehicleType: "MOTORCYCLE",
          packageType: "Bưu kiện nhỏ",
          pickup: "Q7 Saigon Riverside Complex - Cổng Chính D...",
          dropoff: "GO! Nguyễn Thị Thập - Cổng Phụ 99 Nguyen...",
          status: "Hoàn thành",
        },
        {
          amount: "35.000đ",
          time: "15:30",
          vehicleType: "MOTORCYCLE",
          packageType: "Bưu kiện nhỏ",
          pickup: "Sample Address",
          dropoff: "Sample Destination",
          status: "Bị hủy",
        },
      ],
    },
    {
      date: "04/04/2024",
      items: [
        {
          amount: "35.000đ",
          time: "15:30",
          vehicleType: "MOTORCYCLE",
          packageType: "Bưu kiện nhỏ",
          pickup: "Sample Address",
          dropoff: "Sample Destination",
          status: "Hoàn thành",
        },
      ],
    },
    {
      date: "04/05/2025",
      items: [
        {
          amount: "35.000đ",
          time: "15:30",
          vehicleType: "MOTORCYCLE",
          packageType: "Bưu kiện nhỏ",
          pickup: "Sample Address",
          dropoff: "Sample Destination",
          status: "Đang giao hàng",
        },
      ],
    },
  ];
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
          <Text style={styles.title}>Lịch sử</Text>
        </LinearGradient>
      </View>
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <FlatList
            data={item.items}
            keyExtractor={(item) => item.time}
            renderItem={({ item: details }) => (
              <EventCard
                amount={details.amount}
                date={item.date}
                time={details.time}
                vehicleType={details.vehicleType}
                pickup={details.pickup}
                dropoff={details.dropoff}
                status={details.status}
                onPress={() => {
                  router.push("/user/event-detail");
                }}
                container_style={{ paddingBottom: 10 }}
              ></EventCard>
            )}
          ></FlatList>
        )}
        style={{
          marginVertical: 5,
          paddingHorizontal: 15,
        }}
      ></FlatList>
    </View>
  );
};

export default EventsScreen;

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
});
