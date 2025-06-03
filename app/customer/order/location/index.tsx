import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Button from "../../../../components/Button/ButtonComponent";
import COLOR from "../../../../constants/Colors";
import GLOBAL from "../../../../constants/GlobalStyles";
import { useLocation } from "../../../../contexts/location.context";
import { useOrder } from "../../../../contexts/order.context";
import { useAuth } from "../../../../contexts/auth.context";
import { LOCATION_TYPE, ORDER_TYPES, VEHICLE_TYPES, vehicleOptions } from "@/types";

const Order = () => {
    const router = useRouter();
    const { orderType } = useLocalSearchParams();
    const { location } = useLocation();
    const { user } = useAuth();
    const { pickupLocation, dropoffLocation, setPickupLocation, setSender, setVehicleType, setCarPrice } = useOrder();

    useEffect(() => {
        // Set vehicle type based on the type parameter
        if (orderType === ORDER_TYPES.CAR_DELIVERY) {
            setVehicleType(VEHICLE_TYPES.VAN);
            setCarPrice(vehicleOptions[0].price)
        } else if (orderType === ORDER_TYPES.MOTORBIKE_DELIVERY) {
            setVehicleType(VEHICLE_TYPES.MOTORBIKE);
        }
    }, []);

    useEffect(() => {
        // Set initial pickup location from current location
        if (location?.address && !pickupLocation) {
            setPickupLocation({
                title: "Vị trí của bạn",
                address: location.address || "Địa điểm chưa xác định",
                coord: {
                    lat: location?.coord?.lat as number,
                    lng: location?.coord?.lng as number,
                },
            });
        }

        // Set initial sender information from user data
        if (user && !pickupLocation) {
            setSender({
                name: user.fullName || "",
                phoneNumber: user.phoneNumber || "",
            });
        }
    }, [location, pickupLocation, setPickupLocation, user, setSender]);

    const locationHandler = (locationType: LOCATION_TYPE) => {
        router.push({
            pathname: "/customer/order/location/location-pick",
            params: {
                orderType,
                locationType
            }
        });
    };

    return (
        <View style={[GLOBAL.container, { justifyContent: "space-between" }]}>
            <LinearGradient
                colors={[COLOR.blue70, COLOR.orange70, COLOR.white]}
                style={styles.background}
                locations={[0.05, 0.29, 0.3]}
            />
            <View>
                <View style={styles.headerView}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <FontAwesome6 name="arrow-left" size={30} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            {orderType === ORDER_TYPES.CAR_DELIVERY ? 'Giao hàng xe tải' : 'Giao hàng xe máy'}
                        </Text>
                    </View>
                    <TouchableOpacity>
                        <FontAwesome6 name="clipboard" size={25} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.locationPickCard}>
                    <Button
                        title={pickupLocation?.address || "Chọn điểm lấy hàng"}
                        onPress={() => locationHandler(LOCATION_TYPE.PICKUP)}
                        type="sub"
                        size="large"
                        style={[
                            styles.locationButton,
                            { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                        ]}
                        textStyle={{ color: COLOR.black }}
                        leftImg={
                            <FontAwesome6 name="location-dot" size={24} color={COLOR.red55} />
                        }
                    />
                    <Button
                        title={dropoffLocation?.address || "Giao đến đâu?"}
                        onPress={() => locationHandler(LOCATION_TYPE.DROP_OFF)}
                        type="sub"
                        size="large"
                        style={[
                            styles.locationButton,
                            { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
                        ]}
                        textStyle={{ color: COLOR.black }}
                        leftImg={
                            <FontAwesome6
                                name="location-dot"
                                size={24}
                                color={COLOR.blue40}
                            />
                        }
                    />
                </View>
            </View>
        </View>
    );
};

export default Order;

const styles = StyleSheet.create({
    Image: {
        height: 25,
        width: 25,
    },
    headerView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        paddingHorizontal: 30,
    },
    background: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
    },
    locationButton: {
        alignItems: "flex-start",
        borderColor: COLOR.white,
        borderRadius: 15,
    },
    locationPickCard: {
        marginVertical: "40%",
        backgroundColor: COLOR.white,
        borderRadius: 15,
        boxShadow: "2px 4px 5px rgba(0, 0, 0, 0.7)",
    },
});
