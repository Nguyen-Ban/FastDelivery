import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../../../components/Button/ButtonComponent";
import InfoCard from "../../../components/InfoCard";
import EventCard from "../../../components/EventCard";
import COLOR from "../../../constants/Colors";
import GLOBAL from "../../../constants/GlobalStyles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { router, useFocusEffect } from "expo-router";
import { Order } from "@/types";
import orderService from "@/services/order.service";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'IN_DELIVERY':
      return COLOR.orange50;
    case 'DELIVERED':
      return COLOR.green40;
    case 'CANCELLED':
      return COLOR.red55;
    default:
      return COLOR.blue70;
  }
};

interface Activity {
  id: string;
  time: Date;
  status: string;
  vehicleType: string;
  deliveryType: string;
  pickupAddress: string;
  dropoffAddress: string;
  price: number;

}

const Activity = () => {
  const [deliveries, setDeliveries] = useState<Activity[]>([])

  useFocusEffect(
    useCallback(() => {
      const fetchDeliveries = async () => {
        const res = await orderService.getCustomerOrderList();
        if (res.success) {
          setDeliveries(res.data);
        }
      };
      fetchDeliveries();
    }, [])
  );


  return (
    <View style={GLOBAL.home_container}>
      <View style={styles.header}>
        <LinearGradient
          colors={[COLOR.blue70, COLOR.orange70]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.title}>Hoạt động</Text>
        </LinearGradient>
      </View>
      {deliveries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn chưa có hoạt động nào</Text>
        </View>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              amount={item.price.toLocaleString() + "đ"}
              date={new Date(item.time).toLocaleDateString('vi-VN')}
              time={new Date(item.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              vehicleType={item.vehicleType || "MOTORCYCLE"}
              pickup={item.pickupAddress || ""}
              dropoff={item.dropoffAddress || ""}
              status={item.status || "PENDING"}
              statusColor={getStatusColor(item.status)}
              onPress={() => {
                router.push({
                  pathname: "/customer/user/event-detail",
                  params: {
                    id: item.id,
                  }
                });
              }}
              container_style={{ paddingBottom: 10 }}
            />
          )}
          style={{
            marginVertical: 5,
            paddingHorizontal: 15,
          }}
        />
      )}
    </View>
  );
};

export default Activity;

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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
