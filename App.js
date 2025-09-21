import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import SigninScreen from "./SigninScreen";
import SignupScreen from "./SignupScreen";
import InventoryScreen from "./Inventory";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signin" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
