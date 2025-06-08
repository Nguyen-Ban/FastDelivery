
import { AuthProvider, LocationProvider } from "@/contexts";
import { ROLE } from "@/types";
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
