import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

import GLOBAL from "../../constants/GlobalStyles";

const Driver = () => {
  const [online, setOnline] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10.7769,
          longitude: 106.7009,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 10.7769, longitude: 106.7009 }}
          title="Vị trí hiện tại"
        />
      </MapView>

      {/* Header with menu and profile buttons */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Action buttons on map */}
      <View style={styles.mapButtons}>
        <TouchableOpacity style={styles.mapButton}>
          <Ionicons name="locate" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapButton}>
          <Ionicons name="refresh" size={24} color="#333" />
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
          onPress={() => setOnline(!online)}
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
          <Ionicons name="location" size={22} color="#666" />
          <Text style={styles.navText}>Chọn điểm đến</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="bolt" size={22} color="#666" />
          <Text style={styles.navText}>Tự động nhận đơn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
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
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
    color: '#666',
  },
});

export default Driver;