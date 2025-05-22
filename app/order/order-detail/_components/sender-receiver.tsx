import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import COLOR from "../../../../constants/Colors";
import { useOrder } from "@/contexts/order.context";



const SenderReceiver = () => {
    const { sender, receiver } = useOrder();
    return (
        <View style={styles.container}>
            {/* Sender Section */}
            <View style={styles.section}>
                <View style={styles.header}>
                    <View style={[styles.iconContainer, styles.senderIcon]}>
                        <FontAwesome6 name="circle-user" size={24} color={COLOR.orange50} />
                    </View>
                    <Text style={styles.title}>Người gửi</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{sender?.name || "Chưa có tên"}</Text>
                    <Text style={styles.phone}>{sender?.phoneNumber || "Chưa có số điện thoại"}</Text>
                </View>
            </View>

            <View style={styles.separator} />

            {/* Receiver Section */}
            <View style={styles.section}>
                <View style={styles.header}>
                    <View style={[styles.iconContainer, styles.receiverIcon]}>
                        <FontAwesome6 name="circle-user" size={24} color={COLOR.blue_theme} />
                    </View>
                    <Text style={styles.title}>Người nhận</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{receiver?.name || "Chưa có tên"}</Text>
                    <Text style={styles.phone}>{receiver?.phoneNumber || "Chưa có số điện thoại"}</Text>
                </View>
            </View>
        </View>
    );
};

export default SenderReceiver;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    section: {
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    senderIcon: {
        backgroundColor: "#FEF3C7",
    },
    receiverIcon: {
        backgroundColor: "#E3F2FD",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 12,
    },
    separator: {
        height: 1,
        backgroundColor: "#eee",
        marginHorizontal: 16,
    },
    infoContainer: {
        marginLeft: 52,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    phone: {
        fontSize: 14,
        color: COLOR.grey50,
        marginBottom: 8,
    },
    noteContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    noteIcon: {
        marginTop: 2,
        marginRight: 8,
    },
    note: {
        flex: 1,
        fontSize: 14,
        color: COLOR.grey50,
    },
}); 