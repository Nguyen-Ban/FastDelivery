import React, { useRef, useState } from "react";

import {View, Text, StyleSheet} from "react-native";
import PhoneInput from "react-native-international-phone-number"
import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";


const AuthMethod = () => {
    const phoneInput = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng ký/Đăng nhập với số điện thoại</Text>
            <PhoneInput 
                ref={phoneInput}
                defaultCountry="VN"
                placeholder="Nhập số điện thoại"
                phoneInputStyles={{
                    container: {
                        borderColor: isFocused ? COLOR.blue_theme : COLOR.grey90,
                        borderWidth: 2,
                    },
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <Text style={styles.policy}>Bằng cách nhấn nút Tiếp tục, bạn đã đồng ý với các Điều kiện và Điều khoản cùa FastDelivery.</Text>
            <Button
                title="Tiếp tục"
                onPress={() => {}}
                size="large"
                disabled={phoneNumber === ''}
                //TODO: Update disable state when phone number is valid
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        paddingBottom: 16,
        alignSelf: "flex-start",
    },
    policy: {
        paddingTop: 16,
        fontSize: 12,
        color: COLOR.grey50,
        paddingBottom: 16,
        alignSelf: "flex-start",
    },
    phoneInputFocused: {
        borderColor: COLOR.blue_theme,
        borderWidth: 2,
    }
});

export default AuthMethod;