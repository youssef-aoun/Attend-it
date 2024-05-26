import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { login_api } from "../apis/register-login";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./HomeScreen";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(login_api, {
        username,
        password,
      });
      // Check if the response contains a status property indicating success
      if (response.data.status === 200) {
        // Handle successful login
        console.log(response.data.message); // Log success message

        // Parse the response and extract the token
        const { token, refreshToken, expirationTime } = response.data;

        // Store the token and other relevant data securely
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        await AsyncStorage.setItem("expirationTime", expirationTime);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        navigation.navigate(HomeScreen);
      } else {
        // Handle unsuccessful login
        Alert.alert(response.data.error || "Unknown error");
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error);
      Alert.alert("Network error");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <View style={{ paddingHorizontal: 25, paddingBottom: 120 }}>
          {/* Logo of our mobile app */}
          <View
            style={{
              alignItems: "center",
              width: 300,
              height: 100,
              paddingTop: 50,
              marginBottom: 100,
            }}>
            <Image
              source={require("../assets/full-logo.png")}
              style={{ width: 270, height: 60 }}
            />
          </View>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "500",
              color: "#333",
              marginBottom: 30,
            }}>
            Sign in
          </Text>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 15,
              padding: 10,
              marginBottom: 25,
            }}>
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
            <TextInput
              placeholder=" Username"
              style={{ flex: 1, paddingVertical: 0 }}
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 25,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 15,
              padding: 10,
            }}>
            <Ionicons
              name="lock-closed"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
            <TextInput
              placeholder=" Your password"
              style={{ flex: 1, paddingVertical: 0 }}
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("ResetPassword")}>
              <Text style={{ color: "#3D56F0", fontWeight: "700" }}>
                Forget?
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: "#3D56F0",
              padding: 20,
              borderRadius: 10,
              marginBottom: 30,
            }}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "700",
                fontSize: 16,
                color: "#fff",
              }}>
              SIGN IN
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                textAlign: "center",
                color: "#666",
                marginBottom: 30,
                marginRight: 8,
              }}>
              {" "}
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignupScreen")}>
              <Text style={{ color: "#3D56F0" }}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default LoginScreen;
