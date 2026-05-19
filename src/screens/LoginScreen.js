import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [rol, setRol] = useState("Cliente"); // 'Cliente' o 'Admin'
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);

  // Función auxiliar para limpiar campos
  const cambiarRol = (nuevoRol) => {
    setRol(nuevoRol);
    setCorreo("");
    setContrasena("");
  };

  const manejarLogin = async () => {
    if (!correo || !contrasena) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setCargando(true);

    try {
      const puertoApi = "5039";
      let url =
        rol === "Cliente"
          ? `http://localhost:${puertoApi}/api/Clientes/login`
          : `http://localhost:${puertoApi}/api/Administradores/login`;

      console.log("Enviando credenciales a:", url);

      const respuesta = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: correo,
          password: contrasena,
        }),
      });

      if (!respuesta.ok) {
        const errorDatos = await respuesta.json().catch(() => ({}));
        alert(
          errorDatos.mensaje ||
            "Credenciales incorrectas para el rol seleccionado.",
        );
        return;
      }

      const datos = await respuesta.json();
      alert(`¡Bienvenido de nuevo, ${datos.nombre}!`);

      router.back();
    } catch (error) {
      console.error("Error en la petición fetch:", error);
      alert(
        "Error de conexión con el servidor. Verifica que la API esté encendida.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Last Star Shoes</Text>
        <Text style={styles.subtitle}>Ingresa a tu cuenta</Text>

        {/* Selector de Rol */}
        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              rol === "Cliente" && styles.activeRoleButton,
            ]}
            onPress={() => cambiarRol("Cliente")}
          >
            <Text
              style={[
                styles.roleText,
                rol === "Cliente" && styles.activeRoleText,
              ]}
            >
              Cliente
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              rol === "Admin" && styles.activeRoleButton,
            ]}
            onPress={() => cambiarRol("Admin")}
          >
            <Text
              style={[
                styles.roleText,
                rol === "Admin" && styles.activeRoleText,
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          placeholderTextColor="#999999"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#999999"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        {/* Botón Ingresar */}
        <TouchableOpacity
          style={styles.button}
          onPress={manejarLogin}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancelar y volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
    padding: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
  },
  selectorContainer: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeRoleButton: { backgroundColor: "#1a252f" },
  roleText: { fontSize: 14, fontWeight: "600", color: "#666" },
  activeRoleText: { color: "#fff" },
  label: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 5 },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
    width: "100%",
  },
  button: {
    backgroundColor: "#1a252f",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
