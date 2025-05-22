import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
  Dimensions
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import COLOR from "../../../../constants/Colors";
import { useOrder } from "../../../../contexts/order.context";
import { PACKAGE_TYPES } from "@/constants/PackageTypes";
import { GoodsDetails } from "@/types/OrderDetails";

const { width } = Dimensions.get('window');


const packageOptions = [
  {
    id: PACKAGE_TYPES.FOOD,
    name: "Thực phẩm",
  },
  {
    id: PACKAGE_TYPES.ELECTRONICS,
    name: "Điện tử",
  },
  {
    id: PACKAGE_TYPES.CLOTHING,
    name: "Thời trang",
  },
  {
    id: PACKAGE_TYPES.DOCUMENT,
    name: "Tài liệu",
  },
  {
    id: PACKAGE_TYPES.OTHERS,
    name: "Khác",
  }
];

const sizeOptions = [
  {
    label: 'S',
    display: 'Tối đa 25x32x12 cm',
    dimensions: {
      length: 25,
      width: 32,
      height: 12
    }
  },
  {
    label: 'M',
    display: 'Tối đa 35x32x12 cm',
    dimensions: {
      length: 35,
      width: 32,
      height: 12
    }
  },
  {
    label: 'L',
    display: 'Tối đa 40x35x15 cm',
    dimensions: {
      length: 40,
      width: 35,
      height: 15
    }
  }
];

const GoodsDetail = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { packageType, weightKg, lengthCm, widthCm, heightCm, sizeName,
    setPackageType, setWeightKg, setLengthCm, setWidthCm, setHeightCm, setSizeName,
    vehicleType } = useOrder();



  const isMotorbike = vehicleType === 'MOTORBIKE';



  const renderMotorbikeContent = () => (
    <View style={styles.section}>
      <View>
        <Text style={styles.sectionTitle}>Kích thước và khối lượng</Text>
        <View style={styles.sizeOptionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sizeOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.sizeOption,
                  lengthCm === option.dimensions.length && styles.selectedSizeOption
                ]}
                onPress={() => {
                  setLengthCm(option.dimensions.length);
                  setWidthCm(option.dimensions.width);
                  setHeightCm(option.dimensions.height);
                  setSizeName(option.label);
                }}
              >
                <Text style={[
                  styles.sizeLabel,
                  lengthCm === option.dimensions.length && styles.selectedSizeLabel
                ]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Text style={styles.sizeDescription}>
          {sizeOptions.find(option =>
            option.dimensions.length === lengthCm &&
            option.dimensions.width === widthCm &&
            option.dimensions.height === heightCm
          )?.display || sizeOptions[0].display}
        </Text>

        <View style={styles.weightInput}>
          <Text style={styles.weightLabel}>Khối lượng (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập khối lượng"
            keyboardType="numeric"
            value={weightKg?.toString()}
            onChangeText={(val) => setWeightKg(parseFloat(val))}
          />
        </View>
      </View>
    </View>
  );

  const renderVanContent = () => (
    <TouchableOpacity
      style={styles.section}
      onPress={() => setModalVisible(true)}
    >
      <View>
        <Text style={styles.sectionTitle}>Kích thước và khối lượng</Text>
        <View style={styles.optionsRow}>
          <View style={styles.optionTag}>
            <Text style={styles.optionTagText}>
              {lengthCm && widthCm && heightCm
                ? `${lengthCm}x${widthCm}x${heightCm} cm`
                : 'Kích thước'}
            </Text>
          </View>
          <View style={styles.optionTag}>
            <Text style={styles.optionTagText}>
              {weightKg ? `${weightKg} kg` : 'Khối lượng'}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="cube-outline" size={24} color="#777" />
        <Text style={styles.title}>Thông tin hàng hóa</Text>
      </View>

      <View style={styles.separator} />

      {/* Dimensions section */}
      {isMotorbike ? renderMotorbikeContent() : renderVanContent()}

      <View style={styles.separator} />

      {/* Product type section */}
      <View style={styles.section}>
        <View style={styles.requiredFieldContainer}>
          <Text style={styles.sectionTitle}>Loại hàng hóa</Text>
          <Text style={styles.requiredMark}>*</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsScrollContent}
        >
          {packageOptions.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.productOption,
                packageType === type.id && styles.selectedProductOption
              ]}
              onPress={() => setPackageType(type.id)}
            >
              <Text style={[
                styles.productText,
                packageType === type.id && styles.selectedProductTextStyle
              ]}>{type.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Dimensions Modal for VAN type */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Thông tin hàng hóa</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.formContainer}>
              {/* Weight Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Khối lượng (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={weightKg?.toString()}
                  onChangeText={(value) => setWeightKg(parseFloat(value))}
                  placeholder="Nhập khối lượng"
                  keyboardType="numeric"
                />
              </View>

              {/* Dimension Inputs */}
              <View style={styles.dimensionsRow}>
                <View style={styles.dimensionInput}>
                  <Text style={styles.inputLabel}>Dài (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={lengthCm?.toString()}
                    onChangeText={(value) => setLengthCm(parseFloat(value))}
                    placeholder="Dài"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.dimensionInput}>
                  <Text style={styles.inputLabel}>Rộng (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={widthCm?.toString()}
                    onChangeText={(value) => setWidthCm(parseFloat(value))}
                    placeholder="Rộng"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.dimensionInput}>
                  <Text style={styles.inputLabel}>Cao (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={heightCm?.toString()}
                    onChangeText={(value) => setHeightCm(parseFloat(value))}
                    placeholder="Cao"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Bottom Summary */}
              <View style={styles.bottomSummary}>
                <View style={styles.summaryRow}>
                  <FontAwesome5 name="weight" size={16} color="#F97316" />
                  <Text style={styles.summaryText}>{weightKg} kg</Text>
                </View>
                <View style={styles.summaryRow}>
                  <MaterialCommunityIcons name="cube-outline" size={20} color="#1E40AF" />
                  <Text style={styles.summaryText}>
                    {lengthCm} x {widthCm} x {heightCm} cm
                  </Text>
                </View>
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GoodsDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  requiredFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  requiredMark: {
    color: COLOR.red55,
    fontSize: 16,
    marginLeft: 4,
  },
  optionsRow: {
    flexDirection: "row",
  },
  optionTag: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  optionTagText: {
    color: "#666",
    fontSize: 14,
  },
  sizeOptionsContainer: {
    marginBottom: 12,
  },
  sizeOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedSizeOption: {
    borderColor: COLOR.orange50,
    backgroundColor: COLOR.orange50,
  },
  sizeLabel: {
    fontSize: 16,
    color: '#666',
  },
  selectedSizeLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  sizeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 16,
  },
  weightInput: {
    marginTop: 8,
  },
  weightLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  productsScrollContent: {
    paddingRight: 20,
  },
  productOption: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  productText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContent: {
    flex: 1,
    display: 'flex',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  dimensionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dimensionInput: {
    flex: 1,
    marginRight: 10,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  weightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightValue: {
    fontSize: 16,
  },
  blueText: {
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  imageLabel: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  imageUpload: {
    width: 84,
    height: 84,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIconContainer: {
    position: 'relative',
  },
  addIconBadge: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    backgroundColor: '#1E40AF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSummary: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    justifyContent: 'space-around',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
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
  selectedProductOption: {
    borderColor: COLOR.orange50,
    backgroundColor: COLOR.orange90,
  },
  selectedProductTextStyle: {
    color: COLOR.orange50,
    fontWeight: '500',
  },
});