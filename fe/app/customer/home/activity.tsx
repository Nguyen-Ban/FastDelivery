import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Order } from "@/types";
import orderService from "@/services/order.service";
import COLOR from "../../../constants/Colors";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'IN_DELIVERY':
      return COLOR.orange50;
    case 'DELIVERED':
      return COLOR.green40;
    case 'CANCELLED':
      return COLOR.red55;
    default:
      return COLOR.blue70;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'IN_DELIVERY':
      return 'Đang giao hàng';
    case 'DELIVERED':
      return 'Đã giao';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return 'Chờ xác nhận';
  }
};

interface Activity {
  id: string;
  time: Date;
  status: string;
  vehicleType: string;
  deliveryType: string;
  pickupAddress: string;
  dropoffAddress: string;
  price: number;
}

const Activity = () => {
  const [deliveries, setDeliveries] = useState<Activity[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchDeliveries = async () => {
        const res = await orderService.getCustomerOrderList();
        if (res.success) {
          setDeliveries(res.data);
        }
      };
      fetchDeliveries();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hoạt động</Text>
      </View>

      {/* Delivery List */}
      <ScrollView style={styles.deliveryList}>
        {deliveries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Bạn chưa có hoạt động nào</Text>
          </View>
        ) : (
          deliveries.map((delivery, index) => (
            <TouchableOpacity
              key={index}
              style={styles.deliveryItem}
              onPress={() => {
                router.push({
                  pathname: "/customer/user/event-detail",
                  params: { id: delivery.id },
                });
              }}
            >
              <View style={styles.deliveryHeader}>
                <View>
                  <View style={styles.vehicleInfo}>
                    <Ionicons name="bicycle" size={20} color="#00BFA5" />
                    <Text style={styles.amount}>{delivery.price.toLocaleString()}đ</Text>
                  </View>
                  <Text style={styles.time}>
                    {new Date(delivery.time).toLocaleString('vi-VN')}
                  </Text>
                  <View style={styles.typeInfo}>
                    <Text style={styles.vehicleType}>
                      {delivery.vehicleType === 'MOTORBIKE' ? 'Xe máy' : 'Xe tải'}
                    </Text>
                    <Text style={styles.separator}>|</Text>
                    <Text style={styles.deliveryType}>
                      {delivery.deliveryType === 'EXPRESS' ? 'Siêu tốc' : 'Tiết kiệm'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.statusButton, { backgroundColor: getStatusColor(delivery.status) }]}
                >
                  <Text style={styles.statusText}>{getStatusText(delivery.status)}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.addressContainer}>
                <View style={styles.addressRow}>
                  <View style={styles.dotBlack} />
                  <Text style={styles.address} numberOfLines={1}>{delivery.pickupAddress}</Text>
                </View>
                <View style={styles.addressRow}>
                  <View style={styles.dotOrange} />
                  <Text style={styles.address} numberOfLines={1}>{delivery.dropoffAddress}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deliveryList: {
    flex: 1,
  },
  deliveryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  amount: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  typeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleType: {
    fontSize: 12,
    color: '#00BFA5',
  },
  deliveryType: {
    fontSize: 12,
    color: COLOR.orange50,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  addressContainer: {
    marginTop: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dotBlack: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginRight: 8,
  },
  dotOrange: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9500',
    marginRight: 8,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  separator: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 4,
  },
});

export default Activity;
