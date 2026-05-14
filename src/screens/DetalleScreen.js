import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';

const DetalleScreen = ({ route, navigation }) => {
  const { producto } = route.params;
  const userIsLoggedIn = false; // Aquí luego conectaremos con el estado real

  const handleComprar = () => {
    if (!userIsLoggedIn) {
      Alert.alert(
        "Registro Requerido",
        "Debes iniciar sesión para realizar una compra.",
        [
          { text: "Seguir viendo", style: "cancel" },
          { text: "Ir al Login", onPress: () => navigation.navigate('Login') }
        ]
      );
    } else {
      // Aquí iría la lógica para enviar al ComprasController
      navigation.navigate('Checkout', { producto });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: producto.imagenUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Text style={styles.descripcion}>{producto.descripcion}</Text>
        <Text style={styles.precio}>${producto.precio.toLocaleString()}</Text>
        
        <TouchableOpacity style={styles.btn} onPress={handleComprar}>
          <Text style={styles.btnText}>COMPRAR AHORA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  image: { width: '100%', height: 350 },
  info: { padding: 20 },
  nombre: { fontSize: 24, fontWeight: 'bold' },
  descripcion: { color: Colors.gray, marginVertical: 10 },
  precio: { fontSize: 28, fontWeight: '900', color: Colors.primary },
  btn: { backgroundColor: Colors.dark, padding: 15, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: 'bold', fontSize: 18 }
});

export default DetalleScreen;