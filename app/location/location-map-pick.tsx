import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

interface Location {
  latitude: number;
  longitude: number;
}

const LocationMapPick = () => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleMapPress = (event: { nativeEvent: { coordinate: Location } }) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirm = () => {
    if (!selectedLocation) return;
    // Navigate to location-picked with selected location
    router.push({
      pathname: "/location/location-picked",
      params: {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: "Địa điểm đã chọn"
      }
    });
  };

  return (
    <View style={[GLOBAL.container, { padding: 0 }]}>      
      <MapView style={styles.map} onPress={handleMapPress}>
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>

      <View style={styles.footer}>
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
  map: {
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: COLOR.white,
  },
});

export default LocationMapPick;