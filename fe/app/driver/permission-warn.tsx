import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { DRIVER_APPROVAL_STATUS } from '@/types';

const PermissionWarn: React.FC = () => {
    const { status } = useLocalSearchParams<{ status: DRIVER_APPROVAL_STATUS }>();

    const getStatusConfig = (status: DRIVER_APPROVAL_STATUS | undefined) => {
        switch (status) {
            case 'PENDING':
                return {
                    icon: 'hourglass-empty' as const,
                    color: '#FFA500',
                    title: 'Đang chờ phê duyệt',
                    message: 'Đơn đăng ký tài xế của bạn đang chờ phê duyệt.',
                };
            case 'REJECTED':
                return {
                    icon: 'cancel' as const,
                    color: '#FF0000',
                    title: 'Đơn bị từ chối',
                    message: 'Đơn đăng ký tài xế của bạn đã bị từ chối. Vui lòng quay lại sau 1 tháng.',
                };
            case 'BAN':
                return {
                    icon: 'block' as const,
                    color: '#FF0000',
                    title: 'Tài khoản bị cấm',
                    message: 'Bạn đã bị cấm là tài xế của Fast Delivery.',
                };
            default:
                return {
                    icon: 'error' as const,
                    color: '#666',
                    title: 'Lỗi',
                    message: 'Không thể xác định trạng thái.',
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialIcons name={config.icon} size={80} color={config.color} />
            </View>
            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.message}>{config.message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        lineHeight: 24,
    },
});

export default PermissionWarn;
