import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

const Location = () => {
  const router = useRouter();

  return (
    <View style={[GLOBAL.container, { justifyContent: "space-between" }]}>
      <LinearGradient
        colors={[COLOR.blue70, COLOR.white]}
        style={styles.background}
        locations={[0.15, 0.25]}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.label}>Chọn địa điểm</Text>
        <View style={styles.locationInputView}>
          <Ionicons
            name="location"
            size={25}
            color="black"
            style={{ paddingHorizontal: 10 }}
          />
          <TextInput
            style={styles.locationInput}
            placeholder="Nhập địa chỉ"
          ></TextInput>
        </View>
      </View>
      <Button
        title="Chọn trên bản đồ"
        onPress={() => {}}
        type="primary"
        size="large"
        leftImg={
          <FontAwesome6 name="map-location-dot" size={25} color="black" />
        }
      />
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 15,
  },
  locationInputView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 8,
    backgroundColor: COLOR.grey90,
    marginVertical: "20%",
    width: "100%",
  },
  small_icon: {
    width: 25,
    height: 25,
    marginHorizontal: 10,
  },
  locationInput: {
    fontSize: 16,
    height: 50,
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
