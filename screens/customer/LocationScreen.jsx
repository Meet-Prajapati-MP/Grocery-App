import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const LocationScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null); 
  const [selectedCoords, setSelectedCoords] = useState(null); 
  const [liveLocation, setLiveLocation] = useState(''); 
  const [errorMsg, setErrorMsg] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      
     
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setSelectedCoords(loc.coords);
      fetchAddressFromCoords(loc.coords);
    })();
  }, []);


  const fetchAddressFromCoords = async (coords) => {
    setLoadingAddress(true);
    try {
      let addressResponse = await Location.reverseGeocodeAsync(coords);
      if (addressResponse.length > 0) {
        const { name, street, city, region } = addressResponse[0];
        const formattedAddress = `${name}, ${street}, ${city}, ${region}`;
        setLiveLocation(formattedAddress);
      } else {
        setLiveLocation(`Lat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setLiveLocation(`Lat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)}`);
    }
    setLoadingAddress(false);
  };

 
  const handleLongPress = (event) => {
    const coords = event.nativeEvent.coordinate;
    setSelectedCoords(coords);
    fetchAddressFromCoords(coords);
  };

  
  const handleSelectLocation = () => {
    navigation.navigate("Checkout", { selectedAddress: liveLocation, coords: selectedCoords });
  };

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.info}>{errorMsg}</Text>
      </SafeAreaView>
    );
  }

  if (!location || !selectedCoords) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#029A35" />
        <Text style={styles.info}>Fetching live location...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.address}>Live Location: {liveLocation}</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onLongPress={handleLongPress} 
      >
        <Marker
          coordinate={selectedCoords}
          title="Selected Location"
          description={liveLocation}
        />
      </MapView>
      <View style={styles.overlay}>
        {loadingAddress ? (
          <ActivityIndicator size="small" color="#029A35" />
        ) : (
          <TouchableOpacity style={styles.selectBtn} onPress={handleSelectLocation}>
            <Text style={styles.selectBtnText}>Select This Location</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  address: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  map: {
    flex: 1,
    borderRadius: 12,
  },
  info: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  selectBtn: {
    backgroundColor: "#029A35",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  selectBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
