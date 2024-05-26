import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Card from "./Card";
import PreviousCard from "./PreviousCard";
import {
  upcoming_events_pageable_api,
  previous_events_pageable_api,
  upcoming_events_api,
  previous_events_api,
} from "../apis/events";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

const Explore = () => {
  const navigation = useNavigation();

  const handlePress = ({ the_api }) => {
    navigation.navigate("Events", { eventsListApi: the_api });
  };

  useEffect(() => {
    // Hide the header when the component mounts
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.rowContainer}>
            <Text style={styles.heading}>Upcoming Events</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePress({ the_api: upcoming_events_api })}>
              <Text style={styles.buttonText}>See all</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={10}
                color="black"
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>
          <Card eventsListApi={upcoming_events_pageable_api} />
          <View style={styles.rowContainer}>
            <Text style={styles.heading}>Previous Events</Text>
          </View>

          <PreviousCard eventsListApi={previous_events_pageable_api} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    color: "#120D26",
    textAlign: "center", // Adjust alignment as needed
    paddingBottom: 5,
  },
  container: {
    paddingVertical: 10,
    backgroundColor: "#ffffff", // Adjust background color as needed
    paddingVertical: 12,
  },
  button: {
    flexDirection: "row", // Arrange children horizontally
    alignItems: "center", // Align children vertically
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingTop: 3,
  },
  buttonText: {
    color: "#747688",
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
    paddingBottom: 3,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Adjust as needed
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  arrowIcon: {
    marginLeft: 0, // Adjust the margin as needed
    marginBottom: 2, // Adjust the margin bottom to move the arrow down
  },
});

export default Explore;
