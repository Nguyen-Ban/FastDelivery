import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GLOBAL from "../../../constants/GlobalStyles";
import COLOR from "../../../constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { BarChart } from "react-native-chart-kit";
import orderService from "@/services/order.service";

interface SpendingData {
  labels: {
    month: string;
    year: string;
  }[];
  monthlySpending: number[];
}

const SpendingScreen = () => {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const [loading, setLoading] = useState(true);
  const [spendingData, setSpendingData] = useState<SpendingData>({
    labels: [],
    monthlySpending: [],
  });

  useEffect(() => {
    const fetchSpendingData = async () => {
      try {
        setLoading(true);
        const response = await orderService.fetchCustomerStats();
        console.log('API Response:', response);
        if (response.success) {
          setSpendingData({
            labels: response.data.labels,
            monthlySpending: response.data.monthlySpending,
          });
        }
        console.log(spendingData.labels)
      } catch (error) {
        console.error('Error fetching spending data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpendingData();
  }, []);

  // Tính toán các chỉ số
  const currentMonth = spendingData.monthlySpending[spendingData.monthlySpending.length - 1] || 0;
  const previousMonth = spendingData.monthlySpending[spendingData.monthlySpending.length - 2] || 0;
  const averageSpending = Math.round(
    spendingData.monthlySpending.reduce((a: number, b: number) => a + b, 0) / spendingData.monthlySpending.length
  );
  const percentChange = previousMonth === 0 ? currentMonth : Math.round(((currentMonth - previousMonth) / previousMonth) * 100);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    fillShadowGradient: COLOR.orange50,
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.6,
    barSpacing: 20,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: "500",
    },
    propsForBackgroundLines: {
      stroke: COLOR.blue70,
      strokeWidth: 1,
    },
    propsForVerticalLabels: {
      fontSize: 11
    },
    propsForHorizontalLabels: {
      fontSize: 0,
    },
    formatYLabel: (value: string) => {
      return Number(value).toLocaleString('vi-VN') + 'đ';
    },
    formatTopBarValue: (value: number) => {
      return value.toLocaleString('vi-VN') + 'đ';
    },
  };

  if (loading) {
    return (
      <View style={[GLOBAL.home_container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLOR.blue_theme} />
      </View>
    );
  }

  function renderChange(current: number, previous: number) {
    if (previous === 0) {
      return current.toLocaleString() + " ₫";
    } else {
      const percentChange = ((current - previous) / previous) * 100;
      return Math.abs(percentChange).toFixed(2) + "%";
    }
  }

  // Chuyển đổi dữ liệu để hiển thị label trên hai dòng
  const chartData = {
    labels: spendingData.labels.map(label => `${label.month}${label.year}`),
    datasets: [{
      data: spendingData.monthlySpending
    }]
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
        Thống kê chi tiêu 6 tháng gần nhất
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>So với tháng trước</Text>
          <View style={styles.statValueContainer}>
            <FontAwesome6
              name={currentMonth > previousMonth ? "arrow-up" : "arrow-down"}
              size={16}
              color={currentMonth > previousMonth ? COLOR.red55 : COLOR.green40}
            />
            <Text style={[
              styles.statValue,
              { color: percentChange >= 0 ? COLOR.red55 : COLOR.green40 }
            ]}>
              {renderChange(currentMonth, previousMonth)}
            </Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Chi tiêu trung bình</Text>
          <Text style={styles.statValue}>{averageSpending.toLocaleString('vi-VN')}đ</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={screenWidth - 32}
          height={Dimensions.get("window").height / 2}
          fromZero={true}
          showValuesOnTopOfBars={true}
          chartConfig={chartConfig}
          yAxisLabel=""
          yAxisSuffix=""
          style={{
            borderRadius: 16,
            paddingRight: 16,
          }}
        />
      </View>
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
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLOR.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: COLOR.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLOR.grey70,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.black,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
