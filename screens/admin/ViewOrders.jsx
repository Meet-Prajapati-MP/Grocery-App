import { View,StyleSheet,  } from "react-native"
import Order from "../../components/Admin/Order"
import useCustomFont from "../../hooks/useCustomFont"

function ViewOrders(){
    useCustomFont()
    return(
        <View style={styles.ViewOrders}>
            <Order />
        </View>
    )
}

export default ViewOrders

let styles = StyleSheet.create({
    vieworders:{
        flex:1,
        padding:20,
        paddingTop:40,
        backgroundColor:"White",

    }
})