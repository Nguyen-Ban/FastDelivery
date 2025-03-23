import React from "react";

import {View, Text, Image, StyleSheet, TouchableOpacity} from "react-native";
import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import { OtpInput } from "react-native-otp-entry";
import GLOBAL from "../../constants/GlobalStyles";

const OTPVerify = () => {

    return (
        <View style={GLOBAL.container}>
            <TouchableOpacity>
                <Image source={require("../../assets/images/back.png")} style={styles.backImage}/>
            </TouchableOpacity>
            <Text style={styles.otpText}>Mã xác thực OTP</Text>
            <Image source={require("../../assets/images/message.png")} style={styles.phoneImg}/>
            <Text style={styles.subTitle}>Nhập mã gồm 6 chữ số mà bạn đã nhận được qua Tin nhắn điện thoại</Text>
            <Text style={styles.phoneNum}>+84xxxxxxxxx</Text>
            <OtpInput
                numberOfDigits={6}
                focusColor={COLOR.blue_theme}
            />
            <View style={styles.resendTimerView}>
                <Text style = {styles.resendLabel}>Gửi lại mã sau:</Text>
                <Text style = {styles.timer}>30</Text>
            </View>
            <Button
                title="Gửi lại mã"
                onPress={() => {}}
                size="small"
                type="primary"
                disabled={true}
                style={styles.resendAddStyles}
            />
        </View>
    );
};

export default OTPVerify;

const styles = StyleSheet.create({
    backImage: {
        width: 25,
        height: 25,
    },
    otpText: {
        fontSize: 24,
        fontWeight: "bold",
        paddingTop: 25,
        paddingBottom: 15,
    },
    phoneImg: {
        width: 100,
        height: 100,
        alignSelf: "center",
    },
    subTitle: {
        fontSize: 16,
        alignSelf: "flex-start",
        paddingTop: 15,
    },
    phoneNum: {
        fontSize: 16,
        fontWeight: "bold",
        paddingBottom: 15,
    },
    resendAddStyles: {
        marginTop: 5,
        alignSelf: "center",
    },
    resendTimerView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50,
    },
    resendLabel: {
        paddingHorizontal: 3,
        fontSize: 16,
    },
    timer: {
        fontSize: 16,
        fontWeight: "bold",
    }
});