
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjcjERd9lqjq2EtW5WRBtuCUhZpskNz9o",
  authDomain: "myshelftappbackend.firebaseapp.com",
  projectId: "myshelftappbackend",
  storageBucket: "myshelftappbackend.firebasestorage.app",
  messagingSenderId: "1063853812408",
  appId: "1:1063853812408:web:f61445a669e024855a224d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);