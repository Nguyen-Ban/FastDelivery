import { AuthProvider, LocationProvider } from "@/contexts";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </LocationProvider>
    </AuthProvider>
  );
}
