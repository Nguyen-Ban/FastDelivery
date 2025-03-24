import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from "react-native";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

const Location = () => {
    return (
        <View style = {[GLOBAL.container, {justifyContent: "space-between"}]}>
            <View style = {styles.header}>
                <TouchableOpacity>
                    <Image 
                        source = {require("../../assets/images/back.png")} 
                        style = {styles.image}
                        ></Image>
                </TouchableOpacity> 
                <Text style = {styles.label}>Chọn điểm đến/đi</Text>
                <View style = {styles.locationInputView}>
                    <Image 
                        source = {require("../../assets/images/location.png")}
                        style = {styles.small_icon}
                    ></Image>
                    <TextInput 
                        style = {styles.locationInput}
                        placeholder="Nhập địa chỉ"
                    ></TextInput>
                </View>
            </View>
            <Button
                title="Chọn trên bản đồ"
                onPress={() => {}}
                type="primary"
                size="large"
                leftImg={require("../../assets/images/map.png")}
            />
        </View>
    );
};

export default Location;

const styles = StyleSheet.create({
    image: {
        width: 25,
        height: 25,
    },
    header: {   
        alignItems: "flex-start",
    },
    label: {
        fontSize: 24,
        fontWeight: "bold",
        paddingVertical: 30,
    },
    locationInputView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderRadius: 8,
        backgroundColor: COLOR.grey90,
        marginVertical: "10%",  
        width: "100%",
    },
    small_icon: {
        width: 25,
        height: 25,
        marginHorizontal: 10,   
    },
    locationInput: {
        fontSize: 16,
        height: 50,
        flex: 1,    
    },
});