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
import { events_images } from "../apis/events";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const PreviousCard = ({ eventsListApi }) => {
  const [upcoming_events_list, setEvents] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Replace 'events_pageable_api' with your actual backend API URL
        const response = await axios.get(eventsListApi);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [eventsListApi]);

  const formattedDate = (item) => {
    // Assuming item.date is a valid date string
    return moment(item.date).format("MMMM Do, YYYY");
  };

  return (
    <View style={styles.heading}>
      <FlatList
        data={upcoming_events_list}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item, index }) => (
          <View style={styles.container}>
            <Image
              source={{ uri: `${events_images}/${item.image}` }} // Adjusted source URI
              style={styles.image}
            />
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

export default PreviousCard;
