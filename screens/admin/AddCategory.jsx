import {  View,Text,input,StyleSheet,TextInput,TouchableOpacity } from "react-native";
import { addDoc,collection,serverTimestamp } from "firebase/firestore";
import useCustomFont from "../../hooks/useCustomFont";
import{db} from '../../firebaseconfig';
import { useState } from "react";
import ToastManager, { Toast } from "toastify-react-native";

function AddCategory(){
    useCustomFont()
    let [name,setname]=useState()
    let [desc,setdesc]=useState()

    async function AddCategory() {
        if (name ==""|| desc ==""){
            Toast.error("All fields are required")
            return
        }
        try {
            let colref =collection(db,"category")
            await addDoc(colref,{
                name:name,
                desc:desc,
           
        })
        Toast.success("Category Saved")
        
        Toast.success("Category Saved")
        } catch (error) {
            console.log(error)
            Toast.error("Somthing went wrong")
        }
        
    }
    return(
        <View style={style.AddCategory}>
        <ToastManager/>
        <View style={style.inputgroup}>
        <Text style={style.lableText}>name:</Text>
        <TextInput style={style.input}  value={name} onChangeText={(value)=>setname(value)}></TextInput>

        </View>

        <View style={style.inputgroup}>
        <Text style={style.lableText}>Description</Text>
        <TextInput style={[style.input,{height:200,textAlignVeritcal:'top'}]} multiline={true} value={desc} onChangeText={(value)=>setdesc(value)}></TextInput>

        </View>
        <TouchableOpacity style={style.btn} onPress={AddCategory}>
        <Text style={style.btnText}> AddCategory</Text>

        </TouchableOpacity>

        </View>
    )
}
export default AddCategory
let style=StyleSheet.create({
    AddCategory:{
      
        flex:1,
        padding:50,
        paddingTop:40,
        backgroundColor:'white',
    },
    inputgroup: {
        marginBottom: 20,
    },
    lableText: {
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        marginBottom: 5,
    },
    btn: {
        backgroundColor: "#029A35",
        padding: 14,
        borderRadius: 14,
        marginTop: 10,
        marginBottom: 10,
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        textAlign: 'center',
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

})