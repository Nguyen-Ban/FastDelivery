import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import COLOR from '@/constants/Colors';

interface CancelledPanelProps {
    onBackHome?: () => void;
    reason?: string;
}

const CancelledPanel: React.FC<CancelledPanelProps> = ({ onBackHome, reason }) => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png' }}
                style={styles.icon}
            />
            <Text style={styles.title}>Đơn hàng đã bị hủy</Text>
            <Text style={styles.desc}>
                Đơn hàng của bạn đã bị hủy bởi tài xế.
                {reason ? `\nLý do: ${reason}` : ''}
            </Text>
            <TouchableOpacity style={styles.button} onPress={onBackHome}>
                <Text style={styles.buttonText}>Quay về trang chủ</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    icon: {
        width: 80,
        height: 80,
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLOR.red55,
        marginBottom: 12,
        textAlign: 'center',
    },
    desc: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        backgroundColor: COLOR.orange50,
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CancelledPanel;
