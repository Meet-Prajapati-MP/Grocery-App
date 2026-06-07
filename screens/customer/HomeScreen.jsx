import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  TextInput,
  Image,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import useCustomFont from '../../hooks/useCustomFont';
import { db, auth } from '../../firebaseconfig';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useCartStore } from '../../store/cart';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Product from '../../components/customer/Product';

const HomeScreen = ({ navigation }) => {
  const cart = useCartStore((store) => store.cart);
  useCustomFont();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [liveLocation, setLiveLocation] = useState('Your Location');
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const fetchUserDataAndLocation = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, 'userprofile', currentUser.uid);
        try {
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

      if (Platform.OS === 'web') {
        setLiveLocation('Select delivery address');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLiveLocation('Select delivery address');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync(location.coords);
        if (address.length > 0) {
          const { city, region } = address[0];
          setLiveLocation(`${city}, ${region}`);
          setCoords(location.coords);
        }
      } catch (error) {
        console.log('Error getting location:', error);
      }
    };

    fetchUserDataAndLocation();

    const colRef = collection(db, 'products');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(result);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLocationPress = () => {
    navigation.navigate('LocationScreen', { coords });
  };

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {userProfile?.name ? `Hello ${userProfile.name} 👋` : 'Hello 👋'}
          </Text>
          <TouchableOpacity onPress={handleLocationPress} style={styles.locationWrapper}>
            <Ionicons name="location-sharp" size={18} color="#029A35" />
            <Text style={styles.locationText}>{liveLocation}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => navigation.navigate('Favorite')}>
            <FontAwesome name="heart" size={22} color="#f50525" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{
                uri: user?.photoURL || 'https://i.pravatar.cc/100',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" />
        <TextInput
          placeholder="Search groceries, items..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerScroll}>
        {[require('../../assets/banner3.png'), require('../../assets/bnner.png')].map((img, idx) => (
          <Image key={idx} source={img} style={styles.banner} />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {[ 
          { name: 'Veggies', icon: '🥦', screen: 'VeggiesScreen' },
            { name: 'Fruits', icon: '🍎', screen: 'Fruits' },
            { name: 'Meat', icon: '🥩', screen: 'Products' },
            { name: 'Dairy', icon: '🥛', screen: 'Products' },
            { name: 'Grains', icon: '🌾', screen: 'Products' },
            { name: 'Drinks', icon: '🥤', screen: 'Products' },
        ].map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.categoryCard}
            onPress={() => item.screen && navigation.navigate(item.screen)}
          >
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Popular Picks</Text>
    </View>
  );

 

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#029A35" style={styles.loader} />
      ) : (
        <>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={styles.productWrapper}>
                <Product item={item} />
              </View>
            )}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.productList}
            showsVerticalScrollIndicator={false}
          />
         
        </>
      )}

      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
        <View style={styles.iconWrapper}>
          <FontAwesome6 name="cart-shopping" size={24} color="white" />
          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

     
      <View style={styles.copyrightContainer}>
        <Text style={styles.copyrightText}>301,Venom Technologies,Radhaswami Swamipia,</Text>
       <Text style={styles.copyrightText}> Above Poptos, Mota Bazaar, VV Nagar </Text>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    marginLeft: 5,
    color: '#029A35',
    fontSize: 14,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#029A35',
  },
  addressText: {
    color: 'grey',
  },
  footerPinned: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  copyrightContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  copyrightText: {
    fontSize: 12,
    color: 'gray',
  },
});
