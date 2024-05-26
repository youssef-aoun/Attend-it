import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Header from "./Header";
import TabNavigation from "../navigations/TabNavigation";

export default function HomeScreen() {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: "" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Header />
      <TabNavigation style={styles.container} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
