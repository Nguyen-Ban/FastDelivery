import React from 'react';
import { Slot, Stack } from 'expo-router';
import { OrderProvider } from '../../../contexts/order.context';
import { SockerCustomerProvider } from '@/contexts/socker.customer.context';
import { OrderCustomerListener } from '@/listeners/order.customer.listener';

const OrderLayout = () => {
    return (
        <SockerCustomerProvider>
            <OrderProvider>
                <OrderCustomerListener />
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </OrderProvider>
        </SockerCustomerProvider>

    );
};

export default OrderLayout;

