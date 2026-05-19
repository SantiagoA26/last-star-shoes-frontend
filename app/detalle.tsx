import { useLocalSearchParams } from "expo-router";
import React from "react";
import DetalleScreen from "../src/screens/DetalleScreen";

export default function DetalleRoute() {
  const params = useLocalSearchParams();

  const mockRoute: any = {
    params: {
      producto: {
        idProducto: params.idProducto || "",
        nombre: params.nombre || "Calzado Last Star",
        precio: params.precio ? Number(params.precio) : 0,
        imagenUrl: params.imagenUrl || "",
        descripcion: params.descripcion || "",
        categoria: params.categoria || "",
        genero: params.genero || "",
        stock: params.stock ? Number(params.stock) : 0,
      },
    },
  };

  return <DetalleScreen route={mockRoute} />;
}
