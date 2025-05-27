import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
} from "react-native";

import GLOBAL from "../../../constants/GlobalStyles";
import COLOR from "@/constants/Colors";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useAuth } from "@/contexts";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Message } from "@/types";
import socket from "@/services/socket";

const ChatScreen = () => {
  const { user } = useAuth();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [customerName, setCustomerName] = useState();
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesRef = useRef<Message[]>([]);

  const [input, setInput] = useState("");

  useEffect(() => {
    socket.emit('chat:getCustomerName', { orderId }, (response) => {
      if (response.success) setCustomerName(response.data.customerName)
    })

    socket.emit('chat:getMessageHistory', { orderId }, (response) => {
      if (response.success) setMessages(response.data.message)
    })

    socket.on('chat:newMessage', (response) => {
      if (response.success) setMessages([...messages, response.data.message])
    })


    return () => {
      socket.off('chat:newMessage');
    };
  }, [])

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
          <Text style={styles.title}>{customerName}</Text>
        </LinearGradient>
      </View>
      {/* ScrollView to display messages */}

      <FlatList contentContainerStyle={styles.messages_container}
        data={messages}
        renderItem={({ item }) => (
          <View
            style={
              [
                styles.message_bubble,
                item.senderId === user?.id ? styles.sent_bubble : styles.received_bubble
              ]}
          >
            <Text style={styles.message_text}>{item.content}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        inverted={true} // 👈 Tin nhắn mới ở dưới cùng
      />

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
              const message: Message = {
                id: input + "-" + new Date().toISOString(),
                content: input,
                senderId: user?.id,
                orderId: orderId
              }
              messagesRef.current.unshift(message)
              setMessages([...messagesRef.current]);
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
