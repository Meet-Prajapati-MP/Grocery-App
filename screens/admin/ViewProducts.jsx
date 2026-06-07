import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import useCustomFont from "../../hooks/useCustomFont";
import { useNavigation } from "@react-navigation/native";

function ManageProducts({}) {
    useCustomFont();
    const [products, setProducts] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const colRef = collection(db, "products");
            const snapshot = await getDocs(colRef);
            const productList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productList);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    async function deleteProduct(id) {
        Alert.alert("Delete Product", "Are you sure you want to delete this product?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteDoc(doc(db, "products", id));
                        setProducts(products.filter((product) => product.id !== id));
                        Alert.alert("Success", "Product deleted successfully.");
                    } catch (error) {
                        console.error("Error deleting product:", error);
                    }
                },
            },
        ]);
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                    <View style={styles.productCard}>
                        <Image source={{ uri: item.url }} style={styles.image} />
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.price}>₹{item.price}</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity 
                                style={styles.editButton} 
                                onPress={() => navigation.navigate("UpdateProduct", { product: item })}
                            >
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.deleteButton} 
                                onPress={() => deleteProduct(item.id)}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

export default ManageProducts;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: "#f2f2f2",
    },
    row: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        flexWrap: "wrap",
    },
    productCard: { 
        backgroundColor: "white", 
        padding: 12, 
        borderRadius: 12, 
        marginBottom: 15, 
        width: "48%",
        elevation: 3,
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    image: { 
        width: "100%", 
        height: 120, 
        borderRadius: 10, 
        resizeMode: "cover",
    },
    title: { 
        fontSize: 16, 
        fontWeight: "bold", 
        marginTop: 8, 
        color: "#333",
    },
    price: { 
        fontSize: 18, 
        color: "#029A35", 
        fontWeight: "bold",
        marginTop: 4,
    },
    buttonGroup: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 10,
    },
    editButton: { 
        backgroundColor: "#029A35", 
        paddingVertical: 10, 
        paddingHorizontal: 15, 
        borderRadius: 8,
    },
    deleteButton: { 
        backgroundColor: "red", 
        paddingVertical: 10, 
        paddingHorizontal: 15, 
        borderRadius: 8,
    },
    buttonText: { 
        color: "white", 
        fontWeight: "bold", 
        textAlign: "center",
    },
});
