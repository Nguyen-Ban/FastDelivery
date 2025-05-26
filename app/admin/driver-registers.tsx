import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Alert, 
  Platform, 
  StatusBar, 
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity 
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DriverRegister {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  vehicleType: string;
  vehiclePlate: string;
  licenseNumber: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
  documents: string[];
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

const RegisterCard = ({
  register,
  onApprove,
  onReject,
  onBan,
  loading,
}: {
  register: DriverRegister;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBan: (id: string) => void;
  loading: boolean;
}) => (
  <View style={styles.registerCard}>
    <View style={styles.registerHeader}>
      <View style={styles.userInfo}>
        <FontAwesome5 name="user-circle" size={40} color="#9e9e9e" />
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{register.name}</Text>
          <Text style={styles.userPhone}>{register.phone}</Text>
          {register.email && (
            <Text style={styles.userEmail}>{register.email}</Text>
          )}
        </View>
      </View>
      <Text style={styles.date}>{register.createdAt}</Text>
    </View>

    <View style={styles.detailsContainer}>
      <DetailItem
        icon="motorcycle"
        label="Loại xe"
        value={register.vehicleType}
      />
      <DetailItem
        icon="id-card"
        label="Biển số"
        value={register.vehiclePlate}
      />
      <DetailItem
        icon="id-badge"
        label="Số GPLX"
        value={register.licenseNumber}
      />
    </View>

    {register.approvalStatus === "PENDING" && (
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.banButton]}
          onPress={() => onBan(register.userId)}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.banButtonText]}>
            Cấm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => onReject(register.userId)}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.rejectButtonText]}>
            Từ chối
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => onApprove(register.userId)}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.approveButtonText]}>
            Duyệt
          </Text>
        </TouchableOpacity>
      </View>
    )}

    {register.approvalStatus !== "PENDING" && (
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              register.approvalStatus === "APPROVED" ? "#00BFA5" : 
              register.approvalStatus === "BANNED" ? "#FF9800" : "#FF6B6B",
          },
        ]}
      >
        <Text style={styles.statusText}>
          {register.approvalStatus === "APPROVED" ? "Đã duyệt" : 
           register.approvalStatus === "BANNED" ? "Đã cấm" : "Đã từ chối"}
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
    <FontAwesome5 name={icon} size={16} color="#666666" />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

// API Configuration
const API_BASE_URL = "http://192.168.100.200:3000/api"; // Change this to your actual API URL

class DriverApiService {
  private static async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private static async makeAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getAuthToken();
    
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'role': 'SYSADMIN',
        ...options.headers,
      },
    });
  }

  static async getDriverList(): Promise<ApiResponse<DriverRegister[]>> {
    try {
      const response = await this.makeAuthenticatedRequest('/driver/list');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch driver list: ${error}`);
    }
  }

  static async updateDriverStatus(
    driverId: string, 
    action: 'approve' | 'reject' | 'ban'
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.makeAuthenticatedRequest(
        `/driver/register/${driverId}?action=${action}`,
        { method: 'PATCH' }
      );
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to update driver status: ${error}`);
    }
  }
}

export default function DriverRegistersScreen() {
  const [registers, setRegisters] = useState<DriverRegister[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await DriverApiService.getDriverList();
      
      if (response.success) {
        setRegisters(response.data);
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể tải danh sách tài xế');
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDrivers();
    setRefreshing(false);
  }, [fetchDrivers]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleStatusUpdate = async (
    id: string, 
    action: 'approve' | 'reject' | 'ban',
    confirmMessage: string,
    successMessage: string
  ) => {
    Alert.alert(
      "Xác nhận",
      confirmMessage,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: action === 'approve' ? "Duyệt" : action === 'ban' ? "Cấm" : "Từ chối",
          style: action === 'reject' || action === 'ban' ? "destructive" : "default",
          onPress: async () => {
            try {
              setActionLoading(true);
              const response = await DriverApiService.updateDriverStatus(id, action);
              
              if (response.success) {
                Alert.alert('Thành công', successMessage);
                // Refresh the list
                await fetchDrivers();
              } else {
                Alert.alert('Lỗi', response.message || `Không thể ${action} tài xế`);
              }
            } catch (error) {
              console.error(`Error ${action} driver:`, error);
              Alert.alert('Lỗi', 'Không thể kết nối đến server');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleApprove = (id: string) => {
    handleStatusUpdate(
      id, 
      'approve', 
      "Bạn có chắc chắn muốn duyệt yêu cầu này?",
      "Đã duyệt tài xế thành công"
    );
    console.log(`Approved driver with ID: ${id}`);
  };

  const handleReject = (id: string) => {
    handleStatusUpdate(
      id, 
      'reject', 
      "Bạn có chắc chắn muốn từ chối yêu cầu này?",
      "Đã từ chối tài xế thành công"
    );
  };

  const handleBan = (id: string) => {
    handleStatusUpdate(
      id, 
      'ban', 
      "Bạn có chắc chắn muốn cấm tài xế này?",
      "Đã cấm tài xế thành công"
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#00BFA5" />
        <Text style={styles.loadingText}>Đang tải danh sách tài xế...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đăng ký tài xế</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {registers.filter((r) => r.approvalStatus === "PENDING").length}
            </Text>
            <Text style={styles.statLabel}>Chờ duyệt</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {registers.filter((r) => r.approvalStatus === "APPROVED").length}
            </Text>
            <Text style={styles.statLabel}>Đã duyệt</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {registers.filter((r) => r.approvalStatus === "REJECTED").length}
            </Text>
            <Text style={styles.statLabel}>Đã từ chối</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {registers.filter((r) => r.approvalStatus === "BANNED").length}
            </Text>
            <Text style={styles.statLabel}>Đã cấm</Text>
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
            onBan={handleBan}
            loading={actionLoading}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="users" size={48} color="#cccccc" />
            <Text style={styles.emptyText}>Không có tài xế nào</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00BFA5",
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  registerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  registerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  userPhone: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: "#888888",
    marginTop: 1,
  },
  date: {
    fontSize: 12,
    color: "#666666",
  },
  detailsContainer: {
    gap: 12,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666666",
    minWidth: 70,
  },
  detailValue: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  rejectButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  rejectButtonText: {
    color: "#FF6B6B",
  },
  approveButton: {
    backgroundColor: "#00BFA5",
  },
  approveButtonText: {
    color: "#ffffff",
  },
  banButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#FF9800",
  },
  banButtonText: {
    color: "#FF9800",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 16,
  },
});