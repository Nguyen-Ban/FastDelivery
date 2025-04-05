import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/screens/Home";
import AuthMethod from "@/screens/authentication/AuthMethod";
import OTPVerify from "@/screens/authentication/OTPVerify";
import UserInfo from "@/screens/authentication/UserInfo";
import Order from "@/screens/order/Order";
import LocationPick from "@/screens/order/LocationPick";
import ClientInfo from "@/screens/order/ClientInfo";
import OrderDetail from "@/screens/order/OrderDetail";
import GoodsDetail from "@/screens/order/GoodsDetail";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AuthMethod" component={AuthMethod} />
      <Stack.Screen name="OTPVerify" component={OTPVerify} />
      <Stack.Screen name="UserInfo" component={UserInfo} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="LocationPick" component={LocationPick} />
      <Stack.Screen name="ClientInfo" component={ClientInfo} />
      <Stack.Screen name="OrderDetail" component={OrderDetail} />
      <Stack.Screen name="GoodsDetail" component={GoodsDetail} />
    </Stack.Navigator>
  );
}