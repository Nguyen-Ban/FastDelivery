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

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

const ClientInfo = () => {
  const router = useRouter();
  const [disabled, setDisabled] = React.useState(true);
  return (
    <View style={[GLOBAL.container, { justifyContent: "space-between" }]}>
      <LinearGradient
        colors={[COLOR.blue70, COLOR.white]}
        style={styles.background}
        locations={[0.1, 0.2]}
      />
      <View>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <FontAwesome6 name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Người nhận/gửi</Text>
        <Text style={styles.subtitle}>
          Địa chỉ <Text style={{ color: COLOR.red55 }}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.address_view}
          onPress={() => {
            router.push("/location/location-pick");
          }}
        >
          <Text></Text>
          <FontAwesome6 name="angle-right" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.subtitle}>Số tầng, số tòa nhà</Text>
        <TextInput style={styles.text_input}></TextInput>
        <Text style={styles.subtitle}>
          Tên người liên lạc <Text style={{ color: COLOR.red55 }}>*</Text>
        </Text>
        <TextInput style={styles.text_input}></TextInput>
        <Text style={styles.subtitle}>
          Số điện thoại <Text style={{ color: COLOR.red55 }}>*</Text>
        </Text>
        <TextInput style={styles.text_input}></TextInput>
        <Text style={styles.subtitle}>Ghi chú cho tài xế</Text>
        <TextInput style={styles.text_input}></TextInput>
        <View></View>
      </View>
      <Button
        title="Xác nhận"
        onPress={() => {}}
        type="primary"
        size="large"
        disabled={disabled}
        style={{ marginBottom: 10 }}
      />
    </View>
  );
};

export default ClientInfo;

const styles = StyleSheet.create({
  image: {
    width: 25,
    height: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 16,
  },
  subtitle: {
    fontSize: 12,
    paddingVertical: 10,
  },
  text_input: {
    height: 50,
    backgroundColor: COLOR.grey90,
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  address_view: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    backgroundColor: COLOR.grey90,
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
