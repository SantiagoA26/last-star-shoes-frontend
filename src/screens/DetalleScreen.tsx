import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import api from "../api/api";

const DetalleScreen = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const params = useLocalSearchParams();
  const router = useRouter();

  const [tallas, setTallas] = useState<any[]>([]);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extraer parámetros
  const idProducto = params.idProducto as string;
  const nombre = params.nombre as string;
  const precio = params.precio as string;
  const imagenUrl = params.imagenUrl as string;
  const descripcion = params.descripcion as string;
  const categoria = params.categoria as string; 

  useEffect(() => {
    if (idProducto) {
      setLoading(true);
      api
        .get(`/Productos/${idProducto}/tallas`)
        .then((res) => {
          setTallas(res.data);
        })
        .catch((err) => {
          console.error("Error al cargar tallas:", err);
          setError("No se pudieron cargar las tallas.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [idProducto]);

  const handleComprar = () => {
    if (tallaSeleccionada === null) {
      Platform.OS === "web"
        ? window.alert("Por favor, selecciona una talla primero.")
        : Alert.alert("Atención", "Por favor, selecciona una talla primero.");
      return;
    }
    router.push("/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.card, { width: isMobile ? "95%" : "80%" }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Volver al catálogo</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.content,
            { flexDirection: isMobile ? "column" : "row" },
          ]}
        >
          <View
            style={[styles.imageWrapper, { width: isMobile ? "100%" : 400 }]}
          >
            <Image
              source={{ uri: imagenUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View
            style={[
              styles.info,
              { paddingLeft: isMobile ? 0 : 40, marginTop: isMobile ? 20 : 0 },
            ]}
          >
            {/* AQUÍ EL CAMBIO: Muestra la categoría dinámica en MAYÚSCULAS */}
            <Text style={styles.categoria}>
              {categoria ? categoria.toUpperCase() : "PRODUCTO"}
            </Text>

            <Text style={styles.titulo}>
              {nombre || "Cargando producto..."}
            </Text>

            <Text style={styles.precio}>
              ${Number(precio || 0).toLocaleString("es-CO")}{" "}
              <Text style={styles.currency}>COP</Text>
            </Text>

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.descripcion}>
              {descripcion || "Sin descripción disponible."}
            </Text>

            <Text style={styles.sectionTitle}>Selecciona tu talla:</Text>

            {loading ? (
              <ActivityIndicator
                size="small"
                color="black"
                style={{ marginVertical: 10 }}
              />
            ) : error ? (
              <Text style={{ color: "red" }}>{error}</Text>
            ) : (
              <View style={styles.tallasWrapper}>
                {tallas.length > 0 ? (
                  tallas.map((t) => (
                    <TouchableOpacity
                      key={t.idTalla}
                      style={[
                        styles.tallaBtn,
                        tallaSeleccionada === t.idTalla &&
                          styles.tallaBtnActive,
                      ]}
                      onPress={() => setTallaSeleccionada(t.idTalla)}
                    >
                      <Text
                        style={[
                          styles.tallaText,
                          tallaSeleccionada === t.idTalla && { color: "white" },
                        ]}
                      >
                        {t.numero}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noTallas}>
                    No hay tallas disponibles.
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.botonComprar}
              onPress={handleComprar}
            >
              <Text style={styles.textoBoton}>COMPRAR AHORA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    maxWidth: 1000,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  backButton: { marginBottom: 20, alignSelf: "flex-start" },
  backText: { color: "#007AFF", fontWeight: "500", fontSize: 16 },
  content: { width: "100%", alignItems: "flex-start" },
  imageWrapper: {
    height: 400,
    backgroundColor: "#fdfdfd",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  image: { width: "90%", height: "90%" },
  info: { flex: 1, width: "100%" },
  categoria: {
    color: "#888",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  precio: {
    fontSize: 28,
    color: "#d90429",
    fontWeight: "bold",
    marginBottom: 5,
  },
  currency: { fontSize: 16, color: "#666", fontWeight: "normal" },
  separator: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
    marginBottom: 25,
  },
  tallasWrapper: { flexDirection: "row", flexWrap: "wrap", marginBottom: 30 },
  tallaBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#ddd",
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
    minWidth: 55,
    alignItems: "center",
  },
  tallaBtnActive: { backgroundColor: "#000", borderColor: "#000" },
  tallaText: { fontSize: 15, fontWeight: "600", color: "#000" },
  noTallas: { fontStyle: "italic", color: "#999", marginVertical: 10 },
  botonComprar: {
    backgroundColor: "#ef233c",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  textoBoton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default DetalleScreen;
