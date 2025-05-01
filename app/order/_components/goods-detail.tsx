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
import COLOR from "../../../constants/Colors";

const { width } = Dimensions.get('window');

const GoodsDetail = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="cube-outline" size={24} color="#777" />
        <Text style={styles.title}>Thông tin hàng hóa</Text>
      </View>

      <View style={styles.separator} />

      {/* Dimensions section */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => setModalVisible(true)}
      >
        <View>
          <Text style={styles.sectionTitle}>Kích thước và khối lượng</Text>
          <View style={styles.optionsRow}>
            <View style={styles.optionTag}>
              <Text style={styles.optionTagText}>Kích thước</Text>
            </View>
            <View style={styles.optionTag}>
              <Text style={styles.optionTagText}>Khối lượng</Text>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

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
            <TouchableOpacity key={index} style={styles.productOption}>
              <Text style={styles.productText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Dimensions Modal */}
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
                  value={weight}
                  onChangeText={setWeight}
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
                    value={length}
                    onChangeText={setLength}
                    placeholder="Dài"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.dimensionInput}>
                  <Text style={styles.inputLabel}>Rộng (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={width}
                    onChangeText={setWidth}
                    placeholder="Rộng"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.dimensionInput}>
                  <Text style={styles.inputLabel}>Cao (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={height}
                    onChangeText={setHeight}
                    placeholder="Cao"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Converted Weight */}
              <View style={styles.weightRow}>
                <View style={styles.weightInfo}>
                  <Text style={styles.weightLabel}>Khối lượng quy đổi</Text>
                  <Ionicons name="information-circle-outline" size={16} color="#ccc" />
                </View>
                <Text style={styles.weightValue}>0 (kg)</Text>
              </View>

              <View style={styles.weightRow}>
                <View style={styles.weightInfo}>
                  <Text style={styles.weightLabel}>Khối lượng tính phí</Text>
                  <Ionicons name="information-circle-outline" size={16} color="#1E40AF" />
                </View>
                <Text style={[styles.weightValue, styles.blueText]}>0 (kg)</Text>
              </View>

              {/* Image Upload */}
              <Text style={styles.imageLabel}>Hình ảnh</Text>
              <TouchableOpacity style={styles.imageUpload}>
                <View style={styles.imageIconContainer}>
                  <Ionicons name="image-outline" size={24} color="#000" />
                  <View style={styles.addIconBadge}>
                    <Ionicons name="add" size={12} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Bottom Summary */}
            <View style={styles.bottomSummary}>
              <View style={styles.summaryRow}>
                <FontAwesome5 name="weight" size={16} color="#F97316" />
                <Text style={styles.summaryText}>0 kg</Text>
              </View>
              <View style={styles.summaryRow}>
                <MaterialCommunityIcons name="cube-outline" size={20} color="#1E40AF" />
                <Text style={styles.summaryText}>0 x 0 x 0 cm</Text>
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

  // Modal Styles
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
  weightLabel: {
    fontSize: 16,
    marginRight: 6,
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
});