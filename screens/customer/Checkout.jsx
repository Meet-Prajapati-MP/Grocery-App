import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { useCartStore } from "../../store/cart";
import { db } from "../../firebaseconfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const steps = ["Shipping", "Review", "Payment"];
const screenWidth = Dimensions.get("window").width;

function Checkout({ navigation, route }) {
  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const cart = useCartStore((store) => store.cart);

  useEffect(() => {
    if (route.params?.selectedAddress) {
      setSelectedAddress(route.params.selectedAddress);
    }
  }, [route.params?.selectedAddress]);

  const getOrderBreakdown = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const delivery = 9.9;
    const total = subtotal + tax + delivery;
    return { subtotal, tax, delivery, total };
  };

  const getTotalAmount = () => {
    const { total } = getOrderBreakdown();
    return total;
  };

  const placeOrderToFirestore = async (paymentStatus = "Pending", method = "COD") => {
    try {
      const colRef = collection(db, "orders");
      const docRef = await addDoc(colRef, {
        address: selectedAddress,
        status: paymentStatus,
        paymentMethod: method,
        cart,
        orderDate: serverTimestamp(),
        trackingId: `TRK${Math.floor(Math.random() * 100000)}`,
        total: getTotalAmount(),
      });

      Alert.alert("Success", "Order placed successfully!");
      navigation.navigate("OrderStatus", { orderId: docRef.id });
    } catch (error) {
      console.error("Order Error:", error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    }
  };


  const StepHeader = () => (
    <View style={styles.stepContainer}>
      {steps.map((title, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setStep(index)}
          style={styles.step}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.circle,
              {
                backgroundColor: step === index ? "#029A35" : "#fff",
                borderColor: step === index ? "#000" : "#029A35",
              },
            ]}
          >
            <Text style={{ color: step === index ? "#fff" : "#029A35", fontWeight: "bold" }}>
              {index + 1}
            </Text>
          </View>
          <Text style={[styles.stepLabel, step === index && styles.activeStep]}>{title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <TextInput
            placeholder="Enter shipping address"
            value={selectedAddress}
            onChangeText={setSelectedAddress}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() => navigation.navigate("LocationScreen")}
          >
            <Ionicons name="location-outline" size={20} color="#029A35" />
            <Text style={styles.mapBtnText}>Select On Map</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (step === 1) {
      const { subtotal, tax, delivery, total } = getOrderBreakdown();
    
      return (
        <>
          <Text style={styles.sectionTitle}>Review Your Order</Text>
          <View style={styles.reviewBox}>
            <Text style={styles.reviewLabel}>Shipping Address</Text>
            <Text>{selectedAddress}</Text>
    
            <Text style={styles.reviewLabel}>Order Summary</Text>
            {cart.map((item, index) => {
              if (!item || !item.name || !item.url) return null; 
    
              return (
                <View key={index} style={styles.summaryItem}>
                  
                   
                  
                    <Image
                      resizeMode="cover"
                      source={{ uri: item.url || "https://via.placeholder.com/90" }}
                      style={styles.img}
                    />
               
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>
                      {item.name} × {item.quantity}
                    </Text>
                    <Text style={styles.productPrice}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              );
            })}
    
            <View style={{ marginTop: 12 }}>
              <Text style={styles.reviewLabel}>Subtotal: ₹{subtotal.toFixed(2)}</Text>
              <Text style={styles.reviewLabel}>Tax (5%): ₹{tax.toFixed(2)}</Text>
              <Text style={styles.reviewLabel}>Delivery Fee: ₹{delivery.toFixed(2)}</Text>
            </View>
    
            <Text style={styles.totalText}>Total: ₹{total.toFixed(2)}</Text>
          </View>
        </>
      );
    }
    
    

    if (step === 2) {
      return (
        <>
          <Text style={styles.sectionTitle}>Choose a Payment Method</Text>
          {paymentOptions.map((method) => (
            <TouchableOpacity
              key={method.key}
              style={[
                styles.optionTile,
                selectedPayment === method.key && styles.selectedTile,
              ]}
              onPress={() => setSelectedPayment(method.key)}
            >
              <Image source={method.logo} style={styles.logo} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.optionTitle}>{method.title}</Text>
                <Text style={styles.optionDesc}>{method.desc}</Text>
              </View>
              {selectedPayment === method.key && (
                <Ionicons name="checkmark-circle" size={24} color="#029A35" />
              )}
            </TouchableOpacity>
          ))}
        </>
      );
    }
    return null;
  };

  const paymentOptions = [
    { key: "card", title: "Card", desc: "Credit / Debit Card", logo: require("../../assets/Card.png") },
    { key: "upi", title: "UPI", desc: "Pay using UPI ID", logo: require("../../assets/upi.png") },
    { key: "gpay", title: "GPay", desc: "Google Pay", logo: require("../../assets/Gpay.png") },
    { key: "phonepay", title: "PhonePe", desc: "PhonePe Payment", logo: require("../../assets/phonepay.png") },
    { key: "paytm", title: "Paytm", desc: "Paytm Rupay", logo: require("../../assets/paytym.png") },
    { key: "cod", title: "Cash on Delivery", desc: `₹${getTotalAmount().toFixed(2)}`, logo: require("../../assets/cod.png") },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <StepHeader />
        <View style={{ padding: 16 }}>{renderStepContent()}</View>
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navBtn}>
            <Text style={styles.navBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < steps.length - 1 ? (
          <TouchableOpacity onPress={() => setStep(step + 1)} style={styles.navBtn}>
            <Text style={styles.navBtnText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
          onPress={() => {
            if (selectedPayment === "cod") {
              placeOrderToFirestore("Pending", "COD");
            } else {
              navigation.navigate("QRPaymentScreen", {
                onPaymentSuccess: () =>
                  placeOrderToFirestore("Paid", selectedPayment.toUpperCase()),
              });
            }
          }}
          
          style={[styles.navBtn, { backgroundColor: "#029A35" }]}
        >
            <Text style={[styles.navBtnText, { color: "#fff" }]}>Submit Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default Checkout;




// Styles remain the same


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 20,
  },
  step: { alignItems: "center", flex: 1 },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  stepLabel: { 
    fontSize: 12,
     color: "#aaa",
      marginTop: 4 
    },
  activeStep: {
     fontWeight: "bold", 
     color: "#000" 
    },
  sectionTitle: {
     fontSize: 18,
      fontWeight: "600",
       marginBottom: 12 
      },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  mapBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#E6F7ED",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#029A35",
  },
  img: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 14,
},
  mapBtnText: {
    color: "#029A35",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  optionTile: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    alignItems: "center",
  },
  selectedTile: {
    borderColor: "#029A35",
    backgroundColor: "#E6F7ED",
  },
  logo: { width: 40, height: 40 },
  optionTitle: { fontSize: 16, fontWeight: "600" },
  optionDesc: { fontSize: 13, color: "#555" },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navBtn: {
    backgroundColor: "#029A35",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  navBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  reviewBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  reviewLabel: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
  
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },
});