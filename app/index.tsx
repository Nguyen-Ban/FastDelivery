import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/authentication/auth-method" />;
  // return <Redirect href="/home" />;
}
