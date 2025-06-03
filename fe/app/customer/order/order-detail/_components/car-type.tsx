import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import COLOR from "../../../../../constants/Colors";
import { useOrder } from "@/contexts/order.context";
import { VEHICLE_TYPES, vehicleOptions } from "@/types";

const { width } = Dimensions.get("window");



const CarType = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleOptions[0]);
  const { setVehicleType, setCarPrice } = useOrder();

  const handleSelectVehicle = (vehicleId: string) => {
    const vehicle = vehicleOptions.find((v) => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setVehicleType(vehicleId as VEHICLE_TYPES);
      setCarPrice(vehicle.price);
    }
  };



  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="truck-delivery" size={24} color="#F97316" />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{selectedVehicle.name}</Text>
              <Ionicons name="information-circle-outline" size={18} color="#ccc" />
            </View>
            <Text style={styles.subtitle}>{selectedVehicle.dimensions}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Chọn loại xe</Text>

            <ScrollView style={styles.vehicleList}>
              {vehicleOptions.map((vehicle) => {
                const isSelected = vehicle.id === selectedVehicle.id;
                return (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={[
                      styles.vehicleOption,
                      isSelected && styles.selectedVehicleOption,
                    ]}
                    onPress={() => handleSelectVehicle(vehicle.id)}
                  >
                    <View style={styles.vehicleHeader}>
                      <View style={styles.vehicleIconContainer}>
                        <MaterialCommunityIcons
                          name="truck-delivery"
                          size={24}
                          color={isSelected ? COLOR.orange50 : "#777"}
                        />
                      </View>
                      <View style={styles.vehicleTitleContainer}>
                        <View style={styles.vehicleTitleRow}>
                          <Text style={styles.vehicleTitle}>{vehicle.name}</Text>
                          <Ionicons name="information-circle-outline" size={18} color="#ccc" />
                        </View>
                        <Text style={styles.vehiclePrice}>{vehicle.price.toLocaleString()}đ</Text>
                      </View>
                    </View>
                    <Text style={styles.vehicleDimensions}>{vehicle.dimensions}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity style={styles.confirmButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.confirmButtonText}>Chọn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};


export default CarType;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#FEF3C7",
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '90%',
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  vehicleList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  vehicleOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  selectedVehicleOption: {
    borderColor: COLOR.orange50,
    borderWidth: 2,
    backgroundColor: '#FFF8F0',
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleTitleContainer: {
    flex: 1,
  },
  vehicleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  vehiclePrice: {
    fontSize: 16,
    color: COLOR.orange50,
    fontWeight: 'bold',
    marginTop: 4,
  },
  vehicleDimensions: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginLeft: 52, // Align with the text after icon
  },
  vehicleSpecsContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  vehicleImagePlaceholder: {
    width: 180,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  vanLabel: {
    position: 'absolute',
    backgroundColor: '#1E40AF',
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  widthSpec: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  horizontalLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 4,
  },
  horizontalArrows: {
    width: '80%',
    height: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  dimensionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  innerWidthSpec: {
    alignItems: 'center',
    width: '40%',
  },
  innerWidthLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 4,
  },
  innerWidthArrows: {
    width: '100%',
    height: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  heightSpec: {
    alignItems: 'center',
    position: 'relative',
  },
  heightLine: {
    width: 1,
    height: 60,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  heightArrows: {
    height: 60,
    width: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  specLabel: {
    fontSize: 12,
    color: '#666',
  },
  confirmButton: {
    backgroundColor: COLOR.orange50,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});