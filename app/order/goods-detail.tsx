import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const GoodsDetail = () => {
  const [disabled, setDisabled] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState<string | undefined>();
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "1", // acts as primary key, should be unique and non-empty string
        label: "S",
        value: "S",
      },
      {
        id: "2",
        label: "M",
        value: "M",
      },
      {
        id: "3",
        label: "L",
        value: "L",
      },
    ],
    []
  );

  const router = useRouter();

  return (
    <View style={[GLOBAL.container, { justifyContent: "space-between" }]}>
      <LinearGradient
        colors={[COLOR.blue70, COLOR.white]}
        style={styles.background}
        locations={[0.08, 0.08]}
      />
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome6 name="arrow-left" size={30} color="black" />
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
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <RadioGroup
                radioButtons={radioButtons}
                onPress={setSelectedId}
                selectedId={selectedId}
                layout="column"
                containerStyle={{
                  alignItems: "flex-start",
                }}
                labelStyle={{
                  fontSize: 16,
                  fontWeight: "bold",
                  paddingVertical: 10,
                }}
              />
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
                  width: 80,
                  height: 40,
                  textAlign: "left",
                  paddingHorizontal: 10,
                  marginVertical: 5,
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
          leftImg={
            <FontAwesome6
              name="camera"
              size={25}
              color="black"
              style={{ paddingHorizontal: 5 }}
            />
          }
          style={styles.additionalButton}
        />
      </View>
      <Button
        title="Xác nhận"
        onPress={() => {
          router.back();
        }}
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
    alignItems: "flex-start",
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
