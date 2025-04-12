import React from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const COLOR = {
  containerBackground: "#f5f5f5",
  surface: "#ffffff",
  border: "#e0e0e0",
  textPrimary: "#212121",
  textSecondary: "#757575",
  primary: "#2089dc",
  success: "#4caf50",
  error: "#f44336",
  warning: "#ff9800",
  white: "#ffffff",
  grey50: "#9e9e9e",
  grey70: "#757575",
  cardBackground: "#ffffff"
};


interface DriverRegister {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
  status: "pending" | "approved" | "rejected";
  documents: string[];
  createdAt: string;
}

const RegisterCard = ({
  register,
  onApprove,
  onReject,
}: {
  register: DriverRegister;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) => (
  <View style={styles.registerCard}>
    <View style={styles.registerHeader}>
      <View style={styles.userInfo}>
        <FontAwesome5 name="user-circle" size={40} color={COLOR.grey50} />
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{register.name}</Text>
          <Text style={styles.userPhone}>{register.phone}</Text>
        </View>
      </View>
      <Text style={styles.date}>{register.createdAt}</Text>
    </View>

    <View style={styles.detailsContainer}>
      <DetailItem
        icon="car"
        label="Loại xe"
        value={register.vehicleType}
      />
      <DetailItem
        icon="id-card"
        label="Biển số"
        value={register.licensePlate}
      />
    </View>

    {register.status === "pending" && (
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => onReject(register.id)}
        >
          <Text style={[styles.buttonText, styles.rejectButtonText]}>Từ chối</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => onApprove(register.id)}
        >
          <Text style={[styles.buttonText, styles.approveButtonText]}>Duyệt</Text>
        </TouchableOpacity>
      </View>
    )}

    {register.status !== "pending" && (
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              register.status === "approved" ? COLOR.success : COLOR.error,
          },
        ]}
      >
        <Text style={styles.statusText}>
          {register.status === "approved" ? "Đã duyệt" : "Đã từ chối"}
        </Text>
      </View>
    )}
  </View>
);

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.detailItem}>
    <FontAwesome5 name={icon} size={16} color={COLOR.grey50} />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default function DriverRegistersScreen() {
  // Dữ liệu mẫu - sẽ được thay thế bằng dữ liệu thực từ API
  const [registers, setRegisters] = React.useState<DriverRegister[]>([
    {
      id: "1",
      name: "Phạm Văn X",
      phone: "0123456789",
      vehicleType: "Xe máy",
      licensePlate: "59-Y1 23456",
      status: "pending",
      documents: ["cmnd.jpg", "banglai.jpg"],
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Trần Thị Y",
      phone: "0987654321",
      vehicleType: "Xe tải nhỏ",
      licensePlate: "51-K2 34567",
      status: "approved",
      documents: ["cmnd.jpg", "banglai.jpg"],
      createdAt: "2024-01-14",
    },
    {
      id: "3",
      name: "Lê Văn Z",
      phone: "0369852147",
      vehicleType: "Xe máy",
      licensePlate: "59-M3 45678",
      status: "rejected",
      documents: ["cmnd.jpg", "banglai.jpg"],
      createdAt: "2024-01-13",
    },
  ]);

  const handleApprove = (id: string) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn duyệt yêu cầu này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Duyệt",
          onPress: () => {
            setRegisters((prev) =>
              prev.map((req) =>
                req.id === id ? { ...req, status: "approved" } : req
              )
            );
          },
        },
      ]
    );
  };

  const handleReject = (id: string) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn từ chối yêu cầu này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Từ chối",
          style: "destructive",
          onPress: () => {
            setRegisters((prev) =>
              prev.map((req) =>
                req.id === id ? { ...req, status: "rejected" } : req
              )
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Đăng ký tài xế</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {registers.filter((r) => r.status === "pending").length}
            </Text>
            <Text style={styles.statLabel}>Chờ duyệt</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {registers.filter((r) => r.status === "approved").length}
            </Text>
            <Text style={styles.statLabel}>Đã duyệt</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {registers.filter((r) => r.status === "rejected").length}
            </Text>
            <Text style={styles.statLabel}>Đã từ chối</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={registers}
        renderItem={({ item }) => (
          <RegisterCard
            register={item}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.containerBackground,
  },
  header: {
    backgroundColor: COLOR.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLOR.textPrimary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLOR.containerBackground,
    borderRadius: 8,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLOR.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLOR.textSecondary,
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  registerCard: {
    backgroundColor: COLOR.cardBackground,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  registerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameContainer: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLOR.textPrimary,
  },
  userPhone: {
    fontSize: 14,
    color: COLOR.textSecondary,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: COLOR.textSecondary,
  },
  detailsContainer: {
    marginTop: 16,
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLOR.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    color: COLOR.textPrimary,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: COLOR.error,
  },
  rejectButtonText: {
    color: COLOR.error,
  },
  approveButton: {
    backgroundColor: COLOR.primary,
  },
  approveButtonText: {
    color: COLOR.white,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
  },
  statusText: {
    color: COLOR.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});