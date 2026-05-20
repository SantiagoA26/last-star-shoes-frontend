import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";

export const FiltroDropdown = ({
  titulo,
  opciones,
  seleccionado,
  onSelect,
}: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.botonFiltro,
          seleccionado !== "Todos" && styles.filtroActivo,
        ]}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[
            styles.textoBotonFiltro,
            seleccionado !== "Todos" && styles.textoActivo,
          ]}
        >
          {titulo === "Precio"
            ? `Ordenar: ${seleccionado !== "Todos" ? seleccionado : "Precio"}`
            : seleccionado !== "Todos"
              ? `${titulo}: ${seleccionado}`
              : titulo}{" "}
          ▼
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        />
        <View style={styles.menuDesplegable}>
          {seleccionado !== "Todos" && (
            <TouchableOpacity
              style={styles.opcion}
              onPress={() => {
                onSelect("Todos");
                setVisible(false);
              }}
            >
              <Text style={{ color: "red", fontSize: 14, fontWeight: "500" }}>
                ✕ Limpiar {titulo}
              </Text>
            </TouchableOpacity>
          )}

          {opciones
            .filter((op: string) => op !== "Todos")
            .map((op: string) => (
              <TouchableOpacity
                key={op}
                style={styles.opcion}
                onPress={() => {
                  onSelect(op);
                  setVisible(false);
                }}
              >
                <Text
                  style={
                    seleccionado === op
                      ? { fontWeight: "bold", color: Colors.primary }
                      : {}
                  }
                >
                  {op}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  botonFiltro: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginRight: 10,
  },
  filtroActivo: { backgroundColor: Colors.primary },
  textoBotonFiltro: { fontSize: 13, fontWeight: "600" },
  textoActivo: { color: "white" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.1)" },
  menuDesplegable: {
    position: "absolute",
    top: 120,
    left: 24,
    backgroundColor: "white",
    paddingVertical: 5,
    borderRadius: 8,
    elevation: 5,
    width: 220,
  },
  opcion: { paddingVertical: 12, paddingHorizontal: 20 },
});
