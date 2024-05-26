import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import ResetPassword from "./screens/ResetPassword";
import Search from "./screens/Search";
import ProfileScreen from "./screens/Profile";
import EditProfile from "./screens/EditProfile";
import EventDetails from "./screens/EventDetails";
import EditEvent from "./screens/EditEvent";
import AttendedEvents from "./screens/AttendedEvents";
import SavedEvents from "./screens/SavedEvents";
import OrganizedEvents from "./screens/OrganizedEvents";
import Notifications from "./screens/Notifications";

const Stack = createStackNavigator();

const checkTokenValidity = async () => {
  try {
    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem("token");
    // Check if token exists and is not expired
    if (token) {
      // Token exists, redirect to HomeScreen
      return true;
    }
  } catch (error) {
    console.error("Error checking token validity:", error);
  }
  // Token missing or expired, redirect to LoginScreen
  return false;
};

const NavigationController = ({ navigation }) => {
  useEffect(() => {
    const redirectToScreen = async () => {
      const isValid = await checkTokenValidity();
      if (isValid) {
        navigation.navigate("HomeScreen");
      } else {
        navigation.navigate("LoginScreen");
      }
    };
    redirectToScreen();
  }, [navigation]);

  return null; // NavigationController doesn't render anything
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: true,
            headerTitle: "Login",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{
            headerShown: true,
            headerTitle: "Sign up",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            headerShown: true,
            headerTitle: "Reset Password",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: true,
            headerTitle: "Home",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="EventDetails"
          component={EventDetails}
          options={{
            headerShown: true,
            headerTitle: "Event Details",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="EditEvent"
          component={EditEvent}
          options={{
            headerShown: true,
            headerTitle: "Edit Event",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: true,
            headerTitle: "Search",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            headerShown: true,
            headerTitle: "Profile",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: true,
            headerTitle: "Edit Profile",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="AttendedEvents"
          component={AttendedEvents}
          options={{
            headerShown: true,
            headerTitle: "Attended Events",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="SavedEvents"
          component={SavedEvents}
          options={{
            headerShown: true,
            headerTitle: "Saved Events",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="OrganizedEvents"
          component={OrganizedEvents}
          options={{
            headerShown: true,
            headerTitle: "Organized Events",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            headerShown: true,
            headerTitle: "Notifications",
            headerTintColor: "black",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
