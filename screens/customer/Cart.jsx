import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import useCustomFont from "../../hooks/useCustomFont";
import { useCartStore } from "../../store/cart";
import CartItem from "../../components/customer/CartItem"; // Should match the UI from image

function CartScreen({ navigation }) {
    useCustomFont();
    const cart = useCartStore((store) => store.cart);

    const subTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subTotal * 0.05;
    const service = 42;
    const total = subTotal + tax + service;

    const renderEmptyCart = () => (
        <View style={styles.emptyCart}>
            <Image source={require("../../assets/empty.png")} style={styles.emptyImage} resizeMode="contain" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <TouchableOpacity style={styles.shopNowBtn} onPress={() => navigation.navigate("Home")}>
                <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Cart ({cart.length})</Text>
                <Text style={styles.pincode}>Pincode: 380015 ▼</Text>
            </View>

            {cart.length > 0 ? (
                <>
                    <FlatList
                        data={cart}
                        renderItem={({ item }) => <CartItem item={item} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.cartList}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={styles.offerBox}>
                        <Text style={styles.offerText}>Now GET EXTRA 5% OFF* with Credit card. T&C.</Text>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Sub Total :</Text>
                            <Text style={styles.priceValue}>₹ {subTotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Tax 5% :</Text>
                            <Text style={styles.priceValue}>₹ {tax.toFixed(2)}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Service :</Text>
                            <Text style={styles.priceValue}>₹ {service}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={[styles.priceLabel, styles.totalLabel]}>Total :</Text>
                            <Text style={[styles.priceValue, styles.totalValue]}>₹ {total.toFixed(2)}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.checkoutBtn}
                            onPress={() => navigation.navigate("Checkout")}
                        >
                            <Text style={styles.checkoutText}>CHECKOUT</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : renderEmptyCart()}
        </View>
    );
}

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FFF9",
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontFamily: "Montserrat_700Bold",
        color: "#000",
    },
    pincode: {
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        color: "#555",
        marginTop: 4,
    },
    cartList: {
        paddingBottom: 250,
    },
    offerBox: {
        backgroundColor: "#DFF4E4",
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
    },
    offerText: {
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        color: "#055D28",
    },
    footer: {
        backgroundColor: "#E6F7ED",
        borderRadius: 16,
        padding: 16,
        position: "absolute",
        bottom: 10,
        left: 16,
        right: 16,
        elevation: 6,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
    },
    priceLabel: {
        fontSize: 15,
        fontFamily: "Montserrat_500Medium",
        color: "#555",
    },
    priceValue: {
        fontSize: 15,
        fontFamily: "Montserrat_600SemiBold",
        color: "#111",
    },
    totalLabel: {
        fontSize: 16,
        fontFamily: "Montserrat_700Bold",
        color: "#000",
    },
    totalValue: {
        fontSize: 16,
        fontFamily: "Montserrat_700Bold",
        color: "#000",
    },
    checkoutBtn: {
        marginTop: 16,
        backgroundColor: "#029A35",
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
    },
    checkoutText: {
        fontSize: 16,
        fontFamily: "Montserrat_700Bold",
        color: "#fff",
    },
    emptyCart: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    emptyImage: {
        width: 180,
        height: 180,
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: "Montserrat_700Bold",
        color: "#777",
        marginBottom: 16,
    },
    shopNowBtn: {
        backgroundColor: "#029A35",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    shopNowText: {
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        color: "white",
    },
});
