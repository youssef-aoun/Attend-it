import React from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  my_user_api,
  user_image,
  my_user_attended_events,
  my_user_created_events,
} from "../apis/users";
import { useState } from "react";
import { useEffect, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [attendedEvents, setAttendedEvents] = useState(null);
  const [createdEvents, setCreatedEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide the header when the component mounts
    navigation.setOptions({ headerShown: false });
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(my_user_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error(error);
      // Handle error, perhaps show an error message to the user
    }
  };

  const fetchCreatedEvents = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(my_user_created_events, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetchh created events");
      }
      const createdEvents = await response.json();
      setCreatedEvents(createdEvents);
      // Handle the number of created events as needed
    } catch (error) {
      console.error("Error fetching created events:", error);
      // Handle error, perhaps show an error message to the user
    }
  };

  const fetchAttendedEvents = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(my_user_attended_events, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch created events");
      }
      const attendedEvents = await response.json();
      setAttendedEvents(attendedEvents);
      // Handle the number of created events as needed
    } catch (error) {
      console.error("Error fetching created events:", error);
      // Handle error, perhaps show an error message to the user
    }
  };

  useEffect(() => {
    let completedFetches = 0;
    const fetchData = async () => {
      await fetchUserData();
      completedFetches++;
      await fetchCreatedEvents();
      completedFetches++;
      await fetchAttendedEvents();
      completedFetches++;
      if (completedFetches === 3) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAttendedEvents();
      fetchCreatedEvents();
    }, [])
  );

  if (loading) {
    // Return a loading indicator while data is being fetched
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
            <Image
              source={{ uri: `${user_image}/${userData.image}` }}
              style={styles.profileImage}
            />
          </TouchableOpacity>

          <Text style={styles.name}>
            {userData.firstName + " " + userData.lastName}
          </Text>
          <Text style={styles.userName}>{"@" + userData.username}</Text>

          <View style={styles.eventContainer}>
            <View style={styles.eventSeparatorContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("AttendedEvents")}>
                <Text style={styles.eventsNumber}>{attendedEvents}</Text>
                <Text style={styles.eventsAttendedText}>Reserved</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.eventSeparatorContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("OrganizedEvents")}>
                <Text style={styles.eventsNumber}>{createdEvents}</Text>
                <Text style={styles.eventsOrganizedText}>Organized</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editButtonDesign}
              onPress={() =>
                navigation.navigate("EditProfile", { userData: userData })
              }>
              <Text style={styles.buttonText}>
                <MaterialIcons name="edit" size={14} style={styles.icon} />
                Edit Profile
              </Text>
            </TouchableOpacity>

            <View style={styles.space} />

            <TouchableOpacity
              style={styles.eventButtonDesign}
              onPress={() => navigation.navigate("SavedEvents")}>
              <Text style={styles.buttonText}>
                <MaterialIcons name="event" size={14} style={styles.icon} />
                Saved Events
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.aboutUsContainer}>
            <View>
              <Text style={styles.aboutUsText}>About Me</Text>
            </View>
            <View style={styles.aboutUsBox}>
              <Text>{userData.aboutMe}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  userName: {
    fontSize: 15,
    marginBottom: 20,
    color: "#A9A5A5",
  },

  icon: {
    marginRight: 15, // Add margin to the right of the icon
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    height: 60,
  },
  editButtonDesign: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#5669FF",
    padding: 8,
    borderRadius: 5,
    flex: 1,
  },
  eventButtonDesign: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#5669FF",
    padding: 8,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    color: "#5669FF",
    marginTop: 8,
  },
  aboutUsContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    marginBottom: 20,
  },
  aboutUsText: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "bold",
    color: "#120D26",
  },
  aboutUsBox: {
    width: "100%",
    height: "100%",
    marginTop: 20,
  },
  space: {
    flex: 0.3,
  },
  eventsNumber: {
    fontSize: 15,

    fontWeight: "bold",
    textAlign: "center",
  },
  eventsAttendedText: {
    textAlign: "left",
    fontSize: 13,
    color: "#A9A5A5",
  },
  eventsOrganizedText: {
    textAlign: "right",
    fontSize: 13,
    color: "#A9A5A5",
  },
  separator: {
    width: 1,
    height: "80%",
    backgroundColor: "black",
    marginRight: 10,
    marginLeft: 10,
    color: "black",
  },
  eventContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
  },
  eventSeparatorContainer: {},
});

export default ProfileScreen;
