import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../../contexts/Auth";
import { useNavigation, StackActions } from '@react-navigation/native';
import { Menu, MenuItem } from "react-native-material-menu";

export default function HomeMenu() {
  const auth = useAuth();
  const navigation = useNavigation();
  const [isMenuVisible, setMenuVisibility] = React.useState(false);

  const showMenu = () => {
    setMenuVisibility(true);
  };
  const hideMenu = () => {
    setMenuVisibility(false);
  };

  const logout = () => {
    auth.signOut();
    navigation.dispatch(StackActions.popToTop())
  }

  return (
    <Menu
      visible={isMenuVisible}
      style={{ marginTop: 32 }}
      anchor={
        <TouchableOpacity onPress={showMenu}>
          <Image
            style={{ width: 32, height: 32 }}
            source={require(`../../assets/images/profile-images/profile-1.png`)}
          />
        </TouchableOpacity>
      }
      onRequestClose={hideMenu}
    >
      <MenuItem onPress={logout}>Logout</MenuItem>
    </Menu>
  );
}
