import { Link } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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
import { FiltroDropdown } from "../components/FiltroDropdown";
import { Colors } from "../constants/Colors";

const { width } = Dimensions.get("window");
const cardWidth = width > 768 ? width / 4 - 24 : width / 2 - 24;

const HomeScreen = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [catSel, setCatSel] = useState("Todos");
  const [genSel, setGenSel] = useState("Todos");
  const [orden, setOrden] = useState("Todos");

  useEffect(() => {
    api
      .get("/Productos")
      .then((res) => {
        setProductos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setLoading(false);
      });
  }, []);

  // Categorías definidas por ti
  const listaCategorias = [
    "Todos",
    "Deportivos",
    "Casuales",
    "Elegantes",
    "Urbanos",
    "Edicion Limitada",
  ];

  const productosFiltrados = useMemo(() => {
    let list = productos.filter((p) => {
      // Comparación robusta: quita espacios y no distingue mayúsculas
      const matchCat =
        catSel === "Todos" ||
        (p.categoria &&
          p.categoria.trim().toLowerCase() === catSel.toLowerCase());

      const matchGen =
        genSel === "Todos" ||
        (p.genero && p.genero.trim().toLowerCase() === genSel.toLowerCase());

      return matchCat && matchGen;
    });

    if (orden === "Mayor a Menor") list.sort((a, b) => b.precio - a.precio);
    if (orden === "Menor a Mayor") list.sort((a, b) => a.precio - b.precio);
    return list;
  }, [productos, catSel, genSel, orden]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>★</Text>
          <Text style={styles.headerTitle}>LAST STAR</Text>
        </View>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.botonLogin}>
            <Text style={styles.botonLoginText}>INICIAR SESIÓN</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.filtrosBarra}>
        <FiltroDropdown
          titulo="Categoría"
          opciones={listaCategorias}
          seleccionado={catSel}
          onSelect={setCatSel}
        />
        <FiltroDropdown
          titulo="Género"
          opciones={["Todos", "Masculino", "Femenino", "Unisex"]}
          seleccionado={genSel}
          onSelect={setGenSel}
        />
        <FiltroDropdown
          titulo="Precio"
          opciones={["Todos", "Menor a Mayor", "Mayor a Menor"]}
          seleccionado={orden}
          onSelect={setOrden}
        />
      </View>

      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.idProducto.toString()}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/detalle",
              params: {
                idProducto: item.idProducto.toString(),
                nombre: item.nombre,
                precio: item.precio.toString(),
                imagenUrl: item.imagenUrl,
                descripcion: item.descripcion,
                categoria: item.categoria, // ENVIAMOS LA CATEGORÍA AL DETALLE
              },
            }}
            asChild
          >
            <TouchableOpacity style={styles.card}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.imagenUrl }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.info}>
                <Text numberOfLines={1} style={styles.cardNombre}>
                  {item.nombre}
                </Text>
                <Text style={styles.precio}>
                  ${item.precio.toLocaleString("es-CO")} COL
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        numColumns={width > 768 ? 4 : 2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoIcon: { fontSize: 26, marginRight: 8 },
  headerTitle: { fontSize: 22, fontWeight: "900" },
  botonLogin: {
    backgroundColor: Colors.dark,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  botonLoginText: { color: Colors.white, fontWeight: "bold" },
  filtrosBarra: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  list: { paddingHorizontal: 12 },
  card: {
    width: cardWidth,
    margin: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardNombre: { fontWeight: "bold" },
  imageContainer: { width: "100%", height: 150, justifyContent: "center" },
  image: { width: "100%", height: "100%" },
  info: { padding: 14, borderTopWidth: 1, borderColor: "#eee" },
  precio: { color: "red", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center" },
});

export default HomeScreen;
