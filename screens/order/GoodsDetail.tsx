import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

const GoodsDetail = () => {
  const [disabled, setDisabled] = React.useState(true);
  const [selectedSize, setSelectedSize] = React.useState("S");
  const sizes = ["S", "M", "L", "XL"];

  return (
    <View style={[GLOBAL.container, { justifyContent: "space-between" }]}>
      <LinearGradient
        colors={[COLOR.blue70, COLOR.white]}
        style={styles.background}
        locations={[0.08, 0.08]}
      />
      <View>
        <View style={styles.header}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/back.png")}
              style={{ width: 30, height: 30 }}
            ></Image>
          </TouchableOpacity>
          <Text style={styles.title}>Chi tiết món hàng</Text>
        </View>
        <View style={{ paddingVertical: 35 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Chi tiết kích cỡ (dài x rộng x cao)
          </Text>
          <Text style={styles.sizeDetail}>S: 25 x 20 x 20 (cm)</Text>
          <Text style={styles.sizeDetail}>M: 50 x 50 x 45 (cm)</Text>
          <Text style={styles.sizeDetail}>L: 70 x 60 x 60 (cm)</Text>
          <Text style={styles.sizeDetail}>XL: 170 x 120 x 100 (cm)</Text>
        </View>
        <View style={styles.sizePickerView}>
          <View>
            <Text style={styles.subtitle}>
              Kích cỡ<Text style={{ color: COLOR.red55 }}>*</Text>
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {sizes.map((size) => (
                <TouchableOpacity></TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text style={styles.subtitle}>
              Khối lượng<Text style={{ color: COLOR.red55 }}>*</Text>
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{
                  backgroundColor: COLOR.grey90,
                  borderRadius: 8,
                  minWidth: 80,
                  textAlign: "center",
                  fontSize: 16,
                }}
                keyboardType="numeric"
              ></TextInput>
              <Text style={{ fontSize: 16, paddingHorizontal: 5 }}>kg</Text>
            </View>
          </View>
        </View>
        <Button
          title="Thêm ảnh (Không bắt buộc)"
          onPress={() => {}}
          size="large"
          type="sub"
          leftImg={require("../../assets/images/camera.png")}
          style={styles.additionalButton}
        />
      </View>
      <Button
        title="Xác nhận"
        onPress={() => {}}
        size="large"
        type="primary"
        disabled={disabled}
        style={{ marginBottom: 20 }}
      />
    </View>
  );
};
export default GoodsDetail;
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 30,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  sizePickerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  additionalButton: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: COLOR.grey70,
  },
  sizeDetail: {
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
