import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseconfig';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Platform } from 'react-native';

function Profile({ navigation }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headerImage, setHeaderImage] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, 'userprofile', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            setUserProfile({});
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  const pickHeaderImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not supported on web', 'Header image upload is available in the native app only.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setHeaderImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.replace('Signin');
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#029A35" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickHeaderImage}>
        <ImageBackground
          source={headerImage ? { uri: headerImage } : require('../../assets/grobg.png')}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.profileImageWrapper}>
            <Image
              source={{ uri: user?.photoURL || 'https://i.pravatar.cc/150?img=1' }}
              style={styles.profileImage}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <View style={styles.nameSection}>
        <Text style={styles.userName}>{user?.displayName || 'Your Name'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editProfile}>
            <FontAwesome5 name="user-edit" size={15} color="grey" /> Edit Profile
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuItem}>
        <MaterialIcons name="notifications-none" size={24} color="#FF5A5F" />
        <Text style={styles.menuText}>Notifications</Text>
      </View>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('OrderStatus')}>
        <MaterialIcons name="local-shipping" size={24} color="#FF5A5F" />
        <Text style={styles.menuText}>My Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ForgotPassword')}>
      <MaterialIcons name="password" size={24} color="#FF5A5F" />
        <Text style={styles.menuText}>Forgot Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialIcons name="help-outline" size={24} color="#FF5A5F" />
        <Text style={styles.menuText}>FAQ</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackground: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  profileImageWrapper: {
    marginTop: 30,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  nameSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editProfile: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
  },
  logoutButton: {
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: '#FF5A5F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
