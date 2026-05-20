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
import { Colors } from "../constants/Colors";

type Role = "Cliente" | "Admin";

interface LoginResponse {
  nombre: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [rol, setRol] = useState<Role>("Cliente");
  const [correo, setCorreo] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  const cambiarRol = (nuevoRol: Role): void => {
    setRol(nuevoRol);
    setCorreo("");
    setContrasena("");
  };

  const manejarLogin = async (): Promise<void> => {
    if (!correo || !contrasena) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setCargando(true);

    try {
      const puertoApi = "5039";
      const url =
        rol === "Cliente"
          ? `http://localhost:${puertoApi}/api/Clientes/login`
          : `http://localhost:${puertoApi}/api/Administradores/login`;

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

      const datos: LoginResponse = await respuesta.json();
      alert(`¡Bienvenido de nuevo, ${datos.nombre}!`);

      router.back();
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Last Star Shoes</Text>
        <Text style={styles.subtitle}>Ingresa a tu cuenta</Text>

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

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          placeholderTextColor={Colors.gray}
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor={Colors.gray}
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={manejarLogin}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={Colors.white} />
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
    backgroundColor: Colors.light,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: Colors.white,
    width: "100%",
    maxWidth: 400,
    padding: 30,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.dark,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: Colors.gray,
    marginBottom: 25,
  },
  selectorContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light,
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
  activeRoleButton: { backgroundColor: Colors.primary },
  roleText: { fontSize: 14, fontWeight: "600", color: Colors.gray },
  activeRoleText: { color: Colors.white },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.dark,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
    width: "100%",
  },
  button: {
    backgroundColor: Colors.dark,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: "bold" },
  cancelText: {
    color: Colors.gray,
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
