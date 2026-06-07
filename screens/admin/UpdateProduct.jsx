import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from "../../firebaseconfig";
import { updateDoc, doc, collection, getDocs } from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";

function UpdateProduct() {
    const navigation = useNavigation();
    const route = useRoute();
    
    
    const product = route.params?.product || {
        name: "",
        desc: "",
        price: "",
        category: ""
    };

    const [name, setName] = useState(product.name);
    const [desc, setDesc] = useState(product.desc);
    const [price, setPrice] = useState(String(product.price));
    const [category, setCategory] = useState(product.category);
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getCategories();
    }, []);

    async function getCategories() {
        try {
            const colref = collection(db, "category");
            const snapshot = await getDocs(colref);
            const result = snapshot.docs.map((doc) => ({
                label: doc.data().name,
                value: doc.data().name,
            }));
            setItems(result);
        } catch (error) {
            console.error("Error fetching categories:", error);
            Alert.alert("Error", "Failed to load categories.");
        }
    }

    async function updateProduct() {
        if (!name || !desc || !price || !category) {
            Alert.alert("Error", "All fields are required!");
            return;
        }

        try {
            const productRef = doc(db, "products", product.id);
            await updateDoc(productRef, { name, desc, price: Number(price), category });
            Alert.alert("Success", "Product updated successfully.");
            navigation.goBack();
        } catch (error) {
            console.error("Error updating product:", error);
            Alert.alert("Error", "Failed to update product.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name:</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Description:</Text>
            <TextInput style={[styles.input, { height: 100 }]} multiline value={desc} onChangeText={setDesc} />

            <Text style={styles.label}>Category:</Text>
            <DropDownPicker
                open={open}
                value={category}
                items={items}
                setOpen={setOpen}
                setValue={setCategory}
                setItems={setItems}
                placeholder="Select Category"
            />

            <Text style={styles.label}>Price:</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

            <TouchableOpacity style={styles.updateButton} onPress={updateProduct}>
                <Text style={styles.buttonText}>Update Product</Text>
            </TouchableOpacity>
        </View>
    );
}

export default UpdateProduct;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20,
        paddingTop: 80,  
        backgroundColor: "white",
    },
    label: { 
        fontSize: 16, 
        fontWeight: "600", 
        color: "#333", 
        marginBottom: 5,
    },
    input: { 
        borderWidth: 1, 
        borderColor: "#ccc", 
        padding: 12, 
        borderRadius: 10, 
        fontSize: 16, 
        backgroundColor: "#f9f9f9",
        marginBottom: 15,
    },
    updateButton: { 
        backgroundColor: "#029A35", 
        paddingVertical: 14, 
        borderRadius: 10, 
        marginTop: 15,
        alignItems: "center",
    },
    buttonText: { 
        color: "white", 
        fontSize: 16, 
        fontWeight: "bold", 
        textAlign: "center",
    },
});

