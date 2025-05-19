import React from 'react';
import { Slot, Stack } from 'expo-router';
import { OrderProvider } from '../../contexts/order.context';

const OrderLayout = () => {
    return (

        <OrderProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </OrderProvider>

    );
};

export default OrderLayout;

