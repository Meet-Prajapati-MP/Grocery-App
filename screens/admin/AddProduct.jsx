import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync, MediaTypeOptions } from "expo-image-picker";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert, Platform } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { db, storage } from '../../firebaseconfig';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Toast from "toastify-react-native";

function AddProduct() {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [uri, setUri] = useState(null);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [value, setValue] = useState(null);
    const [url, setUrl] = useState(null);
    const [price, setPrice] = useState('');

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

    async function pickImage() {
        if (Platform.OS === 'web') {
            Alert.alert("Not supported on web", "Upload images from the native app or add a web file picker later.");
            return;
        }

        const { status } = await requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Denied", "You need to grant access to your media library.");
            return;
        }

        try {
            let image = await launchImageLibraryAsync({
                mediaTypes: MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (image.canceled) {
                Alert.alert("No Image Selected", "Please select an image.");
                return;
            }

            let imageName = image.assets[0].uri.split("/").pop();
            setUri(image.assets[0].uri);

            let response = await fetch(image.assets[0].uri);
            let blob = await response.blob();
            let imageRef = ref(storage, `image/${imageName}`);
            let result = await uploadBytes(imageRef, blob);
            let imageUrl = await getDownloadURL(result.ref);
            setUrl(imageUrl);
        } catch (error) {
            console.error("Image upload failed:", error);
            Alert.alert("Upload Failed", "Could not upload image.");
        }
    }

    async function addProduct() {
        if (!name || !desc || !value || !url || !price) {
            Alert.alert("Missing Information", "All fields are required!");
            return;
        }

        try {
            let colref = collection(db, "products");
            await addDoc(colref, {
                name,
                desc,
                category: value,
                url,
                price: Number(price),
            });

            Toast.success("Product Saved Successfully");

            // Reset fields
            setName('');
            setDesc('');
            setValue(null);
            setUri(null);
            setUrl(null);
            setPrice('');
        } catch (error) {
            console.error("Error adding product:", error);
            Toast.error("Failed to save product.");
        }
    }

    return (
        <View style={styles.addProduct}>
           
                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Name:</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Description:</Text>
                    <TextInput
                        style={[styles.input, { height: 150, textAlignVertical: 'top' }]}
                        multiline
                        value={desc}
                        onChangeText={setDesc}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Category:</Text>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder="---Choose Category---"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Image:</Text>
                    <View style={styles.row}>
                        {uri ? (
                            <Image source={{ uri }} style={{ width: 150, height: 150, borderRadius: 10 }} />
                        ) : (
                            <Ionicons name="image" size={150} color="black" />
                        )}
                        <TouchableOpacity style={styles.btn} onPress={pickImage}>
                            <Text style={styles.btnText}>Choose Image</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Price:</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity style={styles.btn} onPress={addProduct}>
                    <Text style={styles.btnText}>Add Product</Text>
                </TouchableOpacity>
            
        </View>
    );
}

export default AddProduct;

const styles = StyleSheet.create({
    addProduct: {
        flex: 1,
        padding: 15,
        paddingTop: 15, 
        backgroundColor: "white",
    },
    inputGroup: {
        marginBottom: 10,
    },
    labelText: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        fontSize: 16,
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: "#029A35",
        padding: 14,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Montserrat_600SemiBold',
        textAlign: 'center',
    },
});
