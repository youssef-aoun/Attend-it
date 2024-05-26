import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import moment from "moment";
import { FlatList } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  events_images,
  save_event,
  unsave_event,
  reserve_event,
  upcoming_events_api,
} from "../apis/events";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Events = () => {
  const [upcoming_events_list, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const eventsListApi = upcoming_events_api;
  const navigation = useNavigation();

  useEffect(() => {
    // Hide the header when the component mounts
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(eventsListApi);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();

    // Retrieve saved events when the component mounts
    const retrieveSavedEvents = async () => {
      try {
        const savedEventIds = await AsyncStorage.getItem("savedEvents");
        if (savedEventIds !== null) {
          setSavedEvents(JSON.parse(savedEventIds));
        }
      } catch (error) {
        console.error("Error retrieving saved events:", error);
      }
    };

    const retrieveRegisteredEvents = async () => {
      try {
        const registeredEventIds = await AsyncStorage.getItem(
          "registeredEvents"
        );
        if (registeredEventIds !== null) {
          setRegisteredEvents(JSON.parse(registeredEventIds));
        }
      } catch (error) {
        console.error("Error retrieving registered events:", error);
      }
    };

    retrieveRegisteredEvents();
  }, [eventsListApi]);

  const formattedDate = (item) => {
    return moment(item.date).format("MMMM Do, YYYY");
  };

  const handleSaveEvent = async (eventId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(save_event, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: eventId,
          token: token,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save event");
      }

      // Update savedEvents state and AsyncStorage
      const updatedSavedEvents = [...savedEvents, eventId];
      setSavedEvents(updatedSavedEvents);
      await AsyncStorage.setItem(
        "savedEvents",
        JSON.stringify(updatedSavedEvents)
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Failed to save event. Please try again later.");
    }
  };

  const handleReserveEvent = async (eventId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(reserve_event, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: eventId,
          token: token,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to register event. Please try again later.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (error) {
          console.error("Error parsing error message:", error);
        }
        throw new Error(errorMessage);
      }

      const updatedRegisteredEvents = [...registeredEvents, eventId]; // You need to implement this function to fetch the updated list of registered events
      setRegisteredEvents(updatedRegisteredEvents);
      Alert.alert(
        "You have reserved a seat, please make sure to attend this event."
      );
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  const handleUnsaveEvent = async (eventId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(unsave_event, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: eventId,
          token: token,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove the save of event");
      }

      // Remove the event from savedEvents state and AsyncStorage
      const updatedSavedEvents = savedEvents.filter((id) => id !== eventId);
      setSavedEvents(updatedSavedEvents);
      await AsyncStorage.setItem(
        "savedEvents",
        JSON.stringify(updatedSavedEvents)
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Failed to remove the save of event. Please try again later."
      );
    }
  };

  const navigateToEvent = (item) => {
    navigation.navigate("EventDetails", { eventId: item.id });
  };

  const isEventSaved = (eventId) => {
    return savedEvents.includes(eventId);
  };

  return (
    <View style={styles.heading}>
      <FlatList
        data={upcoming_events_list}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        horizontal={false}
        renderItem={({ item, index }) => (
          <View style={styles.container}>
            <TouchableOpacity onPress={() => navigateToEvent(item)}>
              <Image
                source={{ uri: `${events_images}/${item.image}` }} // Adjusted source URI
                style={styles.image}
              />
            </TouchableOpacity>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>
                <MaterialIcons
                  name="date-range"
                  size={14}
                  color="black"
                  style={styles.icon}
                />{" "}
                {formattedDate(item)}
              </Text>
              <Text style={styles.location}>
                <MaterialIcons
                  name="location-on"
                  size={14}
                  color="black"
                  style={styles.icon}
                />{" "}
                {item.location}
              </Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() =>
                  isEventSaved(item.id)
                    ? handleUnsaveEvent(item.id)
                    : handleSaveEvent(item.id)
                }>
                <Text style={styles.saveButtonText}>
                  <MaterialIcons
                    name={
                      isEventSaved(item.id) ? "bookmark" : "bookmark-border"
                    }
                    size={14}></MaterialIcons>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => handleReserveEvent(item.id)}>
                <Text style={styles.saveButtonText}>Reserve a Seat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};
export default Events;

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    padding: 5,
    backgroundColor: "white",
    width: 350,
    borderRadius: 8,
    height: 340,
  },
  buttonsContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 340,
    height: 200,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
    marginLeft: 10,
    paddingTop: 50,
    color: "#5669FF",
  },

  date: {
    fontSize: 15,
    color: "#888",
    marginTop: 6,
  },
  location: {
    fontSize: 15,
    marginTop: 6,
    color: "black",
  },
  saveButton: {
    backgroundColor: "#FFFFFF",
    marginTop: 15,
    padding: 5,
    borderWidth: 1,
    borderRadius: 0,
    alignItems: "center",
    borderColor: "#5669FF",
  },
  registerButton: {
    backgroundColor: "#FFFFFF",
    marginTop: 15,
    padding: 5,
    borderWidth: 2,
    borderRadius: 8,
    width: "85%",
    marginLeft: 8,
    alignItems: "center",
    borderColor: "#5669FF",
  },
  saveButtonText: {
    color: "#5669FF",
    fontSize: 15,
  },
});
