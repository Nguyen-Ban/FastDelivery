import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";

import { useLocation } from "../../contexts/location.context";
import { useAuth } from "../../contexts/auth.context";
import socketDriverService from "../../services/socket.driver";
import socket from "@/services/socket";
import { ROLE } from "@/types";

const Driver = () => {
  const { location, getCurrentLocation } = useLocation();
  const { user } = useAuth();
  const [online, setOnline] = useState(false);
  const [hasOrder, setHasOrder] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isOrderVisible, setIsOrderVisible] = useState(false);
  const [autoReceive, setAutoReceive] = useState(false);
  const router = useRouter();
  const mapRef = useRef<MapView>(null);


  const locationUpdateInterval = useRef<NodeJS.Timeout>();

  // Display Menu Text
  const [isMenuTextVisible, setIsMenuTextVisible] = useState(false);


  // Effect to handle location updates when online
  useEffect(() => {
    console.log('Location update effect:', online, location);
    if (!online) {
      console.log('Not online, skipping location updates');
      return;
    }

    const interval = setInterval(() => {
      if (!location || !online) return;

      socket.emit("location:update", {
        lat: location.coord?.lat,
        lng: location.coord?.lng,
      });
      console.log('Sending location update:', {
        lat: location.coord?.lat,
        lng: location.coord?.lng
      });

    }, 3000); // mỗi 5s

    return () => clearInterval(interval);

  }, [online, location]);

  useEffect(() => {
    if (!online) return;
    socket.on('order:new', (response) => {
      console.log('New order received:', response);
      setHasOrder(true);
    });
    return () => {
      socket.off('order:new');
    }
  }, [online]);

  const handleLocatePress = async () => {
    console.log('handleLocatePress');
    const currentLocation = await getCurrentLocation();
    console.log('currentLocation', currentLocation);
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.coord?.lat as number,
        longitude: currentLocation.coord?.lng as number,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      }, 500);
    }
  };

  const handleOnlineStatusChange = async () => {
    if (!user?.id) {
      Alert.alert('Lỗi', 'Không thể xác thực người dùng');
      return;
    }
    console.log('handleOnlineStatusChange');

    const newStatus = !online;
    setOnline(newStatus);

    if (newStatus) {
      try {
        // Go online
        await socket.connect(ROLE.DRIVER);
      } catch (error) {
        console.error('Error connecting to socket:', error);
        Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
        setOnline(false); // Reset online status if connection fails
      }
    } else {
      socket.disconnect();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Map View */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.coord?.lat || 10.7769,
          longitude: location?.coord?.lng || 106.7009,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}

      >
        {location && (
          <Marker
            coordinate={{ latitude: location.coord?.lat as number, longitude: location.coord?.lng as number }}
            title="Vị trí hiện tại"
          />
        )}
      </MapView>

      {/* Header with menu and profile buttons */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/driver/menu")}
          onLongPress={() => setIsMenuTextVisible(true)}
          onPressOut={() => setIsMenuTextVisible(false)}
        >
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Hiển thị văn bản "Menu" khi nhấn giữ */}
      {isMenuTextVisible && (
        <Text style={styles.floatingText}>Menu</Text>
      )}

      {/* Calendar Button with Notification */}
      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => {
          router.push("/driver/order/available-order")
          setHasOrder(false); // Reset order Notification}
        }}
      >
        <View style={styles.calendarIconContainer}>
          <MaterialIcons name="event-note" size={24} color="#333" />
          {hasOrder ? <View style={styles.notificationBadge} /> : null}
        </View>
      </TouchableOpacity>

      {/* Action buttons on map */}
      <View style={styles.mapButtons}>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={handleLocatePress}
        >
          <Ionicons name="locate" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Status indicator */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, online ? styles.statusOnline : styles.statusOffline]}>
          <Text style={styles.statusText}>
            {online ? "Đang hoạt động" : "Đang ngoại tuyến"}
          </Text>
        </View>
      </View>

      {/* Bottom action button */}
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleOnlineStatusChange}
        >
          <Ionicons name="power" size={24} color="white" />
          <Text style={styles.actionButtonText}>
            {online ? "Kết thúc" : "Mở nhận chuyến"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5 name="motorcycle" size={22} color="#00a651" />
          <Text style={styles.navText}>Dịch vụ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5 name="map-marker-alt" size={20} color="#00a651" />
          <Text style={styles.navText}>Chọn điểm đến</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setAutoReceive(!autoReceive)}
        >
          <MaterialIcons name="bolt" size={22} color={autoReceive ? "#00a651" : "#666"} />
          <Text style={[styles.navText, autoReceive && { color: "#00a651" }]}>Tự động nhận đơn</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/driver/menu/delivery-settings")}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="#666" />
          <Text style={styles.navText}>Cài đặt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
  },
  menuButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  calendarIconContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#e74c3c',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  mapButtons: {
    position: 'absolute',
    right: 20,
    bottom: 200,
    alignItems: 'center',
  },
  mapButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 150,
    width: '100%',
    alignItems: 'center',
  },
  statusIndicator: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusOnline: {
    backgroundColor: '#00a651',
  },
  statusOffline: {
    backgroundColor: '#e74c3c',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 90,
    width: '100%',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
  },
  earningsTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#00BFA5',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // For Menu Text
  floatingText: {
    position: "absolute",
    top: 20, // Điều chỉnh vị trí theo nhu cầu
    left: 50, // Điều chỉnh vị trí theo nhu cầu
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: 5,
    borderRadius: 5,
    fontSize: 14,
    zIndex: 10,
  },
});

export default Driver;