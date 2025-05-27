import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';

interface FindingDriverPanelProps {
    onCancel?: () => void;
}

const FindingDriverPanel: React.FC<FindingDriverPanelProps> = ({ onCancel }) => {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
        }).start();
    }, []);

    const progressWidth = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.panelContainer}>
            <Text style={styles.sectionTitle}>Đang tìm tài xế</Text>
            <View style={styles.driverInfoPanel}>
                <ActivityIndicator size="large" color="#FF9800" style={{ marginBottom: 16 }} />
                <Text style={styles.statusText}>Đang tìm tài xế phù hợp...</Text>
                <Text style={styles.infoLabel}>
                    Cần thêm chút thời gian để tìm, bạn thông cảm chờ một lát nhé.
                </Text>
                <View style={styles.progressBarBackground}>
                    <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
                </View>
                <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Hủy tìm tài xế</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    panelContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
        minHeight: 320,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
        textAlign: 'center',
    },
    driverInfoPanel: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF9800',
        marginBottom: 8,
        textAlign: 'center',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
    },
    progressBarBackground: {
        height: 5,
        backgroundColor: '#eee',
        borderRadius: 4,
        marginTop: 8,
        overflow: 'hidden',
        width: '100%',
        marginBottom: 20,
    },
    progressBarFill: {
        height: 5,
        backgroundColor: '#FF9800',
    },
    cancelButton: {
        marginTop: 8,
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

export default FindingDriverPanel;
