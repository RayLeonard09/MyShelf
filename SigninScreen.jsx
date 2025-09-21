<<<<<<< HEAD
import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
=======
// Signin.jsx
import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { Asset } from "expo-asset"; // ✅ helps background work on web
>>>>>>> 2e291b8a7 (MyShelf 0.1)

export default function SigninScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

<<<<<<< HEAD
  const handleSignin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Inventory"); // ✅ Go to Inventory on success
=======
  const bgImage = Asset.fromModule(require("./assets/splash.jpg")).uri;

  const handleSignin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Home");
>>>>>>> 2e291b8a7 (MyShelf 0.1)
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
<<<<<<< HEAD
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      <Button title="Sign In" onPress={handleSignin} />
      <Button
        title="No account? Sign Up"
        onPress={() => navigation.navigate("Signup")}
      />
    </View>
  );
}
=======
    <ImageBackground source={{ uri: bgImage }} style={styles.bg} resizeMode="cover">
      {/* Overlay for readability */}
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.signinButton} onPress={handleSignin}>
            <Text style={styles.signinText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.signupText}>
              No account? <Text style={styles.signupHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // ✅ dark overlay for contrast
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)", // ✅ semi-transparent white card
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
    color: "#111", // darker for readability
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(221,221,221,0.7)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.9)", // ✅ semi-transparent input bg
    color: "#000",
  },
  signinButton: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  signinText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupLink: {
    marginTop: 15,
    alignItems: "center",
  },
  signupText: {
    color: "#222",
    fontSize: 15,
  },
  signupHighlight: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});
>>>>>>> 2e291b8a7 (MyShelf 0.1)
