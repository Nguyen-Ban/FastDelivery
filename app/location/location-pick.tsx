import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";
import mapService from "../../services/map.service";
import { useLocation } from "../../contexts/location.context";


interface SuggestedLocation {
  id: string;
  title: string;
  address: string;
  distance: number; // in meters
  position: {
    lat: number;
    lng: number;
  }
}

const Location = () => {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const [searchText, setSearchText] = useState("");
  const [suggestedLocations, setSuggestedLocations] = useState<SuggestedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { location } = useLocation();


  const handleSearch = async (text: string) => {
    setSearchText(text);

    if (text.trim().length < 2) {
      setSuggestedLocations([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await mapService.getSuggestPlaces(text, { userLocation: { lat: location?.latitude as number, lng: location?.longitude as number } });
      if (response.success && response.data) {
        setSuggestedLocations(response.data);
      } else {
        setSuggestedLocations([]);
        setError("Không tìm thấy địa điểm");
      }
    } catch (error) {
      console.log("Error fetching suggested locations:", error);
      setError("Có lỗi xảy ra khi tìm kiếm địa điểm");
      setSuggestedLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: SuggestedLocation) => {
    router.push({
      pathname: "/location/location-picked",
      params: {
        address: location.address,
        latitude: location.position.lat.toString(),
        longitude: location.position.lng.toString(),
        type
      },
    });
  };

  // Format distance to km if ≥ 1000m, otherwise show in meters
  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const renderLocationItem = ({
    item,
  }: {
    item: SuggestedLocation;
  }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item)}
    >
      <FontAwesome6 name="location-dot" size={20} color={COLOR.blue_theme} />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.title}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
        {item.distance && (
          <Text style={styles.locationDistance}>{formatDistance(item.distance)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[GLOBAL.container, { padding: 0 }]}>
      <LinearGradient
        colors={[COLOR.blue70, COLOR.orange70, COLOR.white]}
        style={styles.background}
        locations={[0, 0.22, 0.3]}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
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
          {isLoading && (
            <ActivityIndicator size="small" color={COLOR.blue_theme} />
          )}
        </View>
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <FlatList
        data={suggestedLocations}
        renderItem={renderLocationItem}
        keyExtractor={(item) => item.id}
        style={styles.locationList}
        contentContainerStyle={styles.locationListContent}
        ListEmptyComponent={
          !isLoading && searchText.length > 1 ? (
            <Text style={styles.noResultsText}>
              Không tìm thấy địa điểm nào
            </Text>
          ) : null
        }
      />

      <View style={styles.footer}>
        <Button
          title="Chọn trên bản đồ"
          onPress={() => router.push({
            pathname: "/location/location-map-pick",
            params: { type }
          })}
          type="primary"
          size="large"
          leftImg={
            <FontAwesome6
              name="map-location-dot"
              size={24}
              color={COLOR.white}
            />
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
    flexDirection: "row",
    alignItems: "center",
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
    paddingHorizontal: 16,
    marginTop: 16,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    fontWeight: "600",
    color: COLOR.blue_theme,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: COLOR.grey50,
  },
  locationDistance: {
    fontSize: 12,
    color: COLOR.grey50,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: COLOR.white,
  },
  errorText: {
    color: COLOR.red55,
    textAlign: "center",
    padding: 16,
  },
  noResultsText: {
    textAlign: "center",
    padding: 16,
    color: COLOR.grey50,
  },
});
