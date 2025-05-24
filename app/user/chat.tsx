import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import GLOBAL from "../../constants/GlobalStyles";
import COLOR from "@/constants/Colors";

import InfoCard from "@/components/InfoCard";
import Button from "@/components/Button/ButtonComponent";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

const ChatScreen = () => {
  const driver = {
    name: "Nguyễn Văn A",
    phone: "0123456789",
    vehicleType: "MOTORCYCLE",
    vehiclePlate: "59A1-23456",
  };
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello!", sender: "other" },
    { id: "2", text: "Hi there, how are you?", sender: "me" },
    { id: "3", text: "I'm good, thanks! How about you?", sender: "other" },
    { id: "4", text: "Doing well, thank you!", sender: "me" },
  ]);
  const [input, setInput] = useState("");
  return (
    <KeyboardAvoidingView style={GLOBAL.home_container}>
      <View style={styles.header}>
        <LinearGradient
          colors={[COLOR.blue70, COLOR.orange70]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 16 }}
          >
            <FontAwesome6 name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>{driver.name}</Text>
        </LinearGradient>
      </View>
      {/* ScrollView to display messages */}
      <ScrollView contentContainerStyle={styles.messages_container}>
        {messages.map((msg, index) => {
          const isMe = msg.sender === "me";
          return (
            <View
              key={index}
              style={[
                styles.message_bubble,
                isMe ? styles.sent_bubble : styles.received_bubble,
              ]}
            >
              <Text style={styles.message_text}>{msg.text}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.message_input_view}>
        <TextInput
          style={styles.text_input}
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
        />
        <TouchableOpacity
          onPress={() => {
            if (input.trim()) {
              setMessages([
                ...messages,
                { id: Date.now().toString(), text: input, sender: "me" },
              ]);
              setInput("");
            }
          }}
        >
          <Ionicons name="send" size={25} color={COLOR.black} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    paddingLeft: 16,
    fontSize: 24,
    fontWeight: "bold",
  },
  message_view: { flex: 1 },
  message_input_view: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLOR.orange90,
  },
  text_input: { width: "100%", paddingLeft: 24, fontSize: 16 },
  messages_container: {
    padding: 10,
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  message_bubble: {
    maxWidth: "75%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 16,
  },
  sent_bubble: {
    alignSelf: "flex-end",
    backgroundColor: COLOR.blue70,
  },
  received_bubble: {
    alignSelf: "flex-start",
    backgroundColor: COLOR.orange70,
  },
  message_text: {
    fontSize: 16,
  },
});
