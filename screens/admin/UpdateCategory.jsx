import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebaseconfig';
import useCustomFont from "../../hooks/useCustomFont";
import { useEffect, useState } from "react";
import ToastManager, { Toast } from "toastify-react-native";

function UpdateCategory({ route, navigation }) {

    
    useCustomFont();

    if (!route.params?.item) {
        Toast.error("Invalid category data");
        return null;
    }

    const { item } = route.params;
    const [name, setName] = useState(item.name);
    const [desc, setDesc] = useState(item.desc);

    async function updateCategory() {
        if (name === "" || desc === "") {
            Toast.error("All fields are required");
            return;
        }

        try {
            const docRef = doc(db, "category", item.id); 
            await updateDoc(docRef, { name, desc }); 
            console.log('done')
            Toast.success("Category Updated Successfully!");
        } catch (error) {
            console.error("Error updating category:", error);
            Toast.error("Something went wrong");
        }
    }

    return (
        <View style={styles.container}>
            <ToastManager/>
            <View style={styles.inputGroup}>
                <Text style={styles.labelText}>Name:</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.labelText}>Description:</Text>
                <TextInput
                    style={[styles.input, { height: 200, textAlignVertical: 'top' }]}
                    multiline
                    value={desc}
                    onChangeText={setDesc}
                />
            </View>

            <TouchableOpacity style={styles.btn} onPress={updateCategory}>
                <Text style={styles.btnText}>Update Category</Text>
            </TouchableOpacity>
        </View>
    );
}

export default UpdateCategory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        paddingTop: 40,
        backgroundColor: 'white',
    },
    inputGroup: {
        marginBottom: 20,
    },
    labelText: {
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        fontSize: 18,
        padding: 10,
    },
    btn: {
        backgroundColor: "#029A35",
        padding: 14,
        borderRadius: 14,
        marginTop: 10,
        marginBottom: 10,
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        textAlign: 'center',
    },
});
