import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import DatePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import DropdownPicker from "react-native-dropdown-picker";

import Button from "../../components/Button/ButtonComponent";
import COLOR from "../../constants/Colors";
import GLOBAL from "../../constants/GlobalStyles";

const UserInfo = () => {
  const [phone, setPhone] = React.useState("");
  const [name, setName] = React.useState("+84xxxxxxxxx");
  const [email, setEmail] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [gender, setGender] = React.useState("");
  const [dateShow, setDateShow] = React.useState(false);
  const [items, setItems] = useState([
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
    { label: "Khác", value: "other" },
  ]);
  const [value, setValue] = useState(null);
  const [label, setLabel] = useState(null);
  const [dropdownShow, setDropdownShow] = useState(false);

  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setDateShow(false);
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <View style={[GLOBAL.container, { justifyContent: "space-between" }]}>
      <View>
        <Text style={styles.infoTitle}>Cập nhật thông tin</Text>
        <Text style={styles.subTitle}>Họ tên</Text>
        <TextInput style={styles.textInput}></TextInput>
        <Text style={styles.subTitle}>Số điện thoại</Text>
        <TextInput
          style={styles.textInput}
          editable={false}
          value={name}
        ></TextInput>
        <View style={styles.contentView}>
          {dateShow && (
            <DatePicker
              mode="date"
              display="spinner"
              value={date}
              maximumDate={new Date()}
              onChange={onDateChange}
            />
          )}
          <View style={[styles.subView, { paddingRight: 8 }]}>
            <Text style={styles.subTitle}>Ngày sinh</Text>
            <View style={styles.combineView}>
              <Text style={{ fontSize: 16 }}>{formatDate(date)}</Text>
              <TouchableOpacity onPress={() => setDateShow(true)}>
                <Image
                  source={require("../../assets/images/calendar.png")}
                  style={styles.img}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.subView}>
            <Text style={styles.subTitle}>Giới tính</Text>
            <DropdownPicker
              open={dropdownShow}
              setOpen={setDropdownShow}
              value={value}
              items={items}
              setValue={setValue}
              placeholder="Giới tính"
              dropDownContainerStyle={{ borderColor: COLOR.grey90 }}
              style={{
                backgroundColor: COLOR.grey90,
                borderColor: COLOR.grey90,
              }}
              textStyle={{ fontSize: 16 }}
              multiple={false}
            ></DropdownPicker>
          </View>
        </View>
        <Text style={styles.subTitle}>Email</Text>
        <TextInput style={styles.textInput}></TextInput>
      </View>
      <Button
        title="Cập nhật"
        onPress={() => {}}
        size="large"
        type="primary"
        style={styles.addButton}
      />
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  infoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 8,
  },
  contentView: {
    flexDirection: "row",
  },
  subView: {
    flex: 1,
  },
  addButton: {
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: COLOR.grey90,
    borderRadius: 8,
    fontSize: 18,
    height: 50,
  },
  img: {
    width: 30,
    height: 30,
  },
  combineView: {
    flexDirection: "row",
    backgroundColor: COLOR.grey90,
    borderRadius: 8,
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    height: 50,
  },
});
