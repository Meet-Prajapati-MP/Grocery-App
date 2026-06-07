// screens/QRPaymentScreen.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";

function QRPaymentScreen({ navigation, route }) {
  const onPaymentSuccess = route.params?.onPaymentSuccess;

  useEffect(() => {
    
  }, []);

  const handleSimulatedPayment = () => {
    Alert.alert("Payment Confirmed", "Your payment has been verified.", [
      {
        text: "OK",
        onPress: () => {
          onPaymentSuccess(); 
          navigation.goBack(); 
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan this UPI QR Code</Text>
      <Image
        source={require('../assets/qr.png')} // Add a sample QR image in your assets
        style={styles.qrImage}
      />
      <Text style={styles.desc}>Use GPay / PhonePe / Paytm to complete payment</Text>

      <TouchableOpacity style={styles.confirmBtn} onPress={handleSimulatedPayment}>
        <Text style={styles.confirmText}>I Have Paid</Text>
      </TouchableOpacity>
    </View>
  );
}

export default QRPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  qrImage: {
    width: 250,
    height: 250,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  confirmBtn: {
    backgroundColor: "#029A35",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
