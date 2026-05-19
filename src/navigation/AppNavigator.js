import { createStackNavigator } from "@react-navigation/stack";
import DetalleScreen from "../screens/DetalleScreen";
import HomeScreen from "../screens/HomeScreen";

// Dentro de src/navigation/AppNavigator.js
import LoginScreen from "../screens/LoginScreen"; // <-- 1. Impórtala arriba


<Stack.Navigator initialRouteName="Home">
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Detalle" component={DetalleScreen} />

  {/* Registra la pantalla de Login */}
  <Stack.Screen
    name="Login"
    component={LoginScreen}
    options={{
      title: "Iniciar Sesión",
      headerShown: false, // Oculta la barra de arriba por defecto para usar tu diseño limpio
    }}
  />
</Stack.Navigator>;

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detalle" component={DetalleScreen} />
    </Stack.Navigator>
  );
}
