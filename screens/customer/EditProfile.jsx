import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebaseconfig'; 
import { updateProfile } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'; 
import { Platform } from 'react-native';

const EditProfile = ({ navigation }) => {
  const user = auth.currentUser;
  const db = getFirestore();

  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [localImage, setLocalImage] = useState(null);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setPhotoURL(user.photoURL || '');

      // Fetching the user's address and location from Firestore
      const fetchUserProfile = async () => {
        try {
          const userDocRef = doc(db, 'userprofile', user.uid);  // Change 'users' to 'userprofile'
          const docSnapshot = await getDoc(userDocRef);  // Fetch the document snapshot

          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setAddress(data.address || '');
            setLocation(data.location || '');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not supported on web', 'Profile image upload is available in the native app only.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permission is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setLocalImage(uri); 
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);

    try {
    
      await updateProfile(user, {
        displayName: name,
        photoURL: localImage || photoURL,  
      });

      
      await setDoc(doc(db, 'userprofile', user.uid), {
        name: name,
        email: user.email,  
        address,
        location,
      }, { merge: true });

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
        {localImage || photoURL ? (
          <Image
            source={{ uri: localImage || photoURL }}
            style={styles.avatar}
          />
        ) : (
          <Ionicons name="image" size={130} color="gray" />
        )}
        <Text style={styles.changePhotoText}>Change Profile Picture</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        value={address}
        onChangeText={setAddress}
      />

      

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop:70,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#029A35',
    marginBottom: 30,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  changePhotoText: {
    color: '#029A35',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#029A35',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
