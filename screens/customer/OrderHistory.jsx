import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../firebaseconfig";
import { doc, getDoc } from "firebase/firestore";

function OrderHistory({ navigation }) {
    const [orderList, setOrderList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const stored = await AsyncStorage.getItem("order_ids");
            const ids = stored ? JSON.parse(stored) : [];

            const orders = [];
            for (let id of ids) {
                const docSnap = await getDoc(doc(db, "orders", id));
                if (docSnap.exists()) {
                    orders.push({ id, ...docSnap.data() });
                }
            }
            setOrderList(orders);
        } catch (error) {
            console.error("Failed to load orders", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#029A35" style={styles.loader} />;
    }

    if (orderList.length === 0) {
        return <Text style={styles.emptyText}>No past orders found.</Text>;
    }

    return (
        <FlatList
            data={orderList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("OrderTracker", { orderId: item.id })}
                >
                    <Text style={styles.title}>Tracking ID: {item.trackingId}</Text>
                    <Text>Status: {item.status}</Text>
                    <Text>Payment: {item.paymentMethod}</Text>
                    <Text>Date: {item.orderDate?.toDate().toLocaleString()}</Text>
                </TouchableOpacity>
            )}
        />
    );
}

export default OrderHistory;

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#f0f0f0",
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 15,
        borderRadius: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
        color: "gray",
    },
});
