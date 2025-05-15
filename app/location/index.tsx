import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";
import { useLocation } from "../../contexts/location.context";

const Order = () => {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const [homeAddress, setHomeAddress] = useState("Nhà");
  const { location } = useLocation();

  useEffect(() => {
    if (location?.address) {
      setHomeAddress(location.address);
    }
  }, [location]);

  // const orderDetailHandler = () => {
  //   router.push("/order/order-detail");
  // };
  const locationHandler = () => {
    router.push({
      pathname: "/location/location-pick",
      params: { type }
    });
  };

  return (
    <View style={[GLOBAL.container, { justifyContent: "space-between" }]}>
      <LinearGradient
        colors={[COLOR.blue70, COLOR.orange70, COLOR.white]}
        style={styles.background}
        locations={[0.05, 0.29, 0.3]}
      />
      <View>
        <View style={styles.headerView}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <FontAwesome6 name="arrow-left" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>
              {type === 'VAN' ? 'Giao hàng xe tải' : 'Giao hàng xe máy'}
            </Text>
          </View>
          <TouchableOpacity>
            <FontAwesome6 name="clipboard" size={25} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.locationPickCard}>
          <Button
            title={homeAddress}
            onPress={locationHandler}
            type="sub"
            size="large"
            style={[
              styles.locationButton,
              { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
            ]}
            textStyle={{ color: COLOR.black }}
            leftImg={
              <FontAwesome6 name="location-dot" size={24} color={COLOR.red55} />
            }
          />
          <Button
            title="Giao đến đâu?"
            onPress={locationHandler}
            type="sub"
            size="large"
            style={[
              styles.locationButton,
              { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
            ]}
            textStyle={{ color: COLOR.black }}
            leftImg={
              <FontAwesome6
                name="location-dot"
                size={24}
                color={COLOR.blue40}
              />
            }
          />
        </View>
      </View>
      {/* <Button
        title="Chi tiết đơn hàng"
        size="large"
        type="primary"
        onPress={() => {
          orderDetailHandler();
        }}
        style={{ marginVertical: 10 }}
      /> */}
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  Image: {
    height: 25,
    width: 25,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 30,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  locationButton: {
    alignItems: "flex-start",
    borderColor: COLOR.white,
    borderRadius: 15,
  },
  locationPickCard: {
    marginVertical: "40%",
    backgroundColor: COLOR.white,
    borderRadius: 15,
    boxShadow: "2px 4px 5px rgba(0, 0, 0, 0.7)",
  },
});
