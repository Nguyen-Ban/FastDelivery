import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Dimensions,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLOR from "../../../../constants/Colors";
import { useOrder } from "../../../../contexts/order.context";
import { DELIVERY_TYPE } from "@/constants/DeliveryTypes";
import orderService from "@/services/order.service";

const { width, height } = Dimensions.get('window');

const DELIVERY_OPTIONS = {
  EXPRESS: {
    id: 'EXPRESS',
    title: 'Siêu tốc',
    subtitle: 'Lấy hàng ngay, giao trong 1 giờ',
    icon: 'flash'
  },
  ECONOMY: {
    id: 'ECONOMY',
    title: 'Tiết kiệm',
    subtitle: 'Giá tốt hơn, giao trong 6 giờ',
    icon: 'sunny'
  }
};

const DeliveryType = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { setDeliveryType, vehicleType, pickupLocation, dropoffLocation, setDeliveryPrice } = useOrder();



  const [economyPrice, setEconomyPrice] = useState(10000);
  const [expressPrice, setExpressPrice] = useState(20000);


  const [selectedType, setSelectedType] = useState(DELIVERY_OPTIONS.EXPRESS)

  const fetchPrices = async () => {
    try {
      const res = await orderService.getPrices(vehicleType, pickupLocation?.position ?? null, dropoffLocation?.position ?? null);
      if (!res?.success) {
        Alert.alert('Thông báo', 'Có lỗi xảy ra trong quá trình lấy giá');
      }
      setEconomyPrice(res?.data?.economyPrice);
      setExpressPrice(res?.data?.expressPrice);
    } catch (error) {
      Alert.alert('Thông báo', 'Có lỗi xảy ra trong quá trình lấy giá');
    }
  }

  useEffect(() => {
    fetchPrices();
  }, [])

  const handleSelectType = (type: string) => {
    if (type === 'EXPRESS') {
      setSelectedType(DELIVERY_OPTIONS.EXPRESS);
      setDeliveryType(DELIVERY_TYPE.EXPRESS);
      setDeliveryPrice(expressPrice);
    } else {
      setSelectedType(DELIVERY_OPTIONS.ECONOMY);
      setDeliveryType(DELIVERY_TYPE.ECONOMY);
      setDeliveryPrice(economyPrice);
    }
    setModalVisible(false);
  }

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={selectedType.icon as any}
              size={24}
              color={COLOR.orange50}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{selectedType.title}</Text>
            <Text style={styles.subtitle}>{selectedType.subtitle}</Text>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Chọn dịch vụ</Text>

            {/* Siêu tốc option */}
            <TouchableOpacity
              style={[
                styles.serviceOption,
                styles.selectedOption
              ]}
              onPress={() => handleSelectType('EXPRESS')}
            >
              <View style={styles.serviceContent}>
                <View style={styles.serviceIconContainer}>
                  <Ionicons name="flash" size={24} color={COLOR.orange50} />
                </View>
                <View style={styles.serviceTextContainer}>
                  <Text style={styles.serviceTitle}>{DELIVERY_OPTIONS.EXPRESS.title}</Text>
                  <Text style={styles.serviceSubtitle}>{DELIVERY_OPTIONS.EXPRESS.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.servicePrice}>{`${expressPrice.toLocaleString()}đ`}</Text>
            </TouchableOpacity>

            {/* Tiết kiệm option */}
            <TouchableOpacity
              style={[
                styles.serviceOption,
                styles.selectedOption
              ]}
              onPress={() => handleSelectType('ECONOMY')}
            >
              <View style={styles.serviceContent}>
                <View style={[styles.serviceIconContainer, styles.economyIcon]}>
                  <Ionicons name="sunny" size={24} color="orange" />
                </View>
                <View style={styles.serviceTextContainer}>
                  <Text style={styles.serviceTitle}>{DELIVERY_OPTIONS.ECONOMY.title}</Text>
                  <Text style={styles.serviceSubtitle}>{DELIVERY_OPTIONS.ECONOMY.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.servicePrice}>{`${economyPrice.toLocaleString()}đ`}</Text>
            </TouchableOpacity>

            {/* Close button area */}
            <Pressable
              style={styles.closeArea}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DeliveryType;

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
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLOR.orange90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: COLOR.orange50,
    borderWidth: 2,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLOR.orange90,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  economyIcon: {
    backgroundColor: '#E6F7FF',
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  servicePrice: {
    fontSize: 16,
    color: COLOR.orange50,
    fontWeight: 'bold',
  },
  closeArea: {
    height: 40,
    width: '100%',
  },
});