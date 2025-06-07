import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    Platform,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDriver } from "@/contexts";



const Profile = () => {
    const { driverInfo } = useDriver()
    const router = useRouter();

    const handleEditProfile = () => {
        Alert.alert("Chức năng đang phát triển", "Bạn sẽ sớm chỉnh sửa được hồ sơ!");
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBox}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hồ sơ</Text>
                <View style={styles.headerIconBox} />
            </View>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.name}>{driverInfo?.fullName}</Text>
                <Text style={styles.phone}>{driverInfo?.phoneNumber}</Text>

                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="email" size={20} color="#00a651" style={styles.infoIcon} />
                        <Text style={styles.infoLabel}>Giấy phép lái xe:</Text>
                        <Text style={styles.infoValue}>{driverInfo?.licenseNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="motorcycle" size={20} color="#00a651" style={styles.infoIcon} />
                        <Text style={styles.infoLabel}>Phương tiện:</Text>
                        <Text style={styles.infoValue}>{driverInfo?.vehicleType}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="confirmation-number" size={20} color="#00a651" style={styles.infoIcon} />
                        <Text style={styles.infoLabel}>Biển số xe:</Text>
                        <Text style={styles.infoValue}>{driverInfo?.vehiclePlate}</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
    },
    headerIconBox: {
        width: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#222",
    },
    content: {
        alignItems: "center",
        padding: 24,
    },
    avatarBox: {
        position: "relative",
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#00a651",
    },
    editAvatarBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#00a651",
        borderRadius: 16,
        padding: 6,
        borderWidth: 2,
        borderColor: "#fff",
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#222",
    },
    phone: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16,
    },
    infoSection: {
        width: "100%",
        backgroundColor: "#f7f7f7",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    infoIcon: {
        marginRight: 8,
    },
    infoLabel: {
        fontSize: 15,
        color: "#444",
        width: 100,
    },
    infoValue: {
        fontSize: 15,
        color: "#222",
        flex: 1,
    },
    editBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#00a651",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginBottom: 16,
    },
    editBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e53935",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
    },
    logoutBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});

export default Profile;