import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetalleScreen from '../screens/DetalleScreen';
// Aquí importarás tu pantalla de Login cuando la crees

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detalle" component={DetalleScreen} />
    </Stack.Navigator>
  );
}