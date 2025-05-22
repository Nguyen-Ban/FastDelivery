import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    Platform,
    TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLOR from '../../constants/Colors';
import GLOBAL from '../../constants/GlobalStyles';
import Button from '../../components/Button/ButtonComponent';
import driverService from '../../services/driver.service';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';

const DriverRegistration = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        licenseNumber: '',
        vehiclePlate: '',
        vehicleType: 'MOTORBIKE',
        acceptTerms: false,
    });

    const benefits = [
        {
            title: 'Thu nhập hấp dẫn',
            description: 'Kiếm thêm thu nhập với mức thưởng hấp dẫn',
            icon: '💰'
        },
        {
            title: 'Thời gian linh hoạt',
            description: 'Chủ động sắp xếp thời gian làm việc',
            icon: '⏰'
        },
        {
            title: 'Hỗ trợ 24/7',
            description: 'Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ',
            icon: '🎯'
        },
    ];

    const handleRegister = async () => {
        if (!formData.acceptTerms) {
            Alert.alert('Thông báo', 'Vui lòng chấp nhận điều khoản để tiếp tục');
            return;
        }

        if (!formData.licenseNumber || !formData.vehiclePlate) {
            Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            const response = await driverService.registerDriver({
                licenseNumber: formData.licenseNumber,
                vehiclePlate: formData.vehiclePlate,
                vehicleType: formData.vehicleType,
            });

            if (response.success) {
                Alert.alert('Thành công', 'Đăng ký tài xế thành công', [
                    { text: 'OK', onPress: () => router.push('/driver') }
                ]);
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {!showForm ? (
                    <View style={styles.benefitsContainer}>
                        {/* <Image
                            source={require('../../assets/driver-banner.png')}
                            style={styles.banner}
                            resizeMode="cover"
                        /> */}
                        <Text style={styles.title}>Trở thành tài xế Fast Delivery</Text>
                        <Text style={styles.subtitle}>
                            Tham gia cộng đồng tài xế của chúng tôi và tận hưởng những quyền lợi hấp dẫn
                        </Text>

                        {benefits.map((benefit, index) => (
                            <View key={index} style={styles.benefitItem}>
                                <Text style={styles.benefitIcon}>{benefit.icon}</Text>
                                <View style={styles.benefitContent}>
                                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                                    <Text style={styles.benefitDescription}>{benefit.description}</Text>
                                </View>
                            </View>
                        ))}

                        <Button
                            title="Bắt đầu ngay"
                            onPress={() => setShowForm(true)}
                            type="primary"
                            size="large"
                            style={styles.startButton}
                        />
                    </View>
                ) : (
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Đăng ký tài xế</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Số giấy phép lái xe</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.licenseNumber}
                                onChangeText={(text) => setFormData({ ...formData, licenseNumber: text })}
                                placeholder="Nhập số GPLX"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Biển số xe</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.vehiclePlate}
                                onChangeText={(text) => setFormData({ ...formData, vehiclePlate: text })}
                                placeholder="Nhập biển số xe"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Loại phương tiện</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.vehicleType}
                                    onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Xe máy" value="MOTORBIKE" />
                                    <Picker.Item label="Ô tô" value="CAR" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.termsContainer}>
                            <Checkbox
                                value={formData.acceptTerms}
                                onValueChange={(value) => setFormData({ ...formData, acceptTerms: value })}
                                color={formData.acceptTerms ? COLOR.blue40 : undefined}
                            />
                            <Text style={styles.termsText}>
                                Tôi đồng ý với các điều khoản và điều kiện của Fast Delivery
                            </Text>
                        </View>

                        <Button
                            title="Đăng ký"
                            onPress={handleRegister}
                            type="primary"
                            size="large"
                            style={styles.registerButton}
                        />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.white,
    },
    scrollView: {
        flex: 1,
    },
    benefitsContainer: {
        padding: 20,
    },
    banner: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLOR.grey50,
        textAlign: 'center',
        marginBottom: 30,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: COLOR.blue95,
        padding: 15,
        borderRadius: 10,
    },
    benefitIcon: {
        fontSize: 30,
        marginRight: 15,
    },
    benefitContent: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    benefitDescription: {
        fontSize: 14,
        color: COLOR.grey50,
    },
    startButton: {
        marginTop: 20,
    },
    formContainer: {
        padding: 20,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: COLOR.grey70,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: COLOR.grey70,
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    termsText: {
        marginLeft: 10,
        flex: 1,
        color: COLOR.grey50,
    },
    registerButton: {
        marginTop: 10,
    },
});

export default DriverRegistration; 