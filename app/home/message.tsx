import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";
import InfoCard from "@/components/Button/InfoCard";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Message = () => {
  //hard code for UI
  const chats = [
    { id: "1", title: "Title1", subtitle: "Subtitle1" },
    { id: "2", title: "Title2", subtitle: "Subtitle2" },
    { id: "3", title: "Title3", subtitle: "Subtitle3" },
  ];

  return (
    <View style={GLOBAL.container}>
      <Text style={GLOBAL.home_title}>Tin nhắn</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InfoCard
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => {}}
            icon={<FontAwesome6 name="user" size={24} color={COLOR.black} />}
            iconContainerStyle={{
              paddingRight: 20,
            }}
            style={styles.card}
          />
        )}
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTopColor: COLOR.grey70,
          borderTopWidth: 1,
        }}
      ></FlatList>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  card: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLOR.blue40,
    backgroundColor: COLOR.blue95,
  },
});
