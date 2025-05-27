import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import MapView, { Marker, Region, Circle } from "react-native-maps";
import { useRouter, useLocalSearchParams } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Button from "../../../../components/Button/ButtonComponent";
import COLOR from "../../../../constants/Colors";
import GLOBAL from "../../../../constants/GlobalStyles";
import { useLocation } from "../../../../contexts/location.context";
import mapService from "../../../../services/map.service";
import { useOrder } from "../../../../contexts/order.context";
import { MapLocation } from "@/types";

interface Location {
  latitude: number;
  longitude: number;
}



const LocationMapPick = () => {
  const router = useRouter();
  const { orderType, locationType } = useLocalSearchParams();
  const { location } = useLocation();
  const { setPickupLocation, setDropoffLocation } = useOrder();
  const mapRef = useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [places, setPlaces] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: location?.coord?.lat as number,//21.03835308269753,
    longitude: location?.coord?.lng as number,//105.78267549063561,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Fetch nearby places when component mounts or location changes
  useEffect(() => {
    if (location && location.coord) {
      const newLocation = {
        latitude: location.coord.lat,
        longitude: location.coord.lng,
      };
      setSelectedLocation(newLocation);
      fetchNearbyPlaces(location.coord.lng, location.coord.lat);
    }
  }, [location]);

  // Animate to region when component mounts
  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          ...region,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        }, 500);
      }, 100);
    }
  }, [selectedLocation]);

  const fetchNearbyPlaces = async (lng: number, lat: number) => {
    setLoading(true);
    try {
      const response = await mapService.fetchLocationFromCoord({ lng, lat });
      if (response.success && response.data) {
        setPlaces(response.data);
      }
    } catch (error) {
      console.log("Error fetching nearby places:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = (event: { nativeEvent: { coordinate: Location } }) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    fetchNearbyPlaces(longitude, latitude);
  };

  const handlePlaceSelect = (place: MapLocation) => {
    const newLocation = {
      latitude: place.coord.lat,
      longitude: place.coord.lng
    };
    setSelectedLocation(newLocation);

    // Animate map to the selected location
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...region,
        latitude: place.coord.lat,
        longitude: place.coord.lng
      }, 300);
    }
  };

  const handleConfirm = () => {
    if (!selectedLocation) return;

    // Find the selected place from places array
    const selectedPlace = places.find(
      place =>
        place.coord.lat === selectedLocation.latitude &&
        place.coord.lng === selectedLocation.longitude
    );

    const locationData = {
      title: selectedPlace ? selectedPlace.title : "Địa điểm đã chọn",
      address: selectedPlace ? selectedPlace.address : "Địa điểm đã chọn",
      coord: {
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude
      }
    };

    if (locationType === 'pickup') {
      setPickupLocation(locationData);
      router.back();
    } else {
      setDropoffLocation(locationData);
      router.push({
        pathname: "/customer/order/location/location-picked",
        params: {
          address: locationData.address,
          latitude: selectedLocation.latitude.toString(),
          longitude: selectedLocation.longitude.toString(),
          orderType
        }
      });
    }
  };

  const renderPlaceItem = ({ item }: { item: MapLocation }) => (
    <TouchableOpacity
      style={[
        styles.placeItem,
        selectedLocation?.latitude === item.coord.lat &&
          selectedLocation?.longitude === item.coord.lng ?
          styles.selectedPlace : null
      ]}
      onPress={() => handlePlaceSelect(item)}
    >
      <FontAwesome6 name="location-dot" size={20} color={COLOR.blue_theme} />
      <View style={styles.placeInfo}>
        <Text style={styles.placeTitle}>{item.title}</Text>
        <Text style={styles.placeAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[GLOBAL.container, { padding: 0 }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onPress={handleMapPress}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            pinColor={COLOR.red55}
          />
        )}

        {places.map(place => {
          const isSelected =
            selectedLocation?.latitude === place.coord.lat &&
            selectedLocation?.longitude === place.coord.lng;

          // Only render non-selected places as small dots
          if (!isSelected) {
            return (
              <Circle
                key={place.id}
                center={{
                  latitude: place.coord.lat,
                  longitude: place.coord.lng
                }}
                radius={8}
                strokeColor={COLOR.blue40}
                strokeWidth={2}
                fillColor={COLOR.blue40}
              />
            );
          }
          return null; // Don't render duplicate marker for selected place
        })}
      </MapView>

      <View style={styles.placesContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Đang tải địa điểm...</Text>
        ) : (
          <FlatList
            data={places}
            renderItem={renderPlaceItem}
            keyExtractor={item => item.id}
            style={styles.placesList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>Không tìm thấy địa điểm nào</Text>
            }
          />
        )}
      </View>

      <View style={styles.footer}>
        <Button
          title="Xác nhận"
          onPress={handleConfirm}
          type="primary"
          size="large"
        />
      </View>

      {/* Add zoom controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => {
            setRegion({
              ...region,
              latitudeDelta: region.latitudeDelta / 2,
              longitudeDelta: region.longitudeDelta / 2,
            });
          }}
        >
          <FontAwesome6 name="plus" size={20} color={COLOR.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => {
            setRegion({
              ...region,
              latitudeDelta: region.latitudeDelta * 2,
              longitudeDelta: region.longitudeDelta * 2,
            });
          }}
        >
          <FontAwesome6 name="minus" size={20} color={COLOR.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  placesContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    maxHeight: 200,
    backgroundColor: COLOR.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 8,
  },
  placesList: {
    flex: 1,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLOR.blue95,
    marginBottom: 8,
  },
  selectedPlace: {
    backgroundColor: COLOR.blue70,
    borderColor: COLOR.blue_theme,
    borderWidth: 1,
  },
  placeInfo: {
    flex: 1,
    marginLeft: 8,
  },
  placeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR.blue_theme,
  },
  placeAddress: {
    fontSize: 12,
    color: COLOR.grey50,
    marginTop: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: COLOR.white,
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    top: 100,
    backgroundColor: COLOR.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoomButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.grey90,
  },
  loadingText: {
    textAlign: 'center',
    padding: 10,
    color: COLOR.grey50,
  },
  emptyListText: {
    textAlign: 'center',
    padding: 10,
    color: COLOR.grey50,
  },
});

export default LocationMapPick;