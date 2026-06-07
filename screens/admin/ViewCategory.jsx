import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { db } from '../../firebaseconfig';
import Category from '../../components/Admin/Category';
import useCustomFont from "../../hooks/useCustomFont";
import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import ToastManager, { Toast } from "toastify-react-native";

function ViewCategory({ navigation }) {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    useCustomFont();

    useEffect(() => {
        Toast.success("Category Updated Successfully!");
        getCategory();
    }, []);

    async function getCategory() {
        const colref = collection(db, "category");
        onSnapshot(
            colref,
            (snapshot) => {
                let result = [];
                snapshot.docs.forEach((doc) => {
                    result.push({ id: doc.id, ...doc.data() });
                });
                setCategory(result);
                setLoading(false);
            },
            (err) => {
                setError('Failed to fetch categories');
                setLoading(false);
                console.error(err);
            }
        );
    }

   
    const deleteCategory = async (categoryId) => {
        try {
            const docRef = doc(db, "category", categoryId);
            await deleteDoc(docRef);
            setCategory(category.filter(item => item.id !== categoryId)); 
            alert('Category deleted successfully');
        } catch (error) {
            alert('Error deleting category');
            console.error(error);
        }
    };

  
    const updateCategory = (item) => {
        navigation.navigate("UpdateCategory", { item });
    };

   
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>{error}</Text>
            </View>
        );
    }

    
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading categories...</Text>
            </View>
        );
    }

    return (
        <View style={styles.ViewCategory}>
            <ToastManager/>
            <FlatList
                data={category}
                renderItem={({ item }) => (
                    <Category item={item} onDelete={deleteCategory} onUpdate={updateCategory} />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

export default ViewCategory;

const styles = StyleSheet.create({
    ViewCategory: {
        flex: 1,
        padding: 30,
        paddingTop: 40,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});
