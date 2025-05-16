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

const userData = {
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@email.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    vehicle: "Xe máy",
    licensePlate: "59X1-123.45",
};

const Profile = () => {
    const [user, setUser] = useState(userData);
    const router = useRouter();

    const handleEditProfile = () => {
        Alert.alert("Chức năng đang phát triển", "Bạn sẽ sớm chỉnh sửa được hồ sơ!");
    };

    const handleLogout = () => {
        Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
            { text: "Huỷ" },
            { text: "Đăng xuất", style: "destructive", onPress: () => {/* TODO: Thực hiện đăng xuất */ } },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBox}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông báo</Text>
                <View style={styles.headerIconBox} />
            </View>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarBox}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <TouchableOpacity style={styles.editAvatarBtn} onPress={handleEditProfile}>
                        <Ionicons name="camera" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.phone}>{user.phone}</Text>

                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="email" size={20} color="#00a651" style={styles.infoIcon} />
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoValue}>{user.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="motorcycle" size={20} color="#00a651" style={styles.infoIcon} />
                        <Text style={styles.infoLabel}>Phương tiện:</Text>
                        <Text style={styles.infoValue}>{user.vehicle}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="confirmation-number" size={20} color="#00a651" style={styles.infoIcon} />
                        <Text style={styles.infoLabel}>Biển số xe:</Text>
                        <Text style={styles.infoValue}>{user.licensePlate}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
                    <Ionicons name="create-outline" size={20} color="#fff" />
                    <Text style={styles.editBtnText}>Chỉnh sửa hồ sơ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.logoutBtnText}>Đăng xuất</Text>
                </TouchableOpacity>
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