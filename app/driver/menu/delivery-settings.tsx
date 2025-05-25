import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DeliverySettings = () => {
    const router = useRouter();
    const [settings, setSettings] = useState({
        xanhExpress: true,
        xanhChuyen: true,
        doorDelivery: true,
        insurance: true,
        cashOnDelivery: true,
        autoAccept: false,
    });

    const toggleSwitch = (key: keyof typeof settings) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [key]: !prevSettings[key]
        }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thiết lập vận chuyển</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Settings List */}
            <View style={styles.settingsList}>
                {/* Services Section */}
                <Text style={styles.sectionTitle}>Dịch vụ</Text>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Fast & Furious</Text>
                    <Switch
                        trackColor={{ false: '#e0e0e0', true: '#9fe5d9' }}
                        thumbColor={settings.xanhExpress ? '#00BFA5' : '#f4f3f4'}
                        onValueChange={() => toggleSwitch('xanhExpress')}
                        value={settings.xanhExpress}
                    />
                </View>

                {/* <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Fast </Text>
                    <Switch
                        trackColor={{ false: '#e0e0e0', true: '#9fe5d9' }}
                        thumbColor={settings.xanhChuyen ? '#00BFA5' : '#f4f3f4'}
                        onValueChange={() => toggleSwitch('xanhChuyen')}
                        value={settings.xanhChuyen}
                    />
                </View> */}


                {/* Order Mode Section */}
                <Text style={[styles.sectionTitle, styles.sectionTitleWithSpace]}>Chế độ nhận đơn</Text>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Tự động nhận đơn</Text>
                    <Switch
                        trackColor={{ false: '#e0e0e0', true: '#9fe5d9' }}
                        thumbColor={settings.autoAccept ? '#00BFA5' : '#f4f3f4'}
                        onValueChange={() => toggleSwitch('autoAccept')}
                        value={settings.autoAccept}
                    />
                </View>

                {/* Additional Services Section */}
                <Text style={[styles.sectionTitle, styles.sectionTitleWithSpace]}>Dịch vụ thêm</Text>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Giao hàng tận cửa</Text>
                    <Switch
                        trackColor={{ false: '#e0e0e0', true: '#9fe5d9' }}
                        thumbColor={settings.doorDelivery ? '#00BFA5' : '#f4f3f4'}
                        onValueChange={() => toggleSwitch('doorDelivery')}
                        value={settings.doorDelivery}
                    />
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Bảo hiểm</Text>
                    <Switch
                        trackColor={{ false: '#e0e0e0', true: '#9fe5d9' }}
                        thumbColor={settings.insurance ? '#00BFA5' : '#f4f3f4'}
                        onValueChange={() => toggleSwitch('insurance')}
                        value={settings.insurance}
                    />
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Giao hàng ứng tiền</Text>
                    <Switch
                        trackColor={{ false: '#e0e0e0', true: '#9fe5d9' }}
                        thumbColor={settings.cashOnDelivery ? '#00BFA5' : '#f4f3f4'}
                        onValueChange={() => toggleSwitch('cashOnDelivery')}
                        value={settings.cashOnDelivery}
                    />
                </View>

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
    settingsList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    sectionTitleWithSpace: {
        marginTop: 24,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingItemWithArrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
    },
    settingSubtext: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    circleProgress: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressInner: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
});

export default DeliverySettings; 