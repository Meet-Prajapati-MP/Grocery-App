import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';

const LocationScreen = ({ navigation }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBrowserLocation = () => {
      if (!navigator?.geolocation) {
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isMounted) {
            return;
          }

          const latitude = position.coords.latitude.toFixed(4);
          const longitude = position.coords.longitude.toFixed(4);
          setAddress(`Current location: ${latitude}, ${longitude}`);
          setLoading(false);
        },
        () => {
          if (isMounted) {
            setLoading(false);
          }
        }
      );
    };

    loadBrowserLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectLocation = () => {
    if (!address.trim()) {
      Alert.alert('Address required', 'Enter a delivery address to continue.');
      return;
    }

    navigation.navigate('Checkout', { selectedAddress: address.trim() });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Delivery Location</Text>
      <Text style={styles.subtitle}>
        Chrome does not use the native map picker, so enter a delivery address here.
      </Text>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#029A35" />
          <Text style={styles.info}>Fetching browser location...</Text>
        </View>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Enter delivery address"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <TouchableOpacity style={styles.selectBtn} onPress={handleSelectLocation}>
        <Text style={styles.selectBtnText}>Continue to Checkout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginTop: 8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  loadingBox: {
    alignItems: 'center',
    marginBottom: 12,
  },
  info: {
    marginTop: 8,
    color: '#666',
  },
  input: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  selectBtn: {
    marginTop: 16,
    backgroundColor: '#029A35',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});