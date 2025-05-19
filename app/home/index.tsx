import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { useFonts } from "expo-font";
import { useAuth } from "../../contexts/auth.context";
import { useLocation } from "../../contexts/location.context";
import driverService from "../../services/driver.service";

const HomeScreen = () => {
  const [Cascadia] = useFonts({
    "Cascadia-Bold": require("../../assets/font/CascadiaCode-Bold.ttf"),
  });
  const { user } = useAuth();
  const {
    hasLocationPermission,
    requestLocationPermission,
    isLoading,
    error,
    location,
    getCurrentLocation
  } = useLocation();
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);

  // Check location permission when component mounts
  useEffect(() => {
    // console.log('HomeScreen - Current location data:', location);
    // console.log('HomeScreen - Location permission status:', hasLocationPermission);

    const checkLocationPermission = async () => {
      if (hasLocationPermission && !location) {
        // console.log('HomeScreen - Permission granted but no location, getting current location');
        const currentLocation = await getCurrentLocation();
        // console.log('HomeScreen - Fetched current location:', currentLocation);
      }

      if (!hasLocationPermission) {
        // console.log('HomeScreen - No location permission, showing modal');
        setPermissionModalVisible(true);
      }
    };

    checkLocationPermission();
  }, [hasLocationPermission, location]);

  const handleRequestPermission = async () => {
    // console.log('HomeScreen - Requesting location permission');
    const granted = await requestLocationPermission();
    // console.log('HomeScreen - Permission granted:', granted);

    if (granted) {
      setPermissionModalVisible(false);
    } else {
      Alert.alert(
        "Cần quyền truy cập vị trí",
        "Ứng dụng cần quyền truy cập vị trí để hiển thị các dịch vụ gần bạn. Vui lòng cấp quyền trong cài đặt thiết bị của bạn.",
        [
          { text: "Để sau", onPress: () => setPermissionModalVisible(false) },
          { text: "OK", onPress: () => setPermissionModalVisible(false) }
        ]
      );
    }
  };

  const handleDriverMode = async () => {
    try {
      const response = await driverService.checkRegistered();
      if (response.success) {
        router.push('/driver');
      } else {
        router.push('/driver/register');
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Lỗi', 'Không thể kiểm tra trạng thái tài xế. Vui lòng thử lại sau.');
    }
  };

  const services = [
    { id: "1", name: "Giao xe máy", icon: "motorcycle", type: "MOTORBIKE" },
    { id: "6", name: "Giao xe tải", icon: "truck", type: "VAN" },
    { id: "2", name: "Lịch sử", icon: "sticky-note" },
    { id: "3", name: "Chi tiêu", icon: "chart-simple" },
    { id: "7", name: "Chế độ tài xế", icon: "car-side" },
  ];
  const ads = [
    require("../../assets/ad_1.png"),
    require("../../assets/ad_2.png"),
    require("../../assets/ad_3.png"),
  ];

  const [selectedDeliveryType, setSelectedDeliveryType] = useState<'MOTORBIKE' | 'VAN' | null>(null);

  const handleDeliverySelection = (type: 'MOTORBIKE' | 'VAN') => {
    setSelectedDeliveryType(type);
    // Store the selected type in AsyncStorage for persistence
    AsyncStorage.setItem('selectedDeliveryType', type);
    router.push({
      pathname: '/order/location',
      params: { type }
    });
  };

  type ServiceRoute =
    | "/order/location"
    | "/home"
    | "/driver"
    | "/user/spending"
    | "/user/events"
    | "/driver/register";

  const getRouteById = (id: string): ServiceRoute | (() => void) => {
    switch (id) {
      case "1":
        return () => handleDeliverySelection('MOTORBIKE');
      case "6":
        return () => handleDeliverySelection('VAN');
      case "2":
        return "/user/events";
      case "3":
        return "/user/spending";
      case "7":
        return () => handleDriverMode();
      default:
        return "/home";
    }
  };

  // Function to directly check location in AsyncStorage
  const checkAsyncStorageLocation = async () => {
    try {
      const locationJson = await AsyncStorage.getItem('userLocation');
      // console.log('AsyncStorage userLocation:', locationJson);
      if (locationJson) {
        const locationData = JSON.parse(locationJson);
        Alert.alert(
          "Location in AsyncStorage",
          `Latitude: ${locationData.latitude}\nLongitude: ${locationData.longitude}`
        );
      } else {
        Alert.alert("No Location Found", "No location data found in AsyncStorage");
      }
    } catch (err) {
      console.error('Error reading from AsyncStorage:', err);
      Alert.alert("Error", "Failed to read location from AsyncStorage");
    }
  };

  return (
    <View style={GLOBAL.home_container}>
      <View style={styles.banner}>
        <LinearGradient
          colors={[COLOR.blue70, COLOR.orange70]}
          locations={[0.1, 1]}
          style={styles.gradient}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{ width: 120, height: 120 }}
          />
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            Fast{"\n"}Delivery
          </Text>
        </LinearGradient>
      </View>
      <View style={styles.content_view_1}>
        <Text style={styles.greeting}>
          Xin chào,{"\n"}
          {user?.fullName || "User"}
        </Text>
        <TouchableOpacity
          style={styles.user_img}
          onPress={() => router.push("/user/profile")}
        >
          <FontAwesome6
            name="user"
            size={25}
            color={COLOR.black}
          ></FontAwesome6>
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        numColumns={4}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.service,
              item.type && selectedDeliveryType === item.type && styles.selectedService
            ]}
            onPress={() => {
              const route = getRouteById(item.id);
              if (typeof route === 'function') {
                route();
              } else {
                router.push(route);
              }
            }}
          >
            <FontAwesome6
              name={item.icon}
              size={30}
              color={COLOR.black}
            ></FontAwesome6>
            <Text style={styles.service_name}>{item.name}</Text>
          </TouchableOpacity>
        )}
        columnWrapperStyle={{ paddingVertical: 5 }}
        contentContainerStyle={styles.service_view}
      ></FlatList>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        persistentScrollbar={true}
      >
        {ads.map((ad, i) => (
          <TouchableOpacity key={i} onPress={() => { }}>
            <Image source={ad} style={styles.ad} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Location Permission Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={permissionModalVisible}
        onRequestClose={() => setPermissionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <FontAwesome6 name="location-dot" size={28} color={COLOR.blue40} />
              <Text style={styles.modalTitle}>Truy cập vị trí</Text>
            </View>
            <Text style={styles.modalText}>
              Fast Delivery cần truy cập vị trí của bạn để hiển thị các dịch vụ giao hàng gần bạn.
            </Text>
            <View style={styles.modalButtonContainer}>
              <Button
                title="Để sau"
                onPress={() => setPermissionModalVisible(false)}
                size="medium"
                type="sub"
              />
              <Button
                title="Cho phép"
                onPress={handleRequestPermission}
                size="medium"
                type="primary"
              />
            </View>
            {isLoading && (
              <ActivityIndicator
                size="large"
                color={COLOR.blue40}
                style={styles.loader}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  banner: {
    height: "15%",
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: { fontSize: 30, height: "20%" },
  subtitle: {},
  content_view_1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  greeting: { fontSize: 27 },
  user_img: {
    borderRadius: 45,
    backgroundColor: COLOR.blue95,
    borderColor: COLOR.blue40,
    borderWidth: 1,
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  service_view: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLOR.grey50,
    borderStyle: "dashed",
    marginHorizontal: 16,
  },
  service: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLOR.blue40,
    backgroundColor: COLOR.blue95,
    alignItems: "center",
    paddingVertical: 10,
    width: "22%",
    justifyContent: "space-between",
    marginHorizontal: "1.5%",
  },
  service_name: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    paddingTop: 5,
  },
  scroll_view: {
    alignContent: "center",
  },
  ad: { width: 200, height: 200, borderRadius: 8, marginHorizontal: 5 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loader: {
    marginTop: 20,
  },
  selectedService: {
    backgroundColor: COLOR.blue70,
    borderWidth: 2,
  },
});
