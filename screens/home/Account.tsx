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

const Account = () => {
  return (
    <View style={GLOBAL.container}>
      <Text>Hello, World!</Text>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({});
