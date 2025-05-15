import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import COLOR from "../../../../constants/Colors";

interface SenderReceiverProps {
    senderName?: string;
    senderPhone?: string;
    senderNote?: string;
    receiverName?: string;
    receiverPhone?: string;
    receiverNote?: string;
}

const SenderReceiver: React.FC<SenderReceiverProps> = ({
    senderName,
    senderPhone,
    senderNote,
    receiverName,
    receiverPhone,
    receiverNote
}) => {
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
                    <Text style={styles.name}>{senderName || "Chưa có tên"}</Text>
                    <Text style={styles.phone}>{senderPhone || "Chưa có số điện thoại"}</Text>
                    {senderNote && (
                        <View style={styles.noteContainer}>
                            <Ionicons name="document-text-outline" size={16} color={COLOR.grey50} style={styles.noteIcon} />
                            <Text style={styles.note} numberOfLines={2}>
                                {senderNote}
                            </Text>
                        </View>
                    )}
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
                    <Text style={styles.name}>{receiverName || "Chưa có tên"}</Text>
                    <Text style={styles.phone}>{receiverPhone || "Chưa có số điện thoại"}</Text>
                    {receiverNote && (
                        <View style={styles.noteContainer}>
                            <Ionicons name="document-text-outline" size={16} color={COLOR.grey50} style={styles.noteIcon} />
                            <Text style={styles.note} numberOfLines={2}>
                                {receiverNote}
                            </Text>
                        </View>
                    )}
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