import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ResetPassword = () => {
  return (
    <SafeAreaView>
      <View style={{ paddingHorizontal: 20 }}>
        <Text>please enter your email address to request</Text>
        <Text> a password reset</Text>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 15,
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
        }}>
        <MaterialIcons
          name="drafts"
          size={20}
          color="#666"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Email"
          style={{ flex: 1, paddingVertical: 0, width: "100%" }}
          keyboardType="email-address"
        />
      </View>

      <View style={{ alignItems: "center", marginTop: 25 }}>
        <TouchableOpacity
          style={{
            padding: 15,
            borderRadius: 8,
            backgroundColor: "#3D56F0",
            width: "50%",
            alignSelf: "center",
          }}>
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 17,
              fontWeight: "700",
            }}>
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default ResetPassword;
