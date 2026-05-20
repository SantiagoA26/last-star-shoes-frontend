import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import DetalleScreen from "../screens/DetalleScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";

export type RootStackParamList = {
  Home: undefined;
  Detalle: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detalle" component={DetalleScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}