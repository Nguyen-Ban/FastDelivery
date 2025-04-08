import COLOR from "@/constants/Colors";
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  ImageSourcePropType,
} from "react-native";

/**
 * Button component
 * @param {string} title - Button title
 * @param {function} onPress - Function to be called when button is pressed
 * @param {string} size - Button size: large | small
 * @param {string} type - Button type: primary | sub
 * @param {boolean} disabled - Button disabled state
 * @param {boolean} loading - Button loading state
 * @param {object} style - Additional style
 * @param {object} textStyle - Additional text style
 * @param {React.ReactNode} rightImg - Path to right image
 * @param {React.ReactNode} leftImg - Path to left image
 }}
 */

/* TODO: integrate loading state to Button Component */
interface ButtonProps {
  title: string;
  onPress: () => void;
  size: "large" | "small";
  type: "primary" | "sub";
  disabled?: boolean;
  loading?: boolean;
  style?: object;
  textStyle?: object;
  rightImg?: React.ReactNode;
  leftImg?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  size,
  type,
  disabled = false,
  style,
  textStyle,
  rightImg,
  leftImg,
}) => {
  const buttonStyle = [
    styles.button,
    size === "large" ? styles.largeButton : styles.smallButton,
    type === "primary" ? styles.primary : styles.sub,
    disabled && styles.disabledButton,
    style,
  ];
  const buttonTextStyle = [
    type === "primary" ? styles.textPrimary : styles.textSub,
    size === "large" ? styles.textLarge : styles.textSmall,
    disabled && styles.disabledText,
    textStyle,
    { paddingHorizontal: 5 },
  ];
  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
      <View style={styles.contentContainer}>
        {leftImg}
        <Text style={buttonTextStyle}>{title}</Text>
        {rightImg}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    marginHorizontal: 5,
    width: 20,
    height: 20,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
  },
  textPrimary: {
    color: COLOR.white,
    fontWeight: "bold",
  },
  textSub: {
    color: COLOR.grey50,
    fontWeight: "bold",
  },
  primary: {
    backgroundColor: COLOR.blue_theme,
  },
  sub: {
    backgroundColor: COLOR.white,
    borderWidth: 2,
    borderColor: COLOR.grey70,
  },
  textLarge: {
    fontSize: 16,
  },
  textSmall: {
    fontSize: 12,
  },
  largeButton: {
    width: "100%",
  },
  smallButton: {
    width: "30%",
  },
  disabledButton: {
    backgroundColor: COLOR.grey90,
  },
  disabledText: {
    color: COLOR.grey50,
  },
});

export default Button;
