import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { OrderProvider } from '../../contexts/order.context';

export default function OrderLayout() {
    return (
        <OrderProvider>
            <Stack />
        </OrderProvider>
    );
}

