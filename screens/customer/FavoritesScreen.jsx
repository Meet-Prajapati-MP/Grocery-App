import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFavoriteStore } from "../../store/favorites";
import Product from "../../components/customer/Product";
import useCustomFont from "../../hooks/useCustomFont";

export default function FavoritesScreen() {
    useCustomFont();
    const favorites = useFavoriteStore((state) => state.favorites);
    const navigation = useNavigation();

    const renderEmptyFavorites = () => (
        <View style={styles.emptyContainer}>
            <Image
                source={require("../../assets/whish.png")}
                style={styles.emptyImage}
                resizeMode="contain"
            />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => navigation.navigate("Home")} // Or use your product screen
            >
                <Text style={styles.browseText}>Add Wishlist</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {favorites.length === 0 ? (
                renderEmptyFavorites()
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    renderItem={({ item }) => <Product item={item} />}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FFF9",
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    list: {
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    emptyImage: {
        width: 250,
        height: 250,
        marginBottom: 20,
        opacity: 0.9,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: "Montserrat_700Bold",
        color: "#777",
        marginBottom: 16,
        textAlign: "center",
    },
    browseBtn: {
        backgroundColor: "#029A35",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    browseText: {
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        color: "white",
    },
});
