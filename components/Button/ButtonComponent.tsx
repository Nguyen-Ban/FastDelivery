import COLOR from "@/constants/Colors";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from "react-native";

/**
 * Button component
 * @param {string} title - Button title
 * @param {function} onPress - Function to be called when button is pressed
 * @param {string} size - Button size  
 * @param {boolean} disabled - Button disabled state
 * @param {boolean} loading - Button loading state
 * @param {object} style - Additional style
 * @param {object} textStyle - Additional text style
 }}
 */

 /* TODO: integrate loading state to Button Component */
interface ButtonProps {
    title: string;
    onPress: () => void;
    size: 'large' | 'small';
    disabled?: boolean;
    loading?: boolean;
    style?: object;
    textStyle?: object;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    size, 
    disabled = false,
    style, 
    textStyle
}) => {
    const buttonStyle = [
        styles.button,
        size === 'large' ? styles.largeButton : styles.smallButton,
        disabled && styles.disabledButton,
        style,
      ];
      const buttonTextStyle = [
        styles.text,
        size === 'large' ? styles.textLarge : styles.textSmall,
        disabled && styles.disabledText,
        textStyle,
      ];
    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled}
        >  
            <Text style={buttonTextStyle}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        borderRadius: 8,
        backgroundColor: COLOR.blue_theme,
    },
    text: {
        color: COLOR.white,
        fontWeight: "bold",
    },
    textLarge: {
        fontSize: 16,      
    },
    textSmall: {
        fontSize: 12,      
    },  
    largeButton: {
        width: '100%',
        height: 60,
    },
    smallButton: {
        width: '25%',
        height: 48,
    },
    disabledButton: {
        backgroundColor: COLOR.grey90,
    },
    disabledText: {
        color: COLOR.grey50,
    },
});

export default Button;