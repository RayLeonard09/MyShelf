import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjcjERd9lqjq2EtW5WRBtuCUhZpskNz9o",
  authDomain: "myshelftappbackend.firebaseapp.com",
  projectId: "myshelftappbackend",
  storageBucket: "myshelftappbackend.appspot.com", // ✅ FIXED
  messagingSenderId: "1063853812408",
  appId: "1:1063853812408:web:f61445a669e024855a224d"
};

// ✅ Get existing app or create a new one
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Only initialize auth once
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // If it's already initialized, just get the existing instance
  auth = getAuth(app);
}

export const db = getFirestore(app);
export { auth };
