import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAbJ-fcaff5hBK5ABM1Qn_kvpUdT5CEe7Q",
  authDomain: "grasaryapp.firebaseapp.com",
  projectId: "grasaryapp",
  storageBucket: "grasaryapp.firebasestorage.app",
  messagingSenderId: "1045422773043",
  appId: "1:1045422773043:web:168c6cf1408f254d6c2446"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Authentication Functions
export const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
