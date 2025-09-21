<<<<<<< HEAD
import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
=======
// SignupScreen.jsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground, // ✅ added
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Asset } from "expo-asset"; // ✅ to load local image
>>>>>>> 2e291b8a7 (MyShelf 0.1)

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Account Created", "You can now sign in.");
      navigation.replace("Signin"); // ✅ Go back to Signin
=======
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const bgImage = Asset.fromModule(require("./assets/splash.jpg")).uri; // ✅ background image

  const handleSignup = async () => {
    if (!fname || !lname || !email || !password) {
      return Alert.alert("Missing Fields", "Please fill out all fields.");
    }
    if (password.length < 6) {
      return Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters long."
      );
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Save profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: fname,
        lastName: lname,
        email: email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Account Created", "You can now sign in.");
      navigation.replace("Signin");
>>>>>>> 2e291b8a7 (MyShelf 0.1)
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
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
      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Back to Sign In" onPress={() => navigation.goBack()} />
    </View>
  );
}
=======
    <ImageBackground
      source={{ uri: bgImage }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account ✨</Text>
          <Text style={styles.subtitle}>
            Join us and start managing inventory
          </Text>

          <TextInput
            placeholder="First name"
            value={fname}
            onChangeText={setFname}
            style={styles.input}
          />
          <TextInput
            placeholder="Last name"
            value={lname}
            onChangeText={setLname}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signinLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.signinText}>
              Already have an account?{" "}
              <Text style={styles.signinHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)", // semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.85)", // semi-transparent card
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  signupButton: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signinLink: {
    marginTop: 15,
    alignItems: "center",
  },
  signinText: {
    color: "gray",
    fontSize: 15,
  },
  signinHighlight: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});
>>>>>>> 2e291b8a7 (MyShelf 0.1)
