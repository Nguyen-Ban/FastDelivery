import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Button from "../../../components/Button/ButtonComponent";
import COLOR from "../../../constants/Colors";
import GLOBAL from "../../../constants/GlobalStyles";

const LocationPicked = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    phone: ""
  });

  const location = {
    latitude: parseFloat(params.latitude as string),
    longitude: parseFloat(params.longitude as string),
    latitudeDelta: 0.001, // Increased zoom level (smaller delta)
    longitudeDelta: 0.001,
  };

  const validatePhone = (phoneNumber: string) => {
    // Regex for standard phone number format (allowing 9-12 digits)
    const phoneRegex = /^0\d{9,11}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      phone: ""
    };

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Họ tên là bắt buộc";
      isValid = false;
    }

    // Validate phone
    if (!phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
      isValid = false;
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirm = () => {
    if (!validateForm()) {
      return;
    }

    // Navigate to next screen with delivery info
    router.push({
      pathname: "/order/order-detail",
      params: {
        address: params.address,
        name,
        phone,
        note,
        type: params.type
      },
    });
  };

  return (
    <View style={[GLOBAL.container, { padding: 0 }]}>
      <LinearGradient
        colors={[COLOR.blue70, COLOR.white]}
        style={styles.background}
        locations={[0.15, 0.25]}
      />
      <MapView
        style={styles.map}
        initialRegion={location}
        zoomEnabled={true}
        scrollEnabled={false}
      >
        <Marker coordinate={location} />
      </MapView>

      <View style={styles.formContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left" size={24} color={COLOR.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Thông tin người nhận</Text>
        </View>

        <View style={styles.addressContainer}>
          <FontAwesome6 name="location-dot" size={20} color={COLOR.blue_theme} />
          <Text style={styles.address} numberOfLines={2}>
            {params.address}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="Họ tên người nhận *"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name && text.trim()) {
                  setErrors({ ...errors, name: "" });
                }
              }}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.phone ? styles.inputError : null]}
              placeholder="Số điện thoại (VD: 0912345678) *"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone && validatePhone(text)) {
                  setErrors({ ...errors, phone: "" });
                }
              }}
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Ghi chú thêm (không bắt buộc)"
              multiline
              numberOfLines={3}
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>

        <Button
          title="Xác nhận"
          onPress={handleConfirm}
          type="primary"
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  map: {
    width: "100%",
    height: "40%",
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLOR.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLOR.blue95,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  address: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLOR.blue_theme,
  },
  form: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.grey90,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: COLOR.red55,
  },
  errorText: {
    color: COLOR.red55,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  noteInput: {
    height: 80,
    textAlignVertical: "top",
  },
});

export default LocationPicked;