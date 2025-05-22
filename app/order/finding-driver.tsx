// app/order/FindingDriver.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

const FindingDriver = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0); // 0 - 1
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bắt đầu tiến trình chạy thanh progress
    Animated.timing(animation, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start();

    // Hẹn giờ sau 4s chuyển sang delivery
    const timeout = setTimeout(() => {
      router.replace('/order/delivery');
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const handleCancel = () => {
    router.back();
  };

  const progressWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/ad_3.png')} // ảnh động/tĩnh của bạn
        style={styles.image}
      />
      <ActivityIndicator size="large" color="#FF9800" />
      <Text style={styles.text}>Đang tìm tài xế phù hợp...</Text>
      <View style={styles.textBox}>
        <Text style={styles.subText}>
          Cần thêm chút thời gian để tìm, bạn thông cảm chờ một lát nhé.
        </Text>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
      </View>
      <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Hủy tìm tài xế</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FindingDriver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
    color: '#FF9800',
    fontWeight: 'bold',
  },
  textBox: {
    marginTop: 16,
    width: '100%',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: 5,
    backgroundColor: '#FF9800',
  },
  cancelButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF5722',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
