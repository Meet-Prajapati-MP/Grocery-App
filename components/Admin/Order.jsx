import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import { db } from "../../firebaseconfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

function AdminOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function fetchOrders() {
            const querySnapshot = await getDocs(collection(db, "orders"));
            setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
        fetchOrders();
    }, []);

    async function markAsDelivered(orderId) {
        await updateDoc(doc(db, "orders", orderId), { status: "Delivered" });
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: "Delivered" } : order));
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={order => order.id}
            renderItem={({ item }) => (
                <View style={styles.order}>
                    <Text style={styles.title}>Order ID: {item.id}</Text>
                    <Text style={styles.customer}>Customer: {item.name}</Text>
                    <Text style={styles.status}>Status: {item.status}</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productList}>
                        {item.cart?.map((product, index) => (
                            <View key={index} style={styles.productItem}>
                                <Image source={{ uri: product.url }} style={styles.image} />
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName}>{product.name}</Text>
                                    <Text>Qty: {product.quantity}</Text>
                                    <Text>Total: ₹{product.price * product.quantity}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {item.status !== "Delivered" && (
                        <TouchableOpacity style={styles.btn} onPress={() => markAsDelivered(item.id)}>
                            <Text style={styles.btnText}>Mark as Delivered</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        />
    );
}

export default AdminOrders;

const styles = StyleSheet.create({
    order: {
        padding: 15,
        backgroundColor: "white",
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    customer: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5,
    },
    status: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#E74C3C",
        marginBottom: 10,
    },
    productList: {
        marginBottom: 10,
    },
    productItem: {
        flexDirection: "row",
        backgroundColor: "#f9f9f9",
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
        alignItems: "center",
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    productDetails: {
        justifyContent: "center",
    },
    productName: {
        fontSize: 14,
        fontWeight: "bold",
    },
    btn: {
        backgroundColor: "#029A35",
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    btnText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
});
