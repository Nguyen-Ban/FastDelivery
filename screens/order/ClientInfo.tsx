import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

const ClientInfo = () => {
  const [disabled, setDisabled] = React.useState(true);
  return (
    <View style={[GLOBAL.container, { justifyContent: "space-between" }]}>
      <View>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/back.png")}
            style={styles.image}
          ></Image>
        </TouchableOpacity>
        <Text style={styles.title}>Người nhận/gửi</Text>
        <Text style={styles.subtitle}>
          Địa chỉ <Text style={{ color: COLOR.red55 }}>*</Text>
        </Text>
        <View style={styles.address_view}>
          <Text></Text>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/right-arrow.png")}
              style={styles.image}
            ></Image>
          </TouchableOpacity>
        </View>
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
        style={{ marginBottom: 20 }}
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
});
