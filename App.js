<<<<<<< HEAD

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SigninScreen from "./SigninScreen";
import SignupScreen from "./SignupScreen";
import InventoryScreen from "./Inventory";
=======
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./HomeScreen";
import SigninScreen from "./SigninScreen";
import SignupScreen from "./SignupScreen";
>>>>>>> 2e291b8a7 (MyShelf 0.1)

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
<<<<<<< HEAD
      <Stack.Navigator initialRouteName="Signin">
        <Stack.Screen name="Signin" component={SigninScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Inventory" component={InventoryScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
=======
      <Stack.Navigator initialRouteName="Signin" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
>>>>>>> 2e291b8a7 (MyShelf 0.1)
