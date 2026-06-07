import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useCartStore } from "../../store/cart";
import { useFavoriteStore } from "../../store/favorites";

function ProductDetails({ route, navigation }) {
  const { item } = route.params;
  const addToCart = useCartStore((store) => store.addToCart);
  const { favorites, toggleFavorite } = useFavoriteStore();

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav.id === item.id));
  }, [favorites]);

  const handleFavoriteToggle = () => {
    toggleFavorite(item);
  };

  const handleAddToCart = () => {
    addToCart({ ...item, quantity });
    navigation.navigate("Cart");
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
          
          </TouchableOpacity>

          <Text style={styles.headerTitle}> Product Details</Text>

          <TouchableOpacity onPress={handleFavoriteToggle}>
            {isFavorite ? (
              <AntDesign name="heart" size={24} color="red" />
            ) : (
              <Feather name="heart" size={24} color="black" />
            )}
          </TouchableOpacity>
        </View>

        <Image source={{ uri: item.url }} style={styles.image} />

        <View style={styles.pagination}>
          <View style={styles.dot} />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.category}>Fruit</Text>

          <View style={styles.rowBetween}>
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <AntDesign name="minuscircleo" size={22} color="#029A35" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity} Kg</Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                <AntDesign name="pluscircleo" size={22} color="#029A35" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.ratingRow}>
            {[1, 2, 3, 4].map((_, i) => (
              <AntDesign key={i} name="star" size={18} color="#FFB800" />
            ))}
            <AntDesign name="staro" size={18} color="#FFB800" />
            <Text style={styles.ratingText}> (4.5)</Text>
          </View>

          <Text style={styles.detailsTitle}>Product Details</Text>
          <Text style={styles.description}>
            {item.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}
            <Text style={styles.readMore}> Read more</Text>
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.totalPrice}>
          Total Price{"\n"}
          <Text style={styles.price}>₹{(item.price * quantity).toFixed(2)}</Text>
        </Text>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Feather name="shopping-cart" size={20} color="#fff" />
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProductDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  pagination: {
    alignItems: "center",
    marginVertical: 8,
  },
  dot: {
    width: 30,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#029A35",
  },
  detailsContainer: {
    padding: 16,
  },
  category: {
    fontSize: 14,
    color: "gray",
    marginBottom: 4,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  ratingText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 4,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  readMore: {
    color: "#029A35",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  totalPrice: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#029A35",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
