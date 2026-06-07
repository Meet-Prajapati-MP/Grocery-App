import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseconfig";

function Signin({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in both fields.");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate("Customer");
        } catch (error) {
            Alert.alert("Error", error.message?.toString() || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.signin}>
            <Text style={styles.headerText}>Sign In</Text>
            <View style={styles.wrapper}>
                <Text style={styles.labelText}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <Text style={styles.labelText}>Password:</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSignin} style={styles.btn} disabled={loading}>
                    <Text style={styles.btnText}>{loading ? "Signing in..." : "Sign In"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
            </View>

        
            <Text style={styles.copyText}>© {new Date().getFullYear()} Venom Technologies. All rights reserved.</Text>
        </View>
    );
}

export default Signin;

const styles = StyleSheet.create({
    signin: {
        backgroundColor: "#029A35",
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    headerText: {
        color: 'white',
        fontFamily: 'Montserrat_700Bold',
        fontSize: 36,
        textAlign: 'center',
        marginBottom: 20,
    },
    wrapper: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
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
        marginBottom: 10,
        backgroundColor: "#F5F5F5",
    },
    btn: {
        backgroundColor: "#029A35",
        padding: 14,
        borderRadius: 14,
        marginTop: 10,
        alignItems: "center",
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
    },
    linkText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        marginTop: 10,
    },
    forgotText: {
        color: 'grey',
        fontFamily: 'Montserrat_700Bold',
    },
    copyText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        marginTop: 20,
        fontFamily: 'Montserrat_400Regular',
    },
});
