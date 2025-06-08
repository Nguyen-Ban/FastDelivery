import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import COLOR from "@/constants/Colors";
import { PAYMENT_METHOD } from "@/types";
import { useOrder } from "@/contexts/order.context";

const vnpayLogo = require('@/assets/vnpay-logo.jpg')

interface BasePaymentMethod {
    id: string;
    name: string;
    defaultIcon: React.ReactNode;
    shortName: string;
}

interface VNPayMethod extends BasePaymentMethod {
    logo: any;
}

interface CashMethod extends BasePaymentMethod {
    selected?: boolean;
}

type PaymentMethod = VNPayMethod | CashMethod;

const PaymentMethods: VNPayMethod[] = [
    {
        id: PAYMENT_METHOD.VNPAY,
        name: 'Cổng VNPay',
        defaultIcon: <FontAwesome5 name="wallet" size={24} color={COLOR.blue40} />,
        shortName: 'Cổng VNPay',
        logo: vnpayLogo,
    },
];

const CashMethods: CashMethod[] = [
    {
        id: PAYMENT_METHOD.SENDER_CASH,
        name: 'Người gửi',
        defaultIcon: <FontAwesome5 name="money-bill-wave" size={24} color={COLOR.orange50} />,
        selected: true,
        shortName: 'Người gửi',
    },
    {
        id: PAYMENT_METHOD.RECEIVER_CASH,
        name: 'Người nhận',
        defaultIcon: <FontAwesome5 name="money-bill-wave" size={24} color={COLOR.orange50} />,
        shortName: 'Người nhận',
    },
];

// Combine all payment methods for easier lookup
const AllPaymentMethods: PaymentMethod[] = [...PaymentMethods, ...CashMethods];

interface PaymentProps {
    totalPrice: number;
}

const Payment = ({ totalPrice }: PaymentProps) => {
    const [modalVisible, setModalVisible] = useState(false);

    const { paymentMethod, setPaymentMethod } = useOrder();

    const handleSelectPayment = (id: PAYMENT_METHOD) => {
        setPaymentMethod(id);
        setModalVisible(false);
    };

    // Find the selected payment method
    const selectedPaymentMethod = AllPaymentMethods.find(method => method.id === paymentMethod);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.optionsRow]}
                onPress={() => setModalVisible(true)}
            >
                <View style={styles.option}>
                    <FontAwesome5 name="wallet" size={20} color={COLOR.blue40} />
                    <Text style={[styles.optionText]}>THANH TOÁN</Text>
                </View>
                <View style={styles.selectedMethodContainer}>
                    {selectedPaymentMethod && (
                        <>
                            {'logo' in selectedPaymentMethod ? (
                                <Image
                                    source={selectedPaymentMethod.logo}
                                    style={styles.paymentLogo}
                                    resizeMode="contain"
                                />
                            ) : (
                                selectedPaymentMethod.defaultIcon
                            )}
                            <Text style={styles.selectedMethodText}>
                                {selectedPaymentMethod.shortName || selectedPaymentMethod.name}
                            </Text>
                        </>
                    )}
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </View>
            </TouchableOpacity>

            <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Tổng phí</Text>
                    <Ionicons name="information-circle-outline" size={18} color="#ccc" />
                </View>
                <Text style={styles.totalAmount}>{totalPrice.toLocaleString()}đ</Text>
            </View>

            {/* Payment Method Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={[styles.modalHeader, styles.headerContainer]}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={28} color="#fff" />
                            </TouchableOpacity>
                            <Text style={[styles.modalTitle, styles.headerText2]}>Chọn phương thức thanh toán</Text>
                            <View style={{ width: 28 }} />
                        </View>

                        <View style={styles.methodsContainer}>
                            <Text style={styles.methodSectionTitle}>Thanh toán trực tuyến</Text>

                            {PaymentMethods.map(method => (
                                <TouchableOpacity
                                    key={method.id}
                                    style={styles.methodItem}
                                    onPress={() => handleSelectPayment(method.id as PAYMENT_METHOD)}
                                >
                                    <View style={styles.methodLeft}>
                                        <Image
                                            source={method.logo}
                                            style={styles.paymentLogo}
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.methodName}>{method.name}</Text>
                                    </View>

                                    <View style={styles.radioButtonContainer}>
                                        <View style={[
                                            styles.radioButton,
                                            paymentMethod === method.id && styles.radioSelected
                                        ]}>
                                            {paymentMethod === method.id && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            <Text style={[styles.methodSectionTitle, styles.cashTitle]}>Thanh toán bằng tiền mặt</Text>

                            {CashMethods.map(method => (
                                <TouchableOpacity
                                    key={method.id}
                                    style={styles.methodItem}
                                    onPress={() => handleSelectPayment(method.id as PAYMENT_METHOD)}
                                >
                                    <View style={styles.methodLeft}>
                                        {method.defaultIcon}
                                        <Text style={styles.methodName}>{method.name}</Text>
                                    </View>

                                    <View style={styles.radioButtonContainer}>
                                        <View style={[
                                            styles.radioButton,
                                            paymentMethod === method.id && styles.radioSelected
                                        ]}>
                                            {paymentMethod === method.id && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Payment;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        shadowColor: "#000",
    },
    headerContainer: {
        backgroundColor: COLOR.blue40,
    },
    headerText2: {
        color: "#fff"
    },
    optionsRow: {
        flexDirection: "row",
        marginBottom: 16,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
    },
    optionText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "500",
        color: "#666",
    },
    selectedMethodContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    selectedMethodText: {
        fontSize: 14,
        marginHorizontal: 8,
    },
    paymentLogo: {
        width: 35,
        height: 35,
    },
    totalSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    totalRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    totalText: {
        fontSize: 16,
        marginRight: 8,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLOR.orange50,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalContent: {
        flex: 1,
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
    methodsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    methodSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        color: COLOR.black,
    },
    cashTitle: {
        marginTop: 24,
    },
    methodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    methodName: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 16,
    },
    radioButtonContainer: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: COLOR.orange50,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLOR.orange50,
    },
}); 