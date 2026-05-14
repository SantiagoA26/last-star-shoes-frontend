import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import api from "../api/api";

const { width } = Dimensions.get("window");
const cardWidth = width / 2 - 20; // Calcular el ancho para 2 columnas

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
        <ActivityIndicator size="large" color="#CC0000" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imagenUrl || "https://via.placeholder.com/150" }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>
          {item.nombre}
        </Text>
        <Text style={styles.precio}>${item.precio.toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>LAST STAR</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.idProducto.toString()}
        renderItem={renderItem}
        numColumns={2} // Crear la cuadricula
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 2,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    width: cardWidth,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    // Sombra para iOS y Android
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 120, // Altura más pequeña para los cuadritos
  },
  info: {
    padding: 10,
  },
  nombre: {
    fontSize: 14,
    fontWeight: "600",
  },
  precio: {
    fontSize: 14,
    color: "#CC0000",
    fontWeight: "bold",
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
