import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../firebaseconfig";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function OrderStatus({ route }) {
  const navigation = useNavigation();
  const orderId = route.params?.orderId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  const statusColors = {
    Delivered: "#4CAF50",
    Shipped: "#2196F3",
    Processing: "#FF9800",
    Pending: "#9E9E9E",
    Cancelled: "#F44336",
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const cachedOrder = await AsyncStorage.getItem(`order_${orderId}`);
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const orderData = docSnap.data();
        setOrder(orderData);
        await AsyncStorage.setItem(
          `order_${orderId}`,
          JSON.stringify(orderData)
        );
        fetchOrderHistory(orderData.userId, orderId);
      } else if (cachedOrder) {
        const orderData = JSON.parse(cachedOrder);
        setOrder(orderData);
        fetchOrderHistory(orderData.userId, orderId);
      } else {
        setOrder(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch order data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async (userId, currentOrderId) => {
    try {
      const q = query(collection(db, "orders"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const history = [];

      snapshot.forEach((doc) => {
        if (doc.id !== currentOrderId) {
          history.push({ id: doc.id, ...doc.data() });
        }
      });

      history.sort((a, b) => {
        const dateA = a.orderDate?.toDate?.() || new Date(0);
        const dateB = b.orderDate?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setOrderHistory(history);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  useEffect(() => {
    if (!orderId) {
      Alert.alert("Error", "Order ID is missing!");
      navigation.goBack();
      return;
    }

    fetchOrder();

    const docRef = doc(db, "orders", orderId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const updatedOrder = docSnap.data();
        setOrder(updatedOrder);
        AsyncStorage.setItem(
          `order_${orderId}`,
          JSON.stringify(updatedOrder)
        );
        fetchOrderHistory(updatedOrder.userId, orderId);
      }
    });

    return () => unsubscribe();
  }, [orderId]);

  const refreshOrder = async () => {
    setRefreshing(true);
    await AsyncStorage.removeItem(`order_${orderId}`);
    await fetchOrder();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#029A35" style={styles.loader} />
    );
  }

  if (!order) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require("../../assets/emptyorder.png")} // replace with your empty state image
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyText}>Order not found or is empty</Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.browseText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshOrder} />
      }
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>🚚 Live Order Tracking</Text>

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <MaterialIcons name="track-changes" size={20} color="#555" />
          <Text style={styles.label}>Tracking ID:</Text>
          <Text style={styles.value}>{order.trackingId || "Not Assigned"}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="wallet-outline" size={20} color="#555" />
          <Text style={styles.label}>Payment:</Text>
          <Text style={styles.value}>{order.paymentMethod || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="calendar-day" size={18} color="#555" />
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {order.orderDate?.toDate().toLocaleString() || "Unknown"}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Entypo name="progress-full" size={18} color="#555" />
          <Text style={styles.statusLabel}>Status:</Text>
          <Text
            style={[
              styles.statusValue,
              { color: statusColors[order.status] || "#000" },
            ]}
          >
            {order.status || "Pending"}
          </Text>
        </View>
      </View>

      <Text style={styles.productsTitle}>🛒 Ordered Items</Text>
      {!order.cart || order.cart.length === 0 ? (
        <Text style={styles.noProducts}>No products found in this order.</Text>
      ) : (
        order.cart.map((item, index) => (
          <View key={index} style={styles.productCard}>
            <Image source={{ uri: item.url }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productText}>Price: ₹{item.price}</Text>
              <Text style={styles.productText}>Qty: {item.quantity}</Text>
            </View>
          </View>
        ))
      )}

      {orderHistory.length > 0 && (
        <>
          <Text style={styles.historyTitle}>📖 Past Orders</Text>
          {orderHistory.map((o, idx) => (
            <View key={idx} style={styles.historyCard}>
              <Text style={styles.historyDate}>
                {o.orderDate?.toDate?.().toLocaleString() || "Unknown"}
              </Text>
              <Text>
                Status:{" "}
                <Text style={{ color: statusColors[o.status] || "#000" }}>
                  {o.status}
                </Text>
              </Text>
              <Text>Total Products: {o.cart?.length || 0}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

export default OrderStatus;



const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: "#F8F8F8",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#029A35",
        textAlign: "center",
        marginBottom: 20,
    },
    infoCard: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    label: {
        fontWeight: "600",
        marginLeft: 6,
        marginRight: 4,
    },
    value: {
        flexShrink: 1,
        color: "#333",
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },
    statusLabel: {
        fontWeight: "700",
        fontSize: 16,
        marginRight: 6,
    },
    statusValue: {
        fontWeight: "bold",
        fontSize: 16,
    },
    productsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    productCard: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 12,
    },
    productInfo: {
        justifyContent: "center",
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    productText: {
        fontSize: 14,
        color: "#555",
    },
    noProducts: {
        textAlign: "center",
        fontSize: 16,
        color: "gray",
        marginTop: 20,
    },
    errorText: {
        textAlign: "center",
        fontSize: 16,
        color: "red",
        marginTop: 20,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 10,
    },
    historyCard: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    historyDate: {
        fontWeight: "bold",
        marginBottom: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#F8F8F8",
      },
      emptyImage: {
        width: 250,
        height: 250,
        marginBottom: 20,
        opacity: 0.9,
      },
      emptyText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#777",
        marginBottom: 16,
        textAlign: "center",
      },
      browseBtn: {
        backgroundColor: "#029A35",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
      },
      browseText: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
      },
    
});
