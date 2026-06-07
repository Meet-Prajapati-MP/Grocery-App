import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import { useCartStore } from "../../store/cart";
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFavoriteStore } from "../../store/favorites"; // ✅ Global favorites store

function Product({ item }) {
    const addToCart = useCartStore((store) => store.addToCart);
    const navigation = useNavigation();

    const favorites = useFavoriteStore((state) => state.favorites);
    const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

    const isFavorite = favorites.some((fav) => fav.id === item.id); // ✅ Check if this item is in favorites

    return (
        <TouchableOpacity
            style={styles.productWrapper}
            onPress={() => navigation.navigate("ProductDetails", { item })}
        >
            <View style={styles.product}>
                {/* ❤️ Favorite Icon */}
                <TouchableOpacity style={styles.favIcon} onPress={() => toggleFavorite(item)}>
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={22}
                        color={isFavorite ? "#FF3D3D" : "#666"}
                    />
                </TouchableOpacity>

                {/* 🖼️ Product Image */}
                <View style={styles.imageContainer}>
                    {item.url ? (
                        <Image source={{ uri: item.url }} style={styles.img} />
                    ) : (
                        <Text style={styles.placeholderText}>No Image</Text>
                    )}
                </View>

                {/* 🏷️ Product Title */}
                <Text numberOfLines={1} style={styles.title}>{item.name}</Text>

                {/* 💰 Price and ➕ Add to Cart */}
                <View style={styles.bottomRow}>
                    <Text style={styles.price}>
                        ₹{item.price} <Text style={styles.unit}>/Kg</Text>
                    </Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                        <Text style={styles.btnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default Product;


const styles = StyleSheet.create({
    productWrapper: {
        flex: 0.5,
        padding: 8,
    },
    product: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        elevation: 3,
        position: "relative",
    },
    favIcon: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
        padding: 5,
    },
    imageContainer: {
        backgroundColor: "#EAF3ED",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        height: 130,
        marginBottom: 10,
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 10,
        resizeMode: "cover",
    },
    placeholderText: {
        fontSize: 14,
        color: "gray",
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#333",
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#029A35",
    },
    unit: {
        fontSize: 12,
        color: "gray",
    },
    addButton: {
        backgroundColor: "#029A35",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    btnText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        lineHeight: 24,
    },
});
