import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

const CardProducto = ({ producto, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: producto.imagenUrl || 'https://via.placeholder.com/150' }} 
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Text style={styles.precio}>${producto.precio.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.white, borderRadius: 10, margin: 10, elevation: 3, overflow: 'hidden' },
  image: { width: '100%', height: 180 },
  info: { padding: 10 },
  nombre: { fontSize: 16, fontWeight: 'bold' },
  precio: { fontSize: 18, color: Colors.primary, fontWeight: '900', marginTop: 5 }
});

export default CardProducto;