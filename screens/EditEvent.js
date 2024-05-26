import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { update_event_api, attendees_list_api } from "../apis/events";
import { useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";

export default function AddEventPage({ route }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [seats, setSeats] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { eventData } = route.params;
  const [loading, setLoading] = useState(true);
  const [attendeesList, setAttendeesList] = useState([]);

  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title || "");
      const eventTime = eventData.time; // "21:00:00"
      const [hours, minutes, seconds] = eventTime.split(":").map(Number);
      const time = new Date();
      time.setHours(hours);
      time.setMinutes(minutes);
      time.setSeconds(seconds);
      setDate(new Date(eventData.date));
      setLocation(eventData.location || "");
      setDescription(eventData.description || "");
      setSeats(eventData.numberOfSeats.toString() || "");
      setImage(null);
    }

    const fetchAttendees = async () => {
      const token = await AsyncStorage.getItem("token");
      let completedFetches = 0;
      const eventId = eventData.id;
      const api = attendees_list_api + "/" + eventId;
      try {
        const response = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAttendeesList(response.data);
      } catch (error) {
        console.error("Error fetching attendees details:", error);
      } finally {
        completedFetches++; // Increment counter
        if (completedFetches === 1) {
          setLoading(false); // Set loading to false when all fetch operations are complete
        }
      }
    };
    fetchAttendees();
  }, [eventData]);

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

  const handleUpdateEvent = async () => {
    const token = await AsyncStorage.getItem("token");
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
      const response = await axios.post(
        update_event_api + "/" + eventData.id,
        eventData,
        {
          headers,
        }
      );
      // Handle response
      console.log("Event updated:", response.data);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === "ios"); // Close picker on iOS
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

  // Get the current date
  const currentDate = new Date();

  // Calculate the minimum date (2 days from the current date)
  const minDate = new Date(currentDate);
  minDate.setDate(currentDate.getDate() + 2);

  // Convert minDate to midnight
  minDate.setHours(0, 0, 0, 0);

  if (loading) {
    // Return a loading indicator while data is being fetched
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="title"
              size={24}
              color="#5669FF"
              style={styles.icon}
            />
            <Text style={styles.input}>{title}</Text>
          </View>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}>
            <MaterialIcons
              name="date-range"
              size={24}
              color="#5669FF"
              style={styles.icon}
            />
            <Text style={styles.input}>{date.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDatePicker}>
            {/* Render your button here */}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
                minimumDate={minDate}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowTimePicker(true)}>
            <MaterialIcons
              name="access-time"
              size={24}
              color="#5669FF"
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
              color="#5669FF"
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
              color="#5669FF"
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
              color="#5669FF"
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
              color="#5669FF"
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
        </View>
        <View style={styles.attendeesListContainer}>
          <Text style={styles.attendeesListText}>Attendees</Text>
        </View>
        <FlatList
          data={attendeesList}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          backgroundColor="#5669FF"
          renderItem={({ item, index }) => (
            <View style={styles.attendeesContainer}>
              <View style={styles.attendeeInformation}>
                <View style={styles.attendeeData}>
                  <Text style={styles.nameText}>
                    <Text style={{ fontSize: 17 }}>
                      {item.firstName + " " + item.lastName}
                    </Text>
                    <Text style={{ color: "#C0C0C0", fontSize: 13 }}>
                      {" @" + item.username}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={styles.removeAttendeeContainer}>
                <TouchableOpacity>
                  <Text style={styles.removeAttendeeText}>Remove Attendee</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleUpdateEvent}>
          <Text style={styles.buttonText}>Update Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
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
    borderColor: "#ccc",
  },
  icon: {
    marginRight: 10,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  addButton: {
    alignSelf: "center",
    padding: 22,
    width: "80%",
    alignContent: "center",
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: "#5669FF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    textAlign: "center",
  },
  attendeesContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  nameText: {
    marginLeft: 15,
    fontSize: 20,
    fontWeight: "400",
    color: "white",
  },
  usernameText: {
    fontSize: 15,
    marginBottom: 20,
    color: "#A9A5A5",
  },
  attendeesListText: {
    textAlign: "left",
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
  },
  attendeesListContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 25,
  },
  removeAttendeeText: {
    color: "#FFFFFF", // Change this to your desired color
  },
  removeAttendeeContainer: {
    padding: 8,
    alignContent: "flex-end",
    backgroundColor: "#990000",
    borderRadius: 8,
  },
  attendeeData: {
    alignItems: "flex-start",
  },
});
