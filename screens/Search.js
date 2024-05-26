import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { search_event_api, events_images } from "../apis/events";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function SearchScreen({ route }) {
  const { searchQuery } = route.params;
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // Function to fetch event data from the backend
    let completedFetches = 0;
    const fetchEvent = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log(search_event_api + searchQuery);
        const response = await fetch(search_event_api + searchQuery, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventTitle: searchQuery,
            token: token,
          }),
        });
        if (response.status != 200) {
          throw new Error("Failed to fetch event data");
        }

        const searchData = await response.json();
        console.log(searchData); // Log the search data to console
        setEvent(searchData.event);
      } catch (error) {
        console.error(error);
        // Handle error, perhaps show an error message to the user
      } finally {
        completedFetches++; // Increment counter
        if (completedFetches === 1) {
          setLoading(false); // Set loading to false when all fetch operations are complete
        }
      }
    };

    fetchEvent(); // Call the fetchEvent function only once when the component mounts
  }, []);

  if (loading) {
    // Return a loading indicator while data is being fetched
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  const formattedDate = (item) => {
    // Assuming item.date is a valid date string
    return moment(item.date).format("MMMM Do, YYYY");
  };

  const navigateToEvent = (event) => {
    navigation.navigate("EventDetails", { eventId: event.id });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigateToEvent(event)}>
        <Image
          source={{ uri: `${events_images}/${event.image}` }} // Adjusted source URI
          style={styles.image}
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{formattedDate(event)}</Text>
        <Text style={styles.location}>Location: {event.location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    padding: 5,
    backgroundColor: "white",
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    alignSelf: "center",
    width: 330,
    height: 200,
    borderRadius: 8,
  },
  content: {
    alignItems: "flex-start",
  },
  title: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "500",
    marginTop: 10,
    color: "#120D26",
  },

  date: {
    fontSize: 15,
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    marginLeft: 10,
  },
  location: {
    width: "100%",
    marginLeft: 10,
    marginTop: 9,
  },
  saveButton: {
    backgroundColor: "#3D56F0",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 15,
  },
});

export default SearchScreen;
