import { Stack } from "expo-router";
import { DriverProvider } from "@/contexts";

export default function DriverLayout() {
    return (
        <DriverProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </DriverProvider>
    );
}

