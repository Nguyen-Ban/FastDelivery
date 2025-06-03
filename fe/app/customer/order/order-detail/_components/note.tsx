import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import COLOR from "../../../../../constants/Colors";
import { useOrder } from "@/contexts/order.context";

const Note = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { note, setNote } = useOrder();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.leftContent}>
          <Feather name="edit-2" size={24} color="#777" />
          <Text style={styles.title}>Ghi chú cho tài xế</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Ghi chú cho tài xế</Text>
                <View style={{ width: 28 }} />
              </View>

              <View style={styles.noteInputContainer}>
                <TextInput
                  style={styles.noteInput}
                  multiline
                  placeholder="Ví dụ Lô A, chung cư ABC..."
                  value={note}
                  onChangeText={setNote}
                />
              </View>

              <View style={styles.imageUploadSection}>
                <TouchableOpacity style={styles.imageUpload}>
                  <View style={styles.imageIconContainer}>
                    <Ionicons name="image-outline" size={24} color="#000" />
                    <View style={styles.addIconBadge}>
                      <Ionicons name="add" size={12} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default Note;

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
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  // Modal styles
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
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noteInputContainer: {
    padding: 16,
    flex: 1,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    height: 200,
    textAlignVertical: 'top',
  },
  imageUploadSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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