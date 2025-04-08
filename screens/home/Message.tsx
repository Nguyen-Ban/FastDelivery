import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

const Message = () => {
  return (
    <View style={GLOBAL.container}>
      <Text>Account</Text>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({});
