import { OrderDriverProvider } from "@/contexts/order.driver.context";
import { SocketDriverProvider } from "@/contexts/socker.driver.context";
import { Stack } from "expo-router";
import { Socket } from "socket.io-client";
import { OrderDriverListener } from "@/listeners/order.driver.listener";

export default function DriverLayout() {
    return (
        <SocketDriverProvider>
            <OrderDriverProvider>
                <OrderDriverListener />
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </OrderDriverProvider>
        </SocketDriverProvider>
    );
}

