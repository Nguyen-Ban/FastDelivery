import { startSocketBackground } from "@/background/backgroundTask";
import { AuthProvider, LocationProvider } from "@/contexts";
import { ROLE } from "@/types";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // Có thể lấy role từ context sau khi Auth ready
    startSocketBackground(ROLE.DRIVER); // hoặc ROLE.USER, tuỳ app
  }, []);

  return (
    <AuthProvider>
      <LocationProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </LocationProvider>
    </AuthProvider>
  );
}
