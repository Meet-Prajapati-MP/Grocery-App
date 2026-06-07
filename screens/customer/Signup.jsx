import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { registerUser } from ".././../firebaseconfig";

function Signup({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            await registerUser(email, password);
            Alert.alert("Success", "Account created successfully!");
            navigation.navigate("Profile");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.signup}>
            <Text style={styles.headerText}>Sign Up</Text>
            <View style={styles.wrapper}>
                <Text>Email:</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} />

                <Text>Password:</Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

                <TouchableOpacity onPress={handleSignup} style={styles.btn}>
                    <Text style={styles.btnText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
                    <Text style={styles.linkText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

;

export default Signup;

let styles = StyleSheet.create({
    signup: {
        backgroundColor: '#029A35',
        flex: 1,
        padding: 20,
    },
    wrapper: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        flex: 1,
    },
    headerText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 36,
        marginTop: 100,
        fontFamily: 'Montserrat_700Bold',
    },
    bodyText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
    },
    inputgroup: {
        marginBottom: 20,
    },
    labelText: {
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        marginBottom:5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        fontSize: 18,
    },
    btn: {
        backgroundColor: '#029A35',
        padding: 14,
        borderRadius: 14,
        marginBottom:20,
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    linkText:{
        color:'black',
        textAlign:'center',
        fontSize:18,
        fontFamily: 'Montserrat_600SemiBold',
    }
    
})

