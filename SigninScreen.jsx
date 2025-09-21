import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ImageBackground,
  Image, // ✅ import Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { Asset } from "expo-asset";

export default function SigninScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const bgImage = Asset.fromModule(require("./assets/splash.jpg")).uri;

  const handleSignin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <ImageBackground source={{ uri: bgImage }} style={styles.bg} resizeMode="cover">
      <LinearGradient colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)"]} style={styles.overlay}>
        <View style={styles.card}>
          {/* ✅ App Icon */}
          <Image source={require("./assets/icon.png")} style={styles.logo} />

          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Log in to continue your journey</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.signinButton} onPress={handleSignin}>
            <Text style={styles.signinText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupText}>
              No account? <Text style={styles.signupHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

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
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "center", // ✅ center the logo
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
    borderRadius: 20, // optional: rounded corners for icon
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 25,
    color: "rgba(255,255,255,0.85)",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    width: "100%",
  },
  signinButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  signinText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  signupLink: {
    marginTop: 18,
    alignItems: "center",
  },
  signupText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
  },
  signupHighlight: {
    color: "#FFD700",
    fontWeight: "bold",
  },
});
