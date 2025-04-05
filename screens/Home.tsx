import React from "react";
import { View, Text, StyleSheet} from "react-native";
import { useRouter } from "expo-router";
import Button from "../components/Button/ButtonComponent";
  
// Define the type for the navigation stack parameters
// This should match the screens you have in your app
// and their respective parameters (if any).
// For example, if you have a screen that takes parameters,
// you would define it like this:
// type RootStackParamList = {
//   ScreenName: { paramName: string; };
//   AnotherScreen: undefined; // No parameters
// };

const HomeScreen = () => {

  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, World!</Text>
      <Text style={styles.text}>Welcome to the Home Screen</Text>
      <Text style={styles.text}>This is a sample application.</Text>
      <Text style={styles.text}>You can navigate to other screens.</Text>

      {/* Authentication-related screens */}
      <Button title="Go to AuthMethod" onPress={() => router.push("../authentication/AuthMethod")} size="small" type="primary" />
      <Button title="Go to UserInfo" onPress={() => router.push("../authentication/UserInfo")} size="small" type="primary" />
      <Button title="Go to OTPVerify" onPress={() => router.push("../authentication/OTPVerify")} size="small" type="primary" />

      {/* Order-related screens */}
      <Button title="Go to Order" onPress={() => router.push("../order/Order")} size="small" type="primary" />
      <Button title="Go to LocationPick" onPress={() => router.push("../order/LocationPick")} size="small" type="primary" />
      <Button title="Go to ClientInfo" onPress={() => router.push("../order/ClientInfo")} size="small" type="primary" />
      <Button title="Go to OrderDetail" onPress={() => router.push("../order/OrderDetail")} size="small" type="primary" />
      <Button title="Go to GoodsDetail" onPress={() => router.push("../order/GoodsDetail")} size="small" type="primary" />

      {/* Add more buttons for other screens as needed */}
      {/* <Button title="Go to AnotherScreen" onPress={() => router.push("/AnotherScreen")} size="small" type="primary" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default HomeScreen;
