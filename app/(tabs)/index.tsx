import React from "react";
import HomeScreen from "../../src/screens/HomeScreen";

export default function TabHomeIndex() {
  // Retornamos el catálogo limpio. Como HomeScreen ya usa useRouter de forma
  // interna, no hace falta pasarle ninguna propiedad de navegación vieja aquí.
  return <HomeScreen />;
}
