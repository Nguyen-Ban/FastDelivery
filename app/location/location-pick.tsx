import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

const SAMPLE_LOCATIONS = [
  {
    id: '1',
    name: 'Công viên Hòa Bình',
    address: 'Đường Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    latitude: '21.046459',
    longitude: '105.791688'
  },
  {
    id: '2',
    name: 'The Dewey Schools',
    address: 'Tây Hồ Tây, Hà Nội',
    latitude: '21.045789',
    longitude: '105.792567'
  },
  {
    id: '3',
    name: 'Khu đô thị Resco',
    address: 'Đường Trần Cung, Cổ Nhuế, Từ Liêm, Hà Nội',
    latitude: '21.047123',
    longitude: '105.790345'
  },
]

const Location = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(SAMPLE_LOCATIONS);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = SAMPLE_LOCATIONS.filter(location =>
      location.name.toLowerCase().includes(text.toLowerCase()) ||
      location.address.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const handleLocationSelect = (location: typeof SAMPLE_LOCATIONS[0]) => {
    router.push({
      pathname: '/location/location-picked',
      params: {
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude
      }
    });
  };

  const renderLocationItem = ({ item }: { item: typeof SAMPLE_LOCATIONS[0] }) => (
    <TouchableOpacity 
      style={styles.locationItem} 
      onPress={() => handleLocationSelect(item)}
    >
      <FontAwesome6 name="location-dot" size={20} color={COLOR.blue_theme} />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[GLOBAL.container, { padding: 0 }]}>
      <LinearGradient
        colors={[COLOR.blue70, COLOR.white]}
        style={styles.background}
        locations={[0.15, 0.25]}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={24} color={COLOR.black} />
        </TouchableOpacity>
        <Text style={styles.label}>Chọn địa điểm</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputView}>
          <FontAwesome6
            name="location-dot"
            size={20}
            color={COLOR.grey50}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm địa điểm"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredLocations}
        renderItem={renderLocationItem}
        keyExtractor={item => item.id}
        style={styles.locationList}
        contentContainerStyle={styles.locationListContent}
      />

      <View style={styles.footer}>
        <Button
          title="Chọn trên bản đồ"
          onPress={() => router.push('/location/location-map-pick')}
          type="primary"
          size="large"
          leftImg={
            <FontAwesome6 name="map-location-dot" size={24} color={COLOR.white} />
          }
        />
      </View>
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  searchContainer: {
    padding: 16,
    paddingTop: 0,
  },
  searchInputView: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: COLOR.grey90,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 45,
  },
  locationList: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  locationListContent: {
    padding: 16,
    paddingTop: 0,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLOR.blue95,
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.blue_theme,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: COLOR.grey50,
  },
  footer: {
    padding: 16,
    backgroundColor: COLOR.white,
  },
});
