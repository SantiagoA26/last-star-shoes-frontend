import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../api/api";

const { width } = Dimensions.get("window");

const isWeb = width > 768;
const numColumns = isWeb ? 4 : 2;

const MARGIN_SIZE = 12;
const cardWidth = isWeb
  ? (width - (numColumns + 1) * MARGIN_SIZE * 2) / numColumns
  : width / 2 - 24;

const HomeScreen = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("/Productos");
        setProductos(response.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a1a1a" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    // Construimos la url con los parámetros limpios
    const urlDetalle = `/detalle?idProducto=${item.idProducto}&nombre=${encodeURIComponent(item.nombre)}&precio=${item.precio}&imagenUrl=${encodeURIComponent(item.imagenUrl || "")}&descripcion=${encodeURIComponent(item.descripcion || "")}&categoria=${encodeURIComponent(item.categoria || "")}&genero=${encodeURIComponent(item.genero || "")}&stock=${item.stock}`;

    return (
      <Link href={urlDetalle} asChild>
        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.imagenUrl || "https://via.placeholder.com/400",
              }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.nombre} numberOfLines={1}>
              {item.nombre}
            </Text>
            <Text style={styles.precio}>
              ${item.precio ? item.precio.toLocaleString("es-CO") : "0"}{" "}
              <Text style={styles.currency}>COL</Text>
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>★</Text>
          <Text style={styles.headerTitle}>LAST STAR</Text>
        </View>

        {/* 🚀 MODIFICADO: Agregamos el Link envolviendo el botón de login */}
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.botonLogin} activeOpacity={0.8}>
            <Text style={styles.botonLoginText}>INICIAR SESIÓN</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.idProducto.toString()}
        renderItem={renderItem}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoIcon: { fontSize: 26, marginRight: 8, color: "#1a1a1a" },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#1a1a1a",
  },
  botonLogin: {
    backgroundColor: "#1a252f",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  botonLoginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  list: { paddingHorizontal: MARGIN_SIZE, paddingTop: 20, paddingBottom: 40 },
  row: { justifyContent: "flex-start" },
  card: {
    backgroundColor: "#ffffff",
    width: cardWidth,
    margin: MARGIN_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ededed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: isWeb ? 200 : 150,
    backgroundColor: "#fcfcfc",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  image: { width: "100%", height: "100%" },
  info: { padding: 14, borderTopWidth: 1, borderColor: "#fafafa" },
  nombre: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e272e",
    marginBottom: 4,
  },
  precio: { fontSize: 15, color: "#b91c1c", fontWeight: "750" },
  currency: { fontSize: 11, color: "#7f8c8d", fontWeight: "400" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default HomeScreen;
