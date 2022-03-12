import React, { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from '../contexts/Auth';

const LogoutButton = () => {
  const navigation = useNavigation();
  const auth = useAuth();
  const [showBox, setShowBox] = useState(true);

  const LogoutConfirm = () => {
    return Alert.alert(
      "Logout",
      "Are you sure you want to log out?", [
        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            auth.signOut();
            navigation.dispatch(StackActions.popToTop())
          },
        }, {
          text: "No",
        }
      ]
    );
  }

  return (
    <TouchableOpacity
      style={{ width: 24, height: 18 }}
      onPress={LogoutConfirm}>
      <AntDesign name="logout" color="#fff" size={18}/>
    </TouchableOpacity>
  );
};
export default LogoutButton;
