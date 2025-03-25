import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

const Order = () => {
  return (
    <View style={[GLOBAL.container, { justifyContent: "space-between" }]}>
      <LinearGradient
        colors={[COLOR.blue70, COLOR.white]}
        style={styles.background}
        locations={[0.25, 0.3]}
      />
      <View>
        <View style={styles.headerView}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity>
              <Image
                source={require("../../assets/images/back.png")}
                style={styles.Image}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Giao hàng</Text>
          </View>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/note.png")}
              style={styles.Image}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.locationPickCard}>
          <Button
            title="Nhà"
            onPress={() => {}}
            type="sub"
            size="large"
            style={[
              styles.locationButton,
              { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
            ]}
            leftImg={require("../../assets/images/origin.png")}
          />
          <Button
            title="Giao đến đâu?"
            onPress={() => {}}
            type="sub"
            size="large"
            style={[
              styles.locationButton,
              { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
            ]}
            leftImg={require("../../assets/images/dest.png")}
          />
        </View>
      </View>
      <Button
        title="Chi tiết đơn hàng"
        size="large"
        type="primary"
        onPress={() => {}}
        style={{ marginVertical: 20 }}
      />
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
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
  },
});
