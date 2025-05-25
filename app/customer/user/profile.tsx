import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import GLOBAL from "../../../constants/GlobalStyles";
import COLOR from "../../../constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import Button from "../../../components/Button/ButtonComponent";
import { Fontisto } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import userService from "../../../services/user.service";
import DatePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DropdownPicker from "react-native-dropdown-picker";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [originalName, setOriginalName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [originalEmail, setOriginalEmail] = useState<string>("");
  const [gender, setGender] = useState<string | null>(null);
  const [originalGender, setOriginalGender] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [originalDateOfBirth, setOriginalDateOfBirth] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [genderItems] = useState([
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
    { label: "Khác", value: "OTHERS" },
  ]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res.success) {
          // Set current values
          setName(res.data.fullName);
          setPhoneNumber(res.data.phoneNumber);
          setEmail(res.data.email);
          setGender(res.data.gender);
          setDateOfBirth(new Date(res.data.dateOfBirth));

          // Store original values for comparison
          setOriginalName(res.data.fullName);
          setOriginalPhoneNumber(res.data.phoneNumber);
          setOriginalEmail(res.data.email);
          setOriginalGender(res.data.gender);
          setOriginalDateOfBirth(new Date(res.data.dateOfBirth));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Format date to display in the local format
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN');
  };

  // Handle date change from the date picker
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      checkForChanges(name, phoneNumber, email, gender, selectedDate);
    }
  };

  // Check if any values have changed from the original
  const checkForChanges = (
    newName: string,
    newPhone: string,
    newEmail: string,
    newGender: string | null,
    newDate: Date
  ) => {
    if (
      newName !== originalName ||
      newPhone !== originalPhoneNumber ||
      newEmail !== originalEmail ||
      newGender !== originalGender ||
      newDate.toISOString().split('T')[0] !== originalDateOfBirth.toISOString().split('T')[0]
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  };

  // Get the displayed gender label based on the value
  const getGenderLabel = (value: string | null): string => {
    if (!value) return "";
    const item = genderItems.find(item => item.value === value);
    return item ? item.label : "";
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);

      // Format the date to YYYY-MM-DD string format for API
      const formattedDate = dateOfBirth.toISOString().split('T')[0];

      const updateData = {
        fullName: name,
        email: email,
        gender: gender || '',
        dateOfBirth: formattedDate,
      };

      const res = await userService.updateProfile(updateData);

      if (res.success) {
        // Update original values to match current values
        setOriginalName(name);
        setOriginalEmail(email);
        setOriginalGender(gender);
        setOriginalDateOfBirth(dateOfBirth);

        // Reset hasChanges flag
        setHasChanges(false);

        // Show success message
        Alert.alert(
          "Thành công",
          "Thông tin người dùng đã được cập nhật",
          [{ text: "OK" }]
        );
      } else {
        // Show error message if API returns success: false
        Alert.alert(
          "Lỗi",
          "Không thể cập nhật thông tin người dùng",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        "Lỗi",
        "Đã xảy ra lỗi khi cập nhật thông tin",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
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
            <Text style={styles.title}>Thông tin người dùng</Text>
          </LinearGradient>
        </View>
        <View style={styles.content_view}>
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            style={styles.text_input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              checkForChanges(text, phoneNumber, email, gender, dateOfBirth);
            }}
          />
        </View>
        <View style={styles.content_view}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={[styles.text_input, { color: COLOR.grey50 }]}
            keyboardType="numeric"
            value={phoneNumber}
            editable={false}
          />
        </View>
        <View style={styles.content_view}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.text_input}
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              checkForChanges(name, phoneNumber, text, gender, dateOfBirth);
            }}
          />
        </View>
        <View style={styles.row_container}>
          <View style={[styles.content_view, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Giới tính</Text>
            <DropdownPicker
              open={dropdownOpen}
              setOpen={setDropdownOpen}
              value={gender}
              items={genderItems}
              setValue={(callback) => {
                const value = callback(gender);
                setGender(value);
                checkForChanges(name, phoneNumber, email, value, dateOfBirth);
              }}
              placeholder="Chọn giới tính"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdown_container}
              listMode="SCROLLVIEW"
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
          <View style={[styles.content_view, { flex: 1 }]}>
            <Text style={styles.label}>Ngày sinh</Text>
            <TouchableOpacity
              style={styles.date_input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.date_text}>{formatDate(dateOfBirth)}</Text>
              <FontAwesome6 name="calendar" size={20} color={COLOR.black} />
            </TouchableOpacity>
            {showDatePicker && (
              <DatePicker
                mode="date"
                display="default"
                value={dateOfBirth}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
        </View>
        <View style={styles.button_group}>
          <View style={styles.content_container}>
            <Button
              title="Đăng xuất"
              onPress={() => router.replace("/authentication/auth-method")}
              size="medium"
              type="sub"
              textStyle={{ fontSize: 16 }}
            />
            <Button
              title="Đổi mật khẩu"
              onPress={() => router.push("/user/change-password")}
              size="medium"
              type="sub"
              textStyle={{ fontSize: 16 }}
            />
          </View>
          {hasChanges && (
            <Button
              title={isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
              onPress={handleUpdateProfile}
              size="large"
              type="primary"
              disabled={isLoading}
            />
          )}
        </View>

        {isLoading && (
          <View style={styles.loading_overlay}>
            <ActivityIndicator size="large" color={COLOR.blue40} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

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
  content_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  button_group: {
    padding: 16,
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  content_view: {
    paddingHorizontal: 16,
    marginBottom: 10,
    zIndex: 10,
  },
  label: {
    fontSize: 16,
    paddingTop: 16,
    marginBottom: 8,
    fontWeight: "500"
  },
  text_input: {
    backgroundColor: COLOR.grey90,
    fontSize: 16,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLOR.grey70,
  },
  date_input: {
    backgroundColor: COLOR.grey90,
    fontSize: 16,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLOR.grey70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date_text: {
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: COLOR.grey90,
    borderWidth: 1,
    borderColor: COLOR.grey70,
    marginTop: 8,
  },
  dropdown_container: {
    backgroundColor: COLOR.grey90,
    borderWidth: 1,
    borderColor: COLOR.grey70,
  },
  row_container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    zIndex: 2000,
  },
  loading_overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});
