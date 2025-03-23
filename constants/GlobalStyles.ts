import { StyleSheet } from "react-native";
import COLOR from "./Colors";

const GlobalStyles = StyleSheet.create({
    container: {
        flex : 1,
        padding : 16,
        alignContent : "center",
        justifyContent : "flex-start",  
        backgroundColor : COLOR.white,
    },
});

export default GlobalStyles;