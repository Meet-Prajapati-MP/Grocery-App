// screens/customer/VeggiesScreen.js

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../../firebaseconfig";
import { collection, onSnapshot } from "firebase/firestore";
import Product from "../../components/customer/Product";

function Fruits() {
    const [veggies, setVeggies] = useState([]);

    useEffect(() => {
        const colref = collection(db, "products");
        const unsubscribe = onSnapshot(colref, (snapshot) => {
            const filtered = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(product => product.category === "Veggies");

            setVeggies(filtered);
        });

        return () => unsubscribe(); // cleanup
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Veggies</Text>
            <FlatList
                data={veggies}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => <Product item={item} small />}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

export default Fruits;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        paddingTop: 50,
    },
    heading: {
        fontSize: 20,
        fontFamily: "Montserrat_700Bold",
        marginHorizontal: 20,
        marginBottom: 10,
    },
    list: {
        paddingHorizontal: 10,
    },
});
