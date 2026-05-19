// Ubicación: app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* El Stack hereda el control, impidiendo que la raíz dibuje barras indeseadas */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detalle" options={{ headerShown: false }} />

      {/* INTERCEPCIÓN DE LOGIN COMO MODAL */}
      <Stack.Screen
        name="login"
        options={{
          presentation: "modal", // Hace que la tarjeta emerja desde abajo en iOS/Móvil
          animation: "slide_from_bottom", // Asegura la animación limpia hacia arriba en Android y Web
          headerShown: false, // Mantiene el diseño minimalista y oscuro de tu LoginScreen
        }}
      />
    </Stack>
  );
}
