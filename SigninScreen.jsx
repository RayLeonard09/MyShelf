import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function SigninScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Inventory"); // ✅ Go to Inventory on success
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
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
