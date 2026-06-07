import { useEffect } from "react";

function Signout({navigation}){
    useEffect(()=>{
        navigation.replace("Main")
    },[])
    return null;
}

export default Signout