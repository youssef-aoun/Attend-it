import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { user_image } from "../apis/users";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import {
  event_details_api,
  events_images,
  unsave_event,
  save_event,
  cancel_reservation_url,
  reserve_event,
} from "../apis/events";

const EventDetails = ({ route }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [organizer, setOrganizer] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const { eventId } = route.params;
  const eventDetailsUrl = `${event_details_api}/${eventId}`;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEventDetails = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.post(
          eventDetailsUrl,
          {
            eventId: eventId,
            token: token,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEvent(response.data.event);
        setOrganizer(response.data.user);
        setIsOrganizer(response.data.organizer);
        setIsSaved(response.data.saved);
        setLoading(false);
        setIsReserved(response.data.attendee);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [route.params]);

  const isUserOrganizer = () => {
    return isOrganizer;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

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
      handleSaveToggle();
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
      handleReserveToggle();
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  const handleCancelReservation = async (eventId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(cancel_reservation_url, {
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
        let errorMessage =
          "Failed to cancel reservation. Please try again later.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (error) {
          console.error("Error parsing error message:", error);
        }
        throw new Error(errorMessage);
      }
      handleReserveToggle();
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
      handleSaveToggle();
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Failed to remove the save of event. Please try again later."
      );
    }
  };
  const handleSaveToggle = () => {
    setIsSaved((prevIsSaved) => !prevIsSaved); // Toggle the saved state
  };
  const handleReserveToggle = () => {
    setIsReserved((prevIsReserved) => !prevIsReserved); // Toggle the reserved state
  };

  const isEventSaved = () => {
    if (isSaved == true) return true;

    return isSaved;
  };

  const reserved = () => {
    if (isReserved == true) return true;
    return isReserved;
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", options)
      .replace(/(\d+)(\s)(\w+)(\s)(\d+)/, "$1$2$3,$4$5");
  };

  const formatTime = (timeString) => {
    const timeParts = timeString.split(":");
    let hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    const formattedTime = `${hours}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
    return formattedTime;
  };

  const formatTimeWithDayOfWeek = (dateString, timeString) => {
    const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const formattedTime = formatTime(timeString);
    return `${formattedDate}, ${formattedTime}`;
  };

  if (!event) {
    return (
      <View>
        <Text>Error: Event not found</Text>
      </View>
    );
  }

  const navigateToEditEvent = (eventData) => {
    navigation.navigate("EditEvent", { eventData: event });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image
          source={{ uri: `${events_images}/${event.image}` }}
          style={styles.eventImage}
        />
        <View style={styles.innerContainer}>
          <View style={styles.eventTitleRow}>
            {!isUserOrganizer() && (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    isEventSaved()
                      ? handleUnsaveEvent(event.id)
                      : handleSaveEvent(event.id)
                  }>
                  <Text style={styles.saveIcon}>
                    <MaterialIcons
                      name={isEventSaved() ? "bookmark" : "bookmark-border"}
                      size={27}></MaterialIcons>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={isUserOrganizer() ? styles.titleContainer : null}>
              <Text style={styles.eventName}> {event.title}</Text>
            </View>
          </View>
          <View style={styles.eventDateDetails}>
            <View style={styles.iconCalendarDetail}>
              <MaterialCommunityIcons
                name="calendar"
                size={30}
                resizeMode="contain"
                color="#5669FF"
                style={styles.icon}
              />
            </View>
            <View style={styles.eventDateTime}>
              <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
              <Text style={styles.eventTime}>
                {formatTimeWithDayOfWeek(event.date, event.time)}
              </Text>
            </View>
          </View>
          <View style={styles.eventLocationDetails}>
            <View style={styles.iconLocationDetail}>
              <MaterialIcons
                name="location-on"
                size={30}
                resizeMode="contain"
                color="#5669FF"
                style={styles.icon}
              />
            </View>
            <View style={styles.eventLocationText}>
              <Text style={styles.eventLocation}>{event.location}</Text>
            </View>
          </View>

          <View style={styles.eventOrganizerDetails}>
            <View style={styles.iconOrganizerDetail}>
              <Image
                source={{ uri: `${user_image}/${organizer.image}` }}
                style={styles.organizerImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.userView}>
              <Text style={styles.usernameText}>
                {organizer.firstName + " " + organizer.lastName}
              </Text>
              <Text style={styles.organizerText}>Organizer</Text>
            </View>
          </View>

          <Text style={styles.aboutText}>About Event</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
        </View>
      </ScrollView>
      {!isUserOrganizer() && (
        <View>
          <TouchableOpacity
            style={[
              styles.actionButton,
              reserved() ? styles.cancelButton : styles.reserveButton,
            ]}
            onPress={() => {
              reserved()
                ? handleCancelReservation(event.id)
                : handleReserveEvent(event.id);
            }}>
            <Text style={styles.actionButtonText}>
              {reserved() ? "Cancel Reservation" : "Reserve a Seat"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {isUserOrganizer() && (
        <View>
          <TouchableOpacity
            style={[styles.actionButton, styles.reserveButton]}
            onPress={() => navigateToEditEvent({ eventData: event })}>
            <Text style={styles.actionButtonText}>Edit Event</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingTop: 0,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 0,
    marginBottom: 20,
  },
  eventTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 60,
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  organizerImage: {
    width: 50,
    height: 35,
    borderRadius: 8,
  },
  saveIcon: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "500",
    marginTop: 14,
  },
  eventName: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "500",
    marginTop: 10,
    color: "#120D26",
  },

  titleContainer: {
    marginLeft: 40,
  },
  eventDateDetails: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
  },
  eventLocationDetails: {
    flexDirection: "row",
    marginTop: 1,
    width: "100%",
  },
  eventOrganizerDetails: {
    flexDirection: "row",
    marginTop: 10,
    marginRight: 10,
    width: "100%",
  },
  eventTime: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: 20,
    color: "#A9A5A5",
  },
  icon: {
    marginRight: 10,
  },
  eventDate: {
    fontSize: 16,
    fontWeight: "500",
  },
  eventLocation: {
    fontSize: 16,
    fontWeight: "500",
  },
  aboutText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  eventDescription: {
    marginTop: 12,
    alignItems: "center",
    fontSize: 15,
  },
  actionButton: {
    alignSelf: "center",
    padding: 22,
    width: "80%",
    alignContent: "center",
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 20,
  },
  cancelButton: {
    backgroundColor: "#990000", // Change this to your desired color
  },
  reserveButton: {
    backgroundColor: "#5669FF", // Change this to your desired color
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    textAlign: "center",
  },
  iconCalendarDetail: {
    width: "14%",
    height: "75%",
    paddingLeft: 10,
    paddingTop: 9,
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#5669FF",
    backgroundColor: "#E0E0E0",
  },
  iconLocationDetail: {
    width: "14%",
    height: "100%",
    paddingLeft: 10,
    paddingTop: 4,
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#5669FF",
    backgroundColor: "#E0E0E0",
  },
  iconOrganizerDetail: {
    width: "14%",
    height: "80%",
    paddingLeft: 2,
    paddingTop: 6,
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#5669FF",
  },
  eventDateTime: {
    width: "100%",
    marginLeft: 10,
    marginTop: 4,
  },
  userView: {
    width: "100%",
    marginLeft: 10,
    marginTop: 5,
  },
  eventLocationText: {
    width: "100%",
    marginLeft: 10,
    marginTop: 9,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: "500",
  },
  organizerText: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: 20,
    color: "#A9A5A5",
  },
});

export default EventDetails;
