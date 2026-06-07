import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItemList, DrawerContentScrollView } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import Ionicons from '@expo/vector-icons/Ionicons';

import ForgotPassword from './screens/customer/ForgotPassword';
import LocationScreen from './screens/customer/LocationScreen';
import Signup from './screens/customer/Signup';
import Signin from './screens/customer/Signin';
import Signout from './screens/Signout';
import Main from './screens/Main';
import HomeScreen from './screens/customer/HomeScreen';
import Checkout from './screens/customer/Checkout';
import OrderStatus from './screens/customer/OrderStatus';
import Products from './screens/customer/Products';
import VeggiesScreen from './screens/customer/VeggiesScreen';
import Fruits from './screens/customer/Fruits';
import Cart from './screens/customer/Cart';
import Profile from './screens/customer/Profile';
import FavoritesScreen from './screens/customer/FavoritesScreen';
import ProductDetails from './screens/customer/ProductDetails';
import EditProfile from './screens/customer/EditProfile';
import AdminLogin from './screens/admin/AdminLogin';
import Home from './screens/admin/Home';
import AddProduct from './screens/admin/AddProduct';
import ViewProducts from './screens/admin/ViewProducts';
import ViewOrders from './screens/admin/ViewOrders';
import AddCategory from './screens/admin/AddCategory';
import ViewCategory from './screens/admin/ViewCategory';
import UpdateCategory from './screens/admin/UpdateCategory';
import UpdateProduct from './screens/admin/UpdateProduct';
import QRPaymentScreen from './screens/QRPaymentScreen';
import { auth } from './firebaseconfig';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
      <Stack.Screen name="AdminLogin" component={AdminLogin} options={{ headerShown: false }} />
      <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerShown: false }} />
      <Stack.Screen name="AddCategory" component={AddCategory} options={{ headerShown: false }} />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'My Profile',
          headerStyle: { backgroundColor: '#029A35' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          title: 'Edit Profile',
          headerStyle: { backgroundColor: '#029A35' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      <Stack.Screen 
      name="ProductDetails" 
      component={ProductDetails} 
      options={{
        title: 'Edit Profile',
        headerStyle: { backgroundColor: '#029A35' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }} />
      <Stack.Screen name="VeggiesScreen" component={VeggiesScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{
          title: "Checkout",
          headerShown: true,
          headerStyle: { backgroundColor: "#029A35" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen name="QRPaymentScreen" component={QRPaymentScreen} />
      <Stack.Screen name="LocationScreen" component={LocationScreen}
        options={{
          title: "Select Delivery Location",
          headerStyle: { backgroundColor: "#029A35" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen name="Fruits" component={Fruits} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      <Stack.Screen name="Admin" component={AdminDrawer} options={{ headerShown: false }} />
      <Stack.Screen name="Customer" component={CustomerDrawer} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AdminDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#029A35" },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        drawerActiveTintColor: "#029A35",
      }}
    >
      <Drawer.Screen name="Home" component={Home}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen name="Add Product" component={AddProduct}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen name="View Products" component={ViewProducts}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="pricetag-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen name="View Orders" component={ViewOrders}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="clipboard-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen name="View Category" component={ViewCategory}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="layers-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen name="Logout" component={Signout}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
}

function CustomerDrawer({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const currentUser = auth.currentUser;
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#029A35" />
      </View>
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
          <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
            <View style={styles.drawerHeader}>
              <Image
                source={{ uri: user?.photoURL || 'https://i.pravatar.cc/150?img=12' }}
                style={styles.drawerImage}
              />
              <Text style={styles.drawerName}>{user?.displayName || 'Guest User'}</Text>
              <Text style={styles.drawerSub}>{user?.email || 'No Email'}</Text>
            </View>
          </TouchableOpacity>
          {/* Divider */}
          <View style={styles.divider} />

          {/* Drawer Items */}
          <View style={styles.drawerList}>
            <DrawerItemList {...props} />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Logout */}
          <TouchableOpacity
            style={styles.drawerFooter}
            onPress={() => {
              auth.signOut();
              props.navigation.replace('Signin');
            }}
          >
            <View style={styles.logoutRow}>
              <Ionicons name="log-out-outline" size={22} color="#333" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </DrawerContentScrollView>

      )}
      screenOptions={{
        headerStyle: { backgroundColor: '#029A35' },
        headerTintColor: 'black',
        drawerActiveTintColor: '#029A35',
        drawerInactiveTintColor: 'black',
        drawerLabelStyle: { marginLeft: 10, fontSize: 15 },
        drawerStyle: {
          backgroundColor: 'white',
          width: 280,
        },
        headerShown: true,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color='black' /> }}
      />
      <Drawer.Screen name="Products" component={Products}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="leaf-outline" size={size} color={color} /> }}
      />

      <Drawer.Screen name="Favorite" component={FavoritesScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen name="Cart" component={Cart}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen name="Checkout" component={Checkout}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen name="OrderStatus" component={OrderStatus}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} /> }}
      />
    </Drawer.Navigator>
  );
}




export default function App() {
  return (
    <NavigationContainer>
      <Toast />
      <RootStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: '#029A35',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  drawerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
  },
  drawerName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
  drawerSub: {
    color: '#e0e0e0',
    fontSize: 13,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  drawerList: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  drawerFooter: {
    paddingVertical: 20,
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#333',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
});


