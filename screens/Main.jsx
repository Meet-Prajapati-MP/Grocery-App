import { View,Text,StyleSheet,TouchableOpacity,Image } from "react-native"
import {
    useFonts,
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light_Italic,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black_Italic,
} from '@expo-google-fonts/montserrat';
function Main({navigation}){
    let [fontsLoaded] = useFonts({
        Montserrat_100Thin,
        Montserrat_200ExtraLight,
        Montserrat_300Light,
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_800ExtraBold,
        Montserrat_900Black,
        Montserrat_100Thin_Italic,
        Montserrat_200ExtraLight_Italic,
        Montserrat_300Light_Italic,
        Montserrat_400Regular_Italic,
        Montserrat_500Medium_Italic,
        Montserrat_600SemiBold_Italic,
        Montserrat_700Bold_Italic,
        Montserrat_800ExtraBold_Italic,
        Montserrat_900Black_Italic,
    });


    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.main}>
            <Image source={require("./../assets/groferr.png")} style={{marginBottom:20,}}/>
            <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate("AdminLogin")}>
                <Text style={styles.btnText}>Admin Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate("Signin")}>
                <Text style={styles.btnText}>Customer Login</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Main

let styles = StyleSheet.create({
    main:{
        backgroundColor:"#029A35",
        flex:1,
        justifyContent:'center',
        padding:20,
        alignItems:'center',
    },
    btn:{
        padding:14,
        borderRadius:10,
        backgroundColor:'white',
        marginBottom:20,
        alignSelf:'stretch',
    },
    btnText:{
        fontSize:18,
        textAlign:'center',
        fontFamily:'Montserrat_600SemiBold',
        color:"#029A35"
    },
})