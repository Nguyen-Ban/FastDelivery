import React from "react";
import HomeScreen from "../screens/Home";
import AuthMethod from "../screens/authentication/AuthMethod";
import OTPVerify from "../screens/authentication/OTPVerify";
import UserInfo from "../screens/authentication/UserInfo";
import Order from "../screens/order/Order";
import LocationPick from "../screens/order/LocationPick";
import RecipientInfo from "../screens/order/RecipientInfo";
import OrderDetail from "../screens/order/OrderDetail";

export default function App() {
  return <OTPVerify />;
}
