import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "../screens/Profile";

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="login" component={LoginScreen} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}
