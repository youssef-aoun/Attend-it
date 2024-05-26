import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  const handleSearchPress = () => {
    navigation.navigate("Search", { searchQuery: searchText });
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialIcons name="menu" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleSearchPress}>
            <MaterialIcons name="search" size={24} color="#5669FF" />
          </TouchableOpacity>
          <TextInput
            placeholder="| Search"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <MaterialIcons name="notifications" color="white" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#5669FF",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 0,
    width: 220,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
