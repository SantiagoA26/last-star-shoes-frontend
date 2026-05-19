// Ubicación: app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Forzamos al extremo la desaparición visual y estructural de la barra
        tabBarStyle: {
          display: "none",
          opacity: 0,
          height: 0,
          width: 0,
          position: "absolute",
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarButton: () => null, // Rompe el botón físico en la web
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarButton: () => null, 
        }}
      />
    </Tabs>
  );
}
