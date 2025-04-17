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
import InfoCard from "../../components/Button/InfoCard";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Activity = () => {
  //hard code
  const activities = [
    { id: "1", title: "Title1", subtitle: "Subtitle1" },
    { id: "2", title: "Title2", subtitle: "Subtitle2" },
    { id: "3", title: "Title3", subtitle: "Subtitle3" },
  ];

  return (
    <View style={GLOBAL.container}>
      <Text style={GLOBAL.home_title}>Hoạt động</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InfoCard
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => {}}
            style={{ paddingVertical: 10 }}
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

export default Activity;

const styles = StyleSheet.create({});
