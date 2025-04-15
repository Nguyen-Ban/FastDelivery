import { StyleSheet } from "react-native";
import COLOR from "./Colors";

const GlobalStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    padding: 16,
    alignContent: "center",
    justifyContent: "flex-start",
    backgroundColor: COLOR.white,
  },
  home_title: { fontSize: 24, fontWeight: "bold", alignSelf: "center" },
});

export default GlobalStyles;
