import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { update_user } from "../apis/users";
import { Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProfile({ route }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [image, setImage] = useState(null);
  const { userData } = route.params;

  // Update state values with user data when the component mounts
  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setEmail(userData.email || "");
      setPhoneNumber(userData.phoneNumber || "");
      setAboutMe(userData.aboutMe || "");
      setImage(null);
    }
  }, [userData]);

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!email || !firstName || !lastName) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (!/^[a-zA-Z]{2,}@[^@\s]+\.[^@\s]+$/.test(email)) {
      Alert.alert("Error", "Invalid email format.");
      return;
    }
    try {
      const requestData = {
        user: {
          firstName,
          lastName,
          email,
          phoneNumber,
          aboutMe,
          image,
        },
        token: token, // Replace with your token variable
      };

      const response = await axios.post(update_user, requestData);
      Alert.alert("Your account has been updated.");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || "Unknown error";

        switch (error.response.status) {
          case 409:
            if (errorMessage.includes("Email is taken")) {
              Alert.alert("Error", "Email is already taken.");
            } else {
              Alert.alert("Error", "Update failed. Please try again later.");
            }
            break;
          default:
            Alert.alert("Error", "Update failed. Please try again later.");
            break;
        }
      } else {
        Alert.alert(
          "Error",
          "Network error. Please check your internet connection."
        );
      }

      if (!error.response) {
        console.error("Error updating profile:", error);
      }
    }
    // Implement your logic to update profile information on the server here
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="account-circle"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={setFirstName}
            value={firstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="account-circle"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={setLastName}
            value={lastName}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="phone"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="description"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput
            style={styles.multilineInput}
            placeholder="About Me"
            onChangeText={setAboutMe}
            value={aboutMe}
            multiline={true}
            numberOfLines={4}
          />
        </View>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={handleAddImage}>
          <MaterialIcons
            name="image"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.input}>
            {image ? "Image attached" : "Add Image"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 70,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  multilineInput: {
    flex: 1,
    padding: 10,
  },
  icon: {
    marginRight: 10,
    marginLeft: 10,
    color: "#5669FF",
  },
  input: {
    flex: 1,
    padding: 10,
  },
  saveButton: {
    backgroundColor: "#FFFFFF",
    marginTop: 15,
    padding: 10,
    borderWidth: 2,
    borderRadius: 18,
    width: "50%",
    alignItems: "center",
    borderColor: "#5669FF",
  },
  buttonText: {
    color: "#5669FF",
    fontSize: 18,
  },
});
