import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// IMPORTACIÓN CORRECTA PARA EXPO ROUTER:
import { useLocalSearchParams, useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const isWeb = width > 768;

const DetalleScreen = () => {
  const router = useRouter();
  // Captura de forma segura los parámetros que vienen en la URL del navegador
  const params = useLocalSearchParams();

  // Reconstruimos el objeto producto basándonos en lo que viene por la URL
  const producto = {
    idProducto: params.idProducto,
    nombre: params.nombre || "Zapatilla Last Star",
    precio: params.precio ? parseFloat(params.precio) : 0,
    imagenUrl: params.imagenUrl,
    categoria: params.categoria,
    genero: params.genero,
    descripcion: params.descripcion,
    // Si pasas las tallas serializadas en la URL, las parseamos; si no, dejamos un arreglo vacío
    tallas: params.tallas ? JSON.parse(params.tallas) : [],
  };

  // ESTADO DE AUTENTICACIÓN: Cambia a 'true' para simular que ya inició sesión
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);

  // ESTADO DE TALLAS: Almacena la talla seleccionada por el cliente
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);

  const manejarCompra = () => {
    // 1. CONTROL DE ACCESO: Si no está logueado, interrumpe y redirige al Login
    if (!usuarioLogueado) {
      const mensajeAlerta =
        "Debes iniciar sesión para poder realizar una compra.";

      if (isWeb) {
        // En entorno Web, alert() es síncrono y nativo
        const confirmar = window.confirm(
          `${mensajeAlerta}\n\n¿Deseas ir al inicio de sesión?`,
        );
        if (confirmar) router.push("/login");
      } else {
        // En celulares usa el componente Alert de React Native
        Alert.alert("Inicio de Sesión Requerido", mensajeAlerta, [
          { text: "Cancelar", style: "cancel" },
          { text: "Ir al Login", onPress: () => router.push("/login") },
        ]);
      }
      return;
    }

    // 2. CONTROL DE INVENTARIO: Si tiene tallas, obliga a seleccionar una
    const tieneTallas = producto.tallas && producto.tallas.length > 0;
    if (tieneTallas && !tallaSeleccionada) {
      if (isWeb) alert("Por favor, selecciona una talla antes de continuar.");
      else
        Alert.alert(
          "Atención",
          "Por favor, selecciona una talla antes de continuar.",
        );
      return;
    }

    // 3. PROCESO DE COMPRA EXITOSO
    const mensaje = tallaSeleccionada
      ? `¡Agregaste "${producto.nombre}" en Talla ${tallaSeleccionada.numero} al carrito!`
      : `¡Agregaste "${producto.nombre}" al carrito!`;

    if (isWeb) alert(mensaje);
    else Alert.alert("Éxito", mensaje);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Botón flotante para regresar usando router.back() de Expo */}
      <TouchableOpacity
        style={styles.botonFlotanteVolver}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Text style={styles.flechaVolver}>
          ← <Text style={styles.textoVolver}>Volver al catálogo</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.layoutContainer}>
        {/* Contenedor de Imagen */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: producto.imagenUrl || "https://via.placeholder.com/500",
            }}
            style={styles.imagenBig}
            resizeMode="contain"
          />
        </View>

        {/* Contenedor de Información */}
        <View style={styles.infoContainer}>
          <Text style={styles.tagCategoria}>
            {producto.categoria || "Calzado"}
          </Text>
          <Text style={styles.titulo}>{producto.nombre}</Text>
          <Text style={styles.precio}>
            ${producto.precio ? producto.precio.toLocaleString("es-CO") : "0"}{" "}
            <Text style={styles.currency}>COP</Text>
          </Text>

          <View style={styles.divider} />

          <Text style={styles.subtitulo}>Descripción</Text>
          <Text style={styles.descripcion}>
            {producto.descripcion ||
              "Este producto no cuenta con una descripción detallada en este momento."}
          </Text>

          {/* --- SECCIÓN DE SELECCIÓN DE TALLAS --- */}
          {producto.tallas && producto.tallas.length > 0 && (
            <View style={styles.seccionTallas}>
              <Text style={styles.subtitulo}>Selecciona tu Talla</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contenedorBurbujas}
              >
                {producto.tallas.map((item) => {
                  const tieneStock = item.stock > 0;
                  const estaSeleccionada =
                    tallaSeleccionada?.idTalla === item.idTalla;

                  return (
                    <TouchableOpacity
                      key={item.idTalla}
                      disabled={!tieneStock}
                      activeOpacity={0.8}
                      onPress={() => setTallaSeleccionada(item)}
                      style={[
                        styles.burbujaTalla,
                        estaSeleccionada && styles.burbujaSeleccionada,
                        !tieneStock && styles.burbujaSinStock,
                      ]}
                    >
                      <Text
                        style={[
                          styles.textoTalla,
                          estaSeleccionada && styles.textoTallaSeleccionada,
                          !tieneStock && styles.textoTallaSinStock,
                        ]}
                      >
                        {item.numero}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* --- INFORMACIÓN COMPLEMENTARIA --- */}
          <View style={styles.rowInfo}>
            <Text style={styles.infoLabel}>
              Género:{" "}
              <Text style={styles.infoVal}>{producto.genero || "Unisex"}</Text>
            </Text>
            <Text style={styles.infoLabel}>
              Disponibles:{" "}
              <Text style={styles.infoVal}>
                {tallaSeleccionada
                  ? `${tallaSeleccionada.stock} unds`
                  : `${producto.tallas ? producto.tallas.reduce((acc, t) => acc + t.stock, 0) : 0} unds`}
              </Text>
            </Text>
          </View>

          {/* --- BOTÓN DE COMPRA CON INTERCEPTOR --- */}
          <TouchableOpacity style={styles.botonComprar} onPress={manejarCompra}>
            <Text style={styles.textoBotonComprar}>COMPRAR AHORA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  botonFlotanteVolver: {
    position: isWeb ? "absolute" : "relative",
    top: isWeb ? 24 : 0,
    left: isWeb ? 24 : 0,
    padding: isWeb ? 10 : 20,
    zIndex: 10,
    backgroundColor: isWeb ? "#ffffff" : "transparent",
    borderRadius: 8,
    borderWidth: isWeb ? 1 : 0,
    borderColor: "#ededed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isWeb ? 0.05 : 0,
    shadowRadius: 4,
    elevation: isWeb ? 2 : 0,
  },
  flechaVolver: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  textoVolver: {
    color: "#555",
    fontSize: 14,
    fontWeight: "500",
  },
  layoutContainer: {
    flexDirection: isWeb ? "row" : "column",
    maxWidth: isWeb ? 1200 : "100%",
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: isWeb ? 24 : 0,
    paddingTop: isWeb ? 90 : 10,
    gap: isWeb ? 40 : 0,
  },
  imageContainer: {
    flex: isWeb ? 1.2 : 0,
    width: isWeb ? "auto" : "100%",
    height: isWeb ? 500 : 300,
    backgroundColor: "#fcfcfc",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: isWeb ? 16 : 0,
    borderWidth: isWeb ? 1 : 0,
    borderColor: "#f0f0f0",
  },
  imagenBig: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: isWeb ? 1 : 0,
    padding: 24,
    width: "100%",
    justifyContent: "center",
  },
  tagCategoria: {
    color: "#7f8c8d",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  titulo: {
    fontSize: isWeb ? 32 : 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  precio: {
    fontSize: isWeb ? 28 : 24,
    fontWeight: "700",
    color: "#b91c1c",
    marginBottom: 15,
  },
  currency: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "400",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 20,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
    marginBottom: 24,
  },
  seccionTallas: {
    marginBottom: 15,
  },
  contenedorBurbujas: {
    paddingVertical: 6,
    gap: 10,
  },
  burbujaTalla: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  burbujaSeleccionada: {
    backgroundColor: "#1a252f",
    borderColor: "#1a252f",
  },
  burbujaSinStock: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
    opacity: 0.5,
  },
  textoTalla: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  textoTallaSeleccionada: {
    color: "#fff",
  },
  textoTallaSinStock: {
    color: "#b3b3b3",
    textDecorationLine: "line-through",
  },
  rowInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    backgroundColor: "#fcfcfc",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginTop: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  infoVal: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  botonComprar: {
    backgroundColor: "#1a252f",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  textoBotonComprar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default DetalleScreen;
