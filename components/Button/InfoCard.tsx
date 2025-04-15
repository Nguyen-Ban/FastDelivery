import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

interface InfoCardProps {
  title: string;
  subtitle: string;
  onPress: () => void;
  icon?: React.ReactNode;
  iconSize?: number;
  iconColor?: string;
  iconContainerStyle?: object;
  style?: object;
  titleStyle?: object;
  subtitleStyle?: object;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subtitle,
  onPress,
  icon,
  iconColor,
  iconSize,
  iconContainerStyle,
  titleStyle,
  subtitleStyle,
  style,
}) => {
  const cardStyle = [styles.container, style];
  const titleTextStyle = [styles.title, titleStyle];
  const subtitleTextStyle = [styles.subtitle, subtitleStyle];
  const iconViewStyle = [styles.iconView, iconContainerStyle];
  return (
    <TouchableOpacity onPress={onPress} style={cardStyle}>
      <View style={iconViewStyle}>{icon}</View>
      <View style={styles.contentView}>
        <Text style={titleTextStyle}>{title}</Text>
        <Text style={subtitleTextStyle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  container: { width: "100%", height: "auto", flexDirection: "row" },
  iconView: { justifyContent: "center", alignContent: "center" },
  contentView: { flexDirection: "column" },
  title: { fontSize: 16 },
  subtitle: { fontSize: 12 },
});
