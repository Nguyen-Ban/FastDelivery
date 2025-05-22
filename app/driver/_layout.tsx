import { OrderDriverProvider } from "@/contexts/order.driver.context";
import { SocketDriverProvider } from "@/contexts/socker.driver.context";
import { Stack } from "expo-router";
import { Socket } from "socket.io-client";
import { OrderListener } from "@/listeners/order.listener";

export default function DriverLayout() {
    return (
        <SocketDriverProvider>
            <OrderDriverProvider>
                <OrderListener />
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </OrderDriverProvider>
        </SocketDriverProvider>
    );
}

