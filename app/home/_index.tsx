import { Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="_index" options={{ title: "Home" }} />
      <Tabs.Screen name="activity" options={{ title: "Activity" }} />
      <Tabs.Screen name="message" options={{ title: "Messages" }} />
      <Tabs.Screen name="notification" options={{ title: "Notifications" }} />
    </Tabs>
  );
}
