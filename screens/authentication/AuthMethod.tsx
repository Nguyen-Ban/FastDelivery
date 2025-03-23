import React, { useRef, useState } from "react";

import {View, Text, StyleSheet} from "react-native";
import PhoneInput from "react-native-international-phone-number"
import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";


const AuthMethod = () => {
    const phoneInput = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    const handlePhoneNumberChange = (formattedNumber: string) => {
        setPhoneNumber(formattedNumber);
        setIsDisabled(formattedNumber.length < 10); 
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng ký/Đăng nhập với số điện thoại</Text>
            <PhoneInput 
                ref={phoneInput}
                defaultCountry="VN"
                placeholder="Nhập số điện thoại"
                allowZeroAfterCallingCode={false}
                phoneInputStyles={{
                    container: {
                        borderColor: isFocused ? COLOR.blue_theme : COLOR.grey90,
                        borderWidth: 2,
                    },
                }}
                onChange={(e) => handlePhoneNumberChange(e.nativeEvent.text)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <Text style={styles.policy}>Bằng cách nhấn nút Tiếp tục, bạn đã đồng ý với các Điều kiện và Điều khoản cùa FastDelivery.</Text>
            <Button
                title="Tiếp tục"
                onPress={() => {}}
                size="large"
                type="primary"
                disabled={isDisabled}           
            />
            <View style={styles.otherAuthContainer}>
                <View style = {styles.line}/>
                <Text style = {styles.otherAuthText}>Hoặc đăng nhập bằng</Text>
                <View style = {styles.line}/>
            </View>   
            <Button
                title="Google"
                onPress={() => {}}
                size="large"
                type="sub"
                leftImg={require("../../assets/images/google.png")}
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
    otherAuthText: {
        padding: 8,
        paddingTop: 16,
        fontSize: 12,
        color: COLOR.grey50,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: COLOR.grey90,
    },
    otherAuthContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default AuthMethod;