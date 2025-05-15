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

const { width } = Dimensions.get('window');

interface GoodsDetailProps {
  type?: string;
}

interface GoodsDetails {
  weight: number;
  length: number;
  width: number;
  height: number;
  quantity: number;
  description?: string;
}

interface GoodsState extends GoodsDetails {
  size?: string;
  productType?: string;
}

const DEFAULT_GOODS_STATE: GoodsState = {
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  quantity: 1,
  description: '',
  size: 'S',
  productType: ''
};

const productTypes = [
  "Nội thất, trang trí",
  "Thực phẩm",
  "Đồ uống",
  "Đồ điện tử",
  "Thời trang",
  "Mỹ phẩm",
  "Sách, văn phòng phẩm",
  "Đồ chơi, quà tặng",
  "Y tế, dược phẩm",
  "Vật liệu xây dựng"
];

const sizeOptions = [
  { label: 'S', size: 'Tối đa 25x32x12 cm' },
  { label: 'M', size: 'Tối đa 35x32x12 cm' },
  { label: 'L', size: 'Tối đa 40x35x15 cm' }
];

const GoodsDetail: React.FC<GoodsDetailProps> = ({ type = 'VAN' }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { goodsDetails, setGoodsDetails } = useOrder();

  const [localState, setLocalState] = useState<GoodsState>({
    ...DEFAULT_GOODS_STATE,
    ...goodsDetails,
  });

  const isVan = type === 'VAN';

  const handleConfirm = () => {
    const details: GoodsDetails = {
      weight: localState.weight,
      length: localState.length,
      width: localState.width,
      height: localState.height,
      quantity: localState.quantity,
      description: localState.description
    };
    setGoodsDetails(details);
    setModalVisible(false);
  };

  const updateLocalState = (updates: Partial<GoodsState>) => {
    setLocalState(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleSelectProductType = (type: string) => {
    updateLocalState({ productType: type });
  };

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
                  localState.size === option.label && styles.selectedSizeOption
                ]}
                onPress={() => updateLocalState({ size: option.label })}
              >
                <Text style={[
                  styles.sizeLabel,
                  localState.size === option.label && styles.selectedSizeLabel
                ]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Text style={styles.sizeDescription}>
          {sizeOptions.find(option => option.label === localState.size)?.size}
        </Text>

        <View style={styles.weightInput}>
          <Text style={styles.weightLabel}>Khối lượng (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập khối lượng"
            keyboardType="numeric"
            value={localState.weight.toString()}
            onChangeText={(value) => {
              updateLocalState({ weight: parseFloat(value) || 0 });
            }}
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
              {localState.length && localState.width && localState.height
                ? `${localState.length}x${localState.width}x${localState.height} cm`
                : 'Kích thước'}
            </Text>
          </View>
          <View style={styles.optionTag}>
            <Text style={styles.optionTagText}>
              {localState.weight ? `${localState.weight} kg` : 'Khối lượng'}
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
      {isVan ? renderVanContent() : renderMotorbikeContent()}

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
          {productTypes.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.productOption,
                localState.productType === type && styles.selectedProductOption
              ]}
              onPress={() => handleSelectProductType(type)}
            >
              <Text style={[
                styles.productText,
                localState.productType === type && styles.selectedProductTextStyle
              ]}>{type}</Text>
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
                <Text style={styles.inputLabel}>Khối lượng 1 kiện (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={localState.weight.toString()}
                  onChangeText={(value) => updateLocalState({ weight: parseFloat(value) || 0 })}
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
                    value={localState.length.toString()}
                    onChangeText={(value) => updateLocalState({ length: parseFloat(value) || 0 })}
                    placeholder="Dài"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.dimensionInput}>
                  <Text style={styles.inputLabel}>Rộng (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={localState.width.toString()}
                    onChangeText={(value) => updateLocalState({ width: parseFloat(value) || 0 })}
                    placeholder="Rộng"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.dimensionInput}>
                  <Text style={styles.inputLabel}>Cao (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={localState.height.toString()}
                    onChangeText={(value) => updateLocalState({ height: parseFloat(value) || 0 })}
                    placeholder="Cao"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Bottom Summary */}
              <View style={styles.bottomSummary}>
                <View style={styles.summaryRow}>
                  <FontAwesome5 name="weight" size={16} color="#F97316" />
                  <Text style={styles.summaryText}>{localState.weight} kg</Text>
                </View>
                <View style={styles.summaryRow}>
                  <MaterialCommunityIcons name="cube-outline" size={20} color="#1E40AF" />
                  <Text style={styles.summaryText}>
                    {localState.length} x {localState.width} x {localState.height} cm
                  </Text>
                </View>
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
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