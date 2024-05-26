import React from "react";
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
import { useState, useEffect } from "react";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { organized_events_api, events_images } from "../apis/events";
import { ActivityIndicator } from "react-native";

const OrganizedEvents = () => {
  const [event_list, setEventList] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let completedFetches = 0;
    const fetchEvents = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.post(
          organized_events_api,
          {
            token: token, // Pass token in the body
          },
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEventList(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        completedFetches++; // Increment counter
        if (completedFetches === 1) {
          setLoading(false); // Set loading to false when all fetch operations are complete
        }
      }
    };

    fetchEvents();
  }, [organized_events_api]);

  const formattedDate = (item) => {
    return moment(item.date).format("MMMM Do, YYYY");
  };

  const navigateToEvent = (item) => {
    navigation.navigate("EventDetails", { eventId: item.id });
  };

  if (loading) {
    // Return a loading indicator while data is being fetched
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.heading}>
      <FlatList
        data={event_list}
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
          </View>
        )}
      />
    </View>
  );
};
export default OrganizedEvents;

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    padding: 5,
    backgroundColor: "white",
    width: 350,
    borderRadius: 8,
    height: 300,
    marginBottom: 10,
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
