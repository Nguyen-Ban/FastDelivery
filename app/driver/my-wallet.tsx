import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    Image,
    Modal,
} from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MyWallet = () => {
    const router = useRouter();
    const [showPaymentModal, setShowPaymentModal] = useState(false);

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
                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={() => setShowPaymentModal(true)}>
                    <View style={styles.actionIconContainer}>
                        <MaterialCommunityIcons name="wallet-plus" size={24} color="#00BFA5" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Nạp tiền</Text>
                        <Text style={styles.actionSubtitle}>Tăng số dư để nhận đơn</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
                {/* Modal */}
                <Modal
                    visible={showPaymentModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowPaymentModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.paymentHeader}>
                                <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setShowPaymentModal(false)}
                                >
                                    <FontAwesome5 name="times" size={20} color="#00a651" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.paymentOption}>
                                <View style={styles.paymentIconBox}>
                                    <FontAwesome5 name="credit-card" size={20} color="#00a651" />
                                </View>
                                <Text style={styles.optionText}>Thẻ ATM</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.paymentOption}>
                                <View style={styles.paymentIconBox}>
                                    <FontAwesome5 name="dollar-sign" size={20} color="#00a651" />
                                </View>
                                <Text style={styles.optionText}>Nạp tiền bằng tài khoản ảo</Text>
                            </TouchableOpacity>


                        </View>
                    </View>
                </Modal>

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
            </View >
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    actionContent: {
        flex: 1,
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
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    actionList: {
        paddingHorizontal: 16,
    },
    actionSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    actionTitle: {
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    balance: {
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
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
    closeButton: {
        alignSelf: 'auto',
    },
    closeText: {
        fontSize: 16,
        color: 'blue',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        padding: 20,
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
    item: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 18,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    paymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    optionText: {
        fontSize: 16,
        paddingLeft: 10,
    },
    paymentIconBox: {
        width: 28,
        alignItems: 'center',
    },
    paymentOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default MyWallet;