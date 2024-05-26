import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { add_event_api } from "../apis/events";

export default function AddEventPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [seats, setSeats] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios"); // Close picker on iOS
    setDate(currentDate);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === "ios"); // Close picker on iOS

    // Extract hours and minutes separately
    const hours = currentTime.getHours().toString().padStart(2, "0"); // Ensure two-digit format
    const minutes = currentTime.getMinutes().toString().padStart(2, "0"); // Ensure two-digit format

    // Concatenate hours and minutes in the desired format
    const formattedTime = `${hours}:${minutes}`;

    setTime(currentTime);
  };

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

  const checkTokenValidity = async () => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem("token");
      // Check if token exists and is not expired
      if (token) {
        return true;
      }
    } catch (error) {
      console.error("Error checking token validity:", error);
    }
    return false;
  };

  const handleCreateEvent = async () => {
    try {
      // Check if token is valid
      const isValidToken = await checkTokenValidity();
      if (!isValidToken) {
        console.error("Token is invalid or missing");
        return;
      }

      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem("token");
      // Construct event data
      const hours = time.getHours().toString().padStart(2, "0"); // Ensure two-digit format
      const minutes = time.getMinutes().toString().padStart(2, "0"); // Ensure two-digit format
      const formattedTime = `${hours}:${minutes}`;

      const eventData = {
        event: {
          title: title,
          date: date.toISOString().split("T")[0], // Convert date to ISO string format
          time: formattedTime, // Use the formatted time
          location: location,
          description: description,
          numberOfSeats: parseInt(seats),
        },
        token: token, // Use the retrieved organizerId
      };

      // Include token in Authorization header
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Make POST request with token included
      const response = await axios.post(add_event_api, eventData, { headers });
      // Handle response
      console.log("Event created:", response.data);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <SafeAreaView style={styles.scroll}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="title"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={setTitle}
              value={title}
            />
          </View>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}>
            <MaterialIcons
              name="date-range"
              size={24}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.input}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
              minimumDate={minDate} // Allow only future dates
            />
          )}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowTimePicker(true)}>
            <MaterialIcons
              name="access-time"
              size={24}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.input}>{time.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="location-on"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              onChangeText={setLocation}
              value={location}
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
              style={styles.input}
              placeholder="Description"
              onChangeText={setDescription}
              value={description}
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
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="event-seat"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Number of Seats"
              onChangeText={setSeats}
              value={seats}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateEvent}>
            <Text style={styles.buttonText}>Add Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#5669FF",
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
  addButton: {
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
  scroll: {
    paddingTop: 15,
  },
});
