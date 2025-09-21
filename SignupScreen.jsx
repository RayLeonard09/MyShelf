import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // ✅ gradient overlay
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Asset } from "expo-asset";

export default function SignupScreen({ navigation }) {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const bgImage = Asset.fromModule(require("./assets/splash.jpg")).uri;

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

      // Save profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: fname,
        lastName: lname,
        email: email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Account Created", "You can now sign in.");
      navigation.replace("Signin");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <ImageBackground source={{ uri: bgImage }} style={styles.bg} resizeMode="cover">
      {/* Gradient overlay for contrast */}
      <LinearGradient
        colors={["rgba(0,0,0,0.65)", "rgba(0,0,0,0.25)"]}
        style={styles.overlay}
      >
        {/* Glass card */}
        <View style={styles.card}>
          <Text style={styles.title}>Create Account ✨</Text>
          <Text style={styles.subtitle}>
            Join us and start managing your inventory
          </Text>

          <TextInput
            placeholder="First name"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={fname}
            onChangeText={setFname}
            style={styles.input}
          />
          <TextInput
            placeholder="Last name"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={lname}
            onChangeText={setLname}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.7)"
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
      </LinearGradient>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.15)", // ✅ glassmorphism
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 22,
    color: "rgba(255,255,255,0.85)",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
  },
  signupButton: {
    backgroundColor: "#28a745", // ✅ green matches Signin blue accent
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  signinLink: {
    marginTop: 18,
    alignItems: "center",
  },
  signinText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
  },
  signinHighlight: {
    color: "#FFD700", // ✅ gold accent (same as Signin)
    fontWeight: "bold",
  },
});
