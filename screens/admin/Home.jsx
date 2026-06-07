import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Animated } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebaseconfig";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState({ orders: 0, products: 0, categories: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const fabAnimation = new Animated.Value(0);

  useEffect(() => {
    fetchStats();
    Animated.loop(
      Animated.sequence([
        Animated.timing(fabAnimation, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(fabAnimation, { toValue: 0, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  async function fetchStats() {
    try {
      const ordersSnap = await getDocs(collection(db, "orders"));
      const productsSnap = await getDocs(collection(db, "products"));
      const categoriesSnap = await getDocs(collection(db, "category"));
      const usersSnap = await getDocs(collection(db, "users"));
      setStats({
        orders: ordersSnap.size,
        products: productsSnap.size,
        categories: categoriesSnap.size,
        users: usersSnap.size,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
     
      </View>

      <ScrollView>
        <View style={styles.statsContainer}>
          {[{ key: "Orders", value: stats.orders, icon: "shopping-cart", color: "#ff9800" },
          { key: "Products", value: stats.products, icon: "box", color: "#4caf50" },
          { key: "Categories", value: stats.categories, icon: "layer-group", color: "#2196f3" },
          { key: "Users", value: stats.users, icon: "users", color: "#9c27b0" }].map((item, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: item.color }]}>
              <FontAwesome5 name={item.icon} size={30} color="white" />
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.statNumber}>{item.value}</Text>}
              <Text style={styles.statLabel}>{item.key}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Animated.View style={[styles.fab, { transform: [{ scale: fabAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }]}>
        <TouchableOpacity onPress={() => navigation.navigate("AddProduct")}>
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("View Orders")}>
          <MaterialIcons name="list-alt" size={30} color="white" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("View Products")}>
          <FontAwesome5 name="box" size={30} color="white" />
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("View Category")}>
          <FontAwesome5 name="layer-group" size={30} color="white" />
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => auth.signOut().then(() => navigation.replace("Main"))}>
          <MaterialIcons name="logout" size={30} color="white" />
          <Text style={styles.navText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818"
  },
  header: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white"
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20
  },
  statCard: {
    width: "48%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
    opacity: 0.9,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6, elevation: 6
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginVertical: 5
  },
  statLabel: {
    fontSize: 14,
    color: "white"
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1e1e1e",
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  navButton: {
    alignItems: "center"
  },
  navText: {
    color: "white",
    fontSize: 12,
    marginTop: 5
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#ff4081",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5
  },
});
