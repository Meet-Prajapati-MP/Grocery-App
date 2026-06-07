import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import useCustomFont from "../../hooks/useCustomFont";
import { useCartStore } from "../../store/cart";
import AntDesign from '@expo/vector-icons/AntDesign';

function CartItem({ item }) {
    useCustomFont();
    const { updateItemQuantity, removeItem } = useCartStore();  

    const increaseQuantity = () => {
        updateItemQuantity(item.id, item.quantity + 1, item.price);
    };

    const decreaseQuantity = () => {
        if (item.quantity > 1) {
            updateItemQuantity(item.id, item.quantity - 1, item.price);
        } else {
            removeItem(item.id);
        }
    };

    return (
        <View style={styles.card}>
            <Image resizeMode="cover" source={{ uri: item.url }} style={styles.img} />

            <View style={styles.details}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.category}>{item.category}</Text>

                <View style={styles.rowBetween}>
                    <Text style={styles.price}>₹ {item.price * item.quantity}</Text>
                    <Text style={styles.unitPrice}>₹ {item.price}/kg</Text>
                </View>

                <View style={styles.quantityRow}>
                    <TouchableOpacity onPress={decreaseQuantity}>
                        <AntDesign name="minuscircleo" size={22} color="#444" />
                    </TouchableOpacity>

                    <Text style={styles.count}>{item.quantity}</Text>

                    <TouchableOpacity onPress={increaseQuantity}>
                        <AntDesign name="pluscircleo" size={22} color="#444" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                <AntDesign name="delete" size={22} color="red" />
            </TouchableOpacity>
        </View>
    );
}

export default CartItem;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        marginBottom: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },
    img: {
        width: 90,
        height: 90,
        borderRadius: 12,
        marginRight: 14,
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
        color: "#222",
        marginBottom: 2,
    },
    category: {
        fontSize: 13,
        fontFamily: "Montserrat_600SemiBold",
        color: "#777",
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        fontFamily: "Montserrat_700Bold",
        color: "#0A843E",
    },
    unitPrice: {
        fontSize: 12,
        color: "#999",
        fontFamily: "Montserrat_500Medium",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    count: {
        fontSize: 18,
        fontFamily: "Montserrat_700Bold",
        marginHorizontal: 10,
        color: "#555",
    },
    removeBtn: {
        marginLeft: 10,
    },
});
