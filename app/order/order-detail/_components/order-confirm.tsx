import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert } from "react-native";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import COLOR from "../../../../constants/Colors";
import { useRouter } from "expo-router";
import { useOrder } from "../../../../contexts/order.context";

const PaymentMethods = [
  {
    id: 'account',
    name: 'Tài khoản',
    // icon: require('../../../assets/wallet-icon.png'),
    defaultIcon: <FontAwesome5 name="wallet" size={24} color="#FF9800" />,
    shortName: 'Tài khoản',
  },
  {
    id: 'zalopay',
    name: 'Zalopay',
    // icon: require('../../../assets/wallet-icon.png'),
    defaultIcon: <FontAwesome5 name="wallet" size={24} color="#0068FF" />,
    promoText: 'Nhập mã GIAOHANG -20%, tối đa 20K',
    shortName: 'Zalopay',
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    // icon: require('../../../assets/wallet-icon.png'),
    defaultIcon: <FontAwesome5 name="wallet" size={24} color="#EE4D2D" />,
    shortName: 'ShopeePay',
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    // icon: require('../../../assets/wallet-icon.png'),
    defaultIcon: <FontAwesome5 name="wallet" size={24} color="#A50064" />,
    shortName: 'MoMo',
  },
  {
    id: 'newcard',
    name: 'Thêm thẻ mới',
    subtext: 'Thẻ ATM, Visa, MasterCard, JCB',
    // icon: require('../../../assets/wallet-icon.png'),
    defaultIcon: <FontAwesome5 name="credit-card" size={24} color="#2196F3" />,
    hasButton: true,
    shortName: 'Thẻ',
  },
];

const CashMethods = [
  {
    id: 'sendercash',
    name: 'Người gửi trả tiền mặt',
    // icon: require('../../../assets/wallet-icon.png'),
    defaultIcon: <FontAwesome5 name="money-bill-wave" size={24} color="#4CAF50" />,
    selected: true,
    shortName: 'Người gửi',
  },
  {
    id: 'receivercash',
    name: 'Người nhận trả tiền mặt',
    // icon: require('../../../assets/wallet-icon.png'),
    defaultIcon: <FontAwesome5 name="money-bill-wave" size={24} color="#4CAF50" />,
    shortName: 'Người nhận',
  },
];

// Combine all payment methods for easier lookup
const AllPaymentMethods = [...PaymentMethods, ...CashMethods];

const OrderConfirm = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('sendercash');
  const router = useRouter();
  const {
    pickupLocation,
    deliveryLocation,
    sender,
    receiver,
    deliveryType,
    carType,
    goodsDetails,
    note,
    specialDemands
  } = useOrder();

  const handleSelectPayment = (id: string) => {
    setSelectedMethod(id);
    setModalVisible(false);
  };

  // Calculate total price based on delivery details
  const totalPrice = useMemo(() => {
    // This is a placeholder calculation - implement your actual pricing logic here
    const basePrice = deliveryType === 'VAN' ? 100000 : 50000;
    const goodsPrice = goodsDetails ? goodsDetails.weight * 1000 : 0;
    return basePrice + goodsPrice;
  }, [deliveryType, goodsDetails]);

  const validateOrder = () => {
    if (!pickupLocation || !deliveryLocation) {
      Alert.alert('Thông báo', 'Vui lòng chọn địa điểm đón và trả hàng');
      return false;
    }
    if (!sender || !receiver) {
      Alert.alert('Thông báo', 'Vui lòng nhập thông tin người gửi và người nhận');
      return false;
    }
    if (!goodsDetails) {
      Alert.alert('Thông báo', 'Vui lòng nhập thông tin hàng hóa');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateOrder()) {
      return;
    }

    const orderData = {
      pickup: pickupLocation,
      delivery: deliveryLocation,
      sender,
      receiver,
      deliveryType,
      carType: deliveryType === 'VAN' ? carType : undefined,
      goods: goodsDetails,
      note,
      specialDemands,
      paymentMethod: selectedMethod,
      totalPrice,
      status: 'PENDING'
    };

    try {
      // TODO: Replace with your actual API call
      // const response = await createOrder(orderData);

      // For now, we'll just navigate to the delivery screen
      router.push({
        pathname: "/order/finding-driver",
        // params: { orderId: response.orderId }
      });
    } catch (error) {
      Alert.alert(
        'Lỗi',
        'Không thể tạo đơn hàng. Vui lòng thử lại sau.',
        [{ text: 'OK' }]
      );
    }
  };

  // Find the selected payment method
  const selectedPaymentMethod = AllPaymentMethods.find(method => method.id === selectedMethod);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.optionsRow}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.option}>
          <FontAwesome5 name="wallet" size={20} color="#666" />
          <Text style={styles.optionText}>THANH TOÁN</Text>
        </View>
        <View style={styles.selectedMethodContainer}>
          {selectedPaymentMethod && (
            <>
              {selectedPaymentMethod.defaultIcon}
              <Text style={styles.selectedMethodText}>
                {selectedPaymentMethod.shortName || selectedPaymentMethod.name}
              </Text>
            </>
          )}
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
      </TouchableOpacity>

      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Tổng phí</Text>
          <Ionicons name="information-circle-outline" size={18} color="#ccc" />
        </View>
        <Text style={styles.totalAmount}>đ{totalPrice.toLocaleString()}</Text>
      </View>

      <TouchableOpacity
        style={styles.orderButton}
        onPress={handlePlaceOrder}
      >
        <Text style={styles.orderButtonText}>Đặt đơn</Text>
      </TouchableOpacity>

      {/* Payment Method Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
              <View style={{ width: 28 }} />
            </View>

            <View style={styles.methodsContainer}>
              <Text style={styles.methodSectionTitle}>Thanh toán không dùng tiền mặt</Text>

              {PaymentMethods.map(method => (
                <TouchableOpacity
                  key={method.id}
                  style={styles.methodItem}
                  onPress={() => handleSelectPayment(method.id)}
                >
                  <View style={styles.methodLeft}>
                    {method.defaultIcon}
                    <View style={styles.methodTextContainer}>
                      <Text style={styles.methodName}>{method.name}</Text>
                      {method.promoText && (
                        <Text style={styles.promoText}>{method.promoText}</Text>
                      )}
                      {method.subtext && (
                        <Text style={styles.subText}>{method.subtext}</Text>
                      )}
                    </View>
                  </View>

                  {method.hasButton ? (
                    <TouchableOpacity style={styles.addCardButton}>
                      <Text style={styles.addCardText}>Thêm</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.radioButtonContainer}>
                      <View style={[
                        styles.radioButton,
                        selectedMethod === method.id && styles.radioSelected
                      ]}>
                        {selectedMethod === method.id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              <Text style={[styles.methodSectionTitle, styles.cashTitle]}>Thanh toán bằng tiền mặt</Text>

              {CashMethods.map(method => (
                <TouchableOpacity
                  key={method.id}
                  style={styles.methodItem}
                  onPress={() => handleSelectPayment(method.id)}
                >
                  <View style={styles.methodLeft}>
                    {method.defaultIcon}
                    <Text style={styles.methodName}>{method.name}</Text>
                  </View>

                  <View style={styles.radioButtonContainer}>
                    <View style={[
                      styles.radioButton,
                      selectedMethod === method.id && styles.radioSelected
                    ]}>
                      {selectedMethod === method.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderConfirm;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
    zIndex: 999,
  },
  optionsRow: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  selectedMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedMethodText: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 8,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalText: {
    fontSize: 16,
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLOR.orange50,
  },
  orderButton: {
    backgroundColor: COLOR.orange50,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContent: {
    flex: 1,
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  methodsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  methodSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  cashTitle: {
    marginTop: 24,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodTextContainer: {
    marginLeft: 16,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
  promoText: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 4,
    marginLeft: 16,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginLeft: 16,
  },
  radioButtonContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: COLOR.orange50,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLOR.orange50,
  },
  addCardButton: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addCardText: {
    color: COLOR.orange50,
    fontWeight: '500',
  },
});