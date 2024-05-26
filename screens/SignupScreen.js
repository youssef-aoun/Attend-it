import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState } from "react";
import axios from "axios";
import { signup_api } from "../apis/register-login";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SignupScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!username || !password || !email || !firstName || !lastName) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (/\s/.test(username)) {
      Alert.alert("Error", "Username must not contain spaces.");
      return;
    }

    // Validate email format (at least 2 letters, @, dot)
    if (!/^[a-zA-Z]{2,}@[^@\s]+\.[^@\s]+$/.test(email)) {
      Alert.alert("Error", "Invalid email format.");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      Alert.alert("Error", "Password must be 8 characters or longer.");
      return;
    }

    try {
      const response = await axios.post(signup_api, {
        firstName,
        lastName,
        email,
        password,
        username,
      });
      console.log(response.data); // Handle successful response
      Alert.alert("Signup Successful");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || "Unknown error";

        switch (error.response.status) {
          case 409:
            if (errorMessage.includes("Username is taken")) {
              Alert.alert("Error", "Username is already taken.");
            } else if (errorMessage.includes("Email is taken")) {
              Alert.alert("Error", "Email is already taken.");
            } else {
              Alert.alert("Error", "Signup failed. Please try again later.");
            }
            break;
          default:
            Alert.alert("Error", "Signup failed. Please try again later.");
            break;
        }
      } else {
        Alert.alert(
          "Error",
          "Network error. Please check your internet connection."
        );
      }

      if (!error.response) {
        console.error("Error signing up:", error);
      }
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
      <SafeAreaView style={{ paddingBottom: 100 }}>
        <View style={{ paddingHorizontal: 25 }}>
          {/* Logo of our mobile app */}
          <View
            style={{
              alignItems: "center",
              width: 300,
              height: 100,
              paddingTop: 120,
            }}>
            <Image
              source={require("../assets/full-logo.png")}
              style={{ width: 270, height: 60 }}
            />
          </View>
          <View style={{ marginTop: 110 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "500",
                color: "#333",
                marginBottom: 30,
              }}>
              Sign up
            </Text>

            {/* Text input of first name */}
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
                name="person"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
              <TextInput
                placeholder=" First name"
                style={{ flex: 1, paddingVertical: 0 }}
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>
            {/* Text input of last name */}
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
                name="person"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
              <TextInput
                placeholder=" Last name"
                style={{ flex: 1, paddingVertical: 0 }}
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              />
            </View>
            {/* Text input about Email */}
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
                placeholder=" Email"
                style={{ flex: 1, paddingVertical: 0 }}
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
            {/* Text input about Password */}
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
                placeholder=" Password"
                style={{ flex: 1, paddingVertical: 0 }}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            {/* Text input about Username */}
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
                name="face"
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
            <TouchableOpacity
              onPress={handleSignup}
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
                SIGN UP
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
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginScreen")}>
                <Text style={{ color: "#3D56F0" }}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default SignupScreen;
