import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MyWallet = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ví tài xế</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Balance Card */}
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Số dư</Text>
                <Text style={styles.balanceAmount}>508.224đ</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionList}>
                {/* Top Up */}
                <TouchableOpacity style={styles.actionItem}>
                    <View style={styles.actionIconContainer}>
                        <MaterialCommunityIcons name="wallet-plus" size={24} color="#00BFA5" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Nạp tiền</Text>
                        <Text style={styles.actionSubtitle}>Tăng số dư để nhận đơn</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>

                {/* Withdraw */}
                <TouchableOpacity style={styles.actionItem}>
                    <View style={styles.actionIconContainer}>
                        <MaterialCommunityIcons name="bank-transfer" size={24} color="#00BFA5" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Rút tiền</Text>
                        <Text style={styles.actionSubtitle}>Chuyển tiền ra tài khoản ngân hàng</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>

                {/* Transaction History */}
                <TouchableOpacity style={styles.actionItem}>
                    <View style={styles.actionIconContainer}>
                        <MaterialCommunityIcons name="clock-outline" size={24} color="#00BFA5" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Lịch sử giao dịch</Text>
                        <Text style={styles.actionSubtitle}>Xem tất cả giao dịch</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
            </View>
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
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    balanceCard: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 16,
    },
    balanceLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
    },
    actionList: {
        paddingHorizontal: 16,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    actionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e6f7f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 14,
        color: '#666',
    },
});

export default MyWallet; 