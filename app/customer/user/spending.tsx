import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GLOBAL from "../../../constants/GlobalStyles";
import COLOR from "../../../constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { BarChart } from "react-native-chart-kit";

const SpendingScreen = () => {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [chartData, setChartData] = useState(null);

  const spendingData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [450, 320, 510, 720, 610, 300, 400, 580, 670, 420, 390, 800],
      },
    ], //hardcoded data for testing
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    fillShadowGradient: COLOR.orange50,
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 1,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 14,
      fontWeight: "bold",
      dy: -5,
    },
    propsForBackgroundLines: {
      stroke: COLOR.blue70,
      strokeWidth: 1,
    },
  };

  return (
    <View style={GLOBAL.home_container}>
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
          <Text style={styles.title}>Chi tiêu</Text>
        </LinearGradient>
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          paddingVertical: 35,
          paddingHorizontal: 16,
        }}
      >
        Thống kê chi tiêu hàng tháng
      </Text>
      <ScrollView horizontal>
        <BarChart
          data={spendingData}
          width={screenWidth * 2}
          height={screenHeight / 2}
          fromZero={true}
          showValuesOnTopOfBars={true}
          chartConfig={chartConfig}
          yAxisLabel=""
          yAxisSuffix="K"
          style={{
            marginRight: 25,
          }}
        />
      </ScrollView>
    </View>
  );
};

export default SpendingScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    paddingLeft: 16,
    fontSize: 24,
    fontWeight: "bold",
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
