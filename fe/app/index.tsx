import { Redirect } from "expo-router";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Do not call Hooks inside useEffect', // hoặc một phần của message warning
]);
export default function Index() {
  return <Redirect href="/authentication/auth-method" />;
  // return <Redirect href="/home" />;
}
