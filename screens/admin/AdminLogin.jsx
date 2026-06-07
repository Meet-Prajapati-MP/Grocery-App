import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useCustomFont from "../../hooks/useCustomFont";
import {collection, getDocs, query, where} from 'firebase/firestore'

import Toast from 'react-native-toast-message';
import { useState } from "react";

function AdminLogin({navigation}) {

    useCustomFont()

    let [unm,setUnm] = useState("")
    let [pwd,setPwd] = useState("")


    async function login(){
        let q = query(collection(db,"admins"),where("unm","==",unm),where("pwd","==",pwd))
        let querySnapshot = await getDocs(q)

        if(querySnapshot.docs.length != 0){
            Toast.show({
                type: 'success',
                text1: 'Login Success',
            });
        }
    }
    return (
        <View style={styles.signin}>
            <Text style={styles.headerText}>Admin Login</Text>
            <Text style={styles.bodyText}>Please enter username & password to sign in </Text>

            <View style={styles.wrapper}>
                <View style={styles.inputgroup}>
                    <Text style={styles.labelText}>Username:</Text>
                    <TextInput onChangeText = {(value)=>setUnm(value)} style={styles.input} />
                </View>
                <View style={styles.inputgroup}>
                    <Text style={styles.labelText}>Password:</Text>
                    <TextInput onChangeText = {(value)=>setPwd(value)} style={styles.input} />
                </View>

                <TouchableOpacity style={styles.btn} >
                    <Text style={styles.btnText} onPress={() => { navigation.navigate("Admin"); }}>Admin Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

let styles = StyleSheet.create({
    signin: {
        backgroundColor: "#029A35",
        flex: 1,
        padding: 20,
    },
    headerText: {
        color: 'white',
        fontFamily: 'Montserrat_700Bold',
        fontSize: 36,
        textAlign: 'center',
        marginTop: 100,
    },
    bodyText: {
        color: "white",
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 20,
        fontFamily: 'Montserrat_600SemiBold',
    },
    wrapper: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 20,
        padding: 20,
    },
    inputgroup: {
        marginBottom: 20,
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
    },
    btn: {
        backgroundColor: "#029A35",
        padding: 14,
        borderRadius: 14,
        marginTop: 10,
        marginBottom: 10,
    },
    socialbtn: {
        backgroundColor: "#029A35",
        padding: 14,
        borderRadius: 14,
        marginTop: 10,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        textAlign: 'center',
    },
    separator: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Montserrat_600SemiBold',
        marginVertical: 10,
    },
    linkText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
    }
})

export default AdminLogin