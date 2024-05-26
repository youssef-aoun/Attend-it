import React, { useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Notifications = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // const incrementNotificationCount = () =>{
  //     setNotificationCount(notificationCount + 1);
  // };

  const incrementNotificationCount = () => {
    setNotifications([...notifications, { title: "New Notification" }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.notificationContent}>
        <MaterialIcons name="notifications" color="#5669FF" size={30} />
        <Text style={styles.notificationText}>
          An event you're attending, Art Gallery, changed it's title to Art
          Exhibition.
        </Text>
      </View>
      <View style={styles.notificationContent}>
        <MaterialIcons name="notifications" color="#5669FF" size={30} />
        <Text style={styles.notificationText}>
          An event you're attending, Music Concert, changed it's date from May
          10, to May 31.
        </Text>
      </View>
      <View style={styles.notificationContent}>
        <MaterialIcons name="notifications" color="#5669FF" size={30} />
        <Text style={styles.notificationText}>
          Thank you for attending A.I Workshop!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingRight: 45,
    backgroundColor: "white",
  },
  notificationContent: {
    marginTop: 15,
    flexDirection: "row",
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  notificationIcon: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  counter: {
    fontWeight: "bold",
    fontSize: 24,
  },
  notificationText: {
    fontSize: 20,
  },
});
export default Notifications;
