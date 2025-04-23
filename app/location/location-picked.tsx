import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

const LocationPicked = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const location = {
    latitude: parseFloat(params.latitude as string),
    longitude: parseFloat(params.longitude as string),
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const handleConfirm = () => {
    // Handle form submission
    if (!name || !phone) {
      // Show error
      return;
    }
    // Navigate to next screen with delivery info
    router.push({
      pathname: "/order",
      params: {
        address: params.address,
        name,
        phone,
        note,
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
      <MapView style={styles.map} initialRegion={location}>
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
              style={styles.input}
              placeholder="Tên người nhận"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
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
  noteInput: {
    height: 80,
    textAlignVertical: "top",
  },
});

export default LocationPicked;