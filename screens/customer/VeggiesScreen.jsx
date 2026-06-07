import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';

const vegetablesData = [
  {
    name: 'Carrot',
    price: 60,
    image: require('../../assets/carrot.png'),
  },
  {
    name: 'Broccoli',
    price: 90,
    image: require('../../assets/broccoli.png'),
  },
  {
    name: 'Spinach',
    price: 40,
    image: require('../../assets/spinach.png'),
  },
  {
    name: 'Peas',
    price: 100,
    image: require('../../assets/peas.png'),
  },
  {
    name: 'Tomato',
    price: 30,
    image: require('../../assets/tomato.png'),
  },
  {
    name: 'Peas',
    price: 100,
    image: require('../../assets/peas.png'),
  },
  {
    name: 'Tomato',
    price: 30,
    image: require('../../assets/tomato.png'),
  },
  {
    name: 'Peas',
    price: 100,
    image: require('../../assets/peas.png'),
  },
];

const VeggiesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vegetables, setVegetables] = useState(vegetablesData);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = vegetablesData.filter((veg) =>
      veg.name.toLowerCase().includes(text.toLowerCase())
    );
    setVegetables(filtered);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.heartIcon}>
        <AntDesign name="hearto" size={16} color="#666" />
      </TouchableOpacity>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price} <Text style={{ color: '#888' }}>/Kg</Text></Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#029A35" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Vegetables</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for vegetables..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Products Grid */}
      <FlatList
        data={vegetables}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No vegetables found.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default VeggiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#029A35',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  list: {
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#f5fdf6',
    flex: 1,
    margin: 8,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#029A35',
    marginTop: 4,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#029A35',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  plus: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 40,
  },
});
