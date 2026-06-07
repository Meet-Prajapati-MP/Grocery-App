import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from '@expo/vector-icons/Feather';

function Category({ item, onDelete, onUpdate }) {
    return (
        <View style={styles.Category}>
            <View style={styles.wrapper}> 
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
            </View>
            <View style={styles.btngroup}>
                {/* Delete Button */}
                <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.btn, { backgroundColor: 'red' }]}>
                    <Text style={styles.btnText}>
                        <Feather name="trash-2" size={20} color="black" /> Delete
                    </Text>
                </TouchableOpacity>
                {/* Update Button */}
                <TouchableOpacity onPress={() => onUpdate(item)} style={[styles.btn, { backgroundColor: '#029A35' }]}>
                    <Text style={styles.btnText}>
                        <Feather name="edit" size={20} color="black" /> Update
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Category;

const styles = StyleSheet.create({
    Category: { 
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    wrapper: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between', 
    },
    title: {
        fontSize: 20,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#333',
    },
    desc: {
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular',
        color: '#555',
    },
    btngroup: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    btn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        textAlign: 'center',
    },
});
