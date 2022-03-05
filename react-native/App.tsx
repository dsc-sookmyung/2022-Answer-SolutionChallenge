import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import { nativeBaseTheme } from './core/theme';
import AppLoading from 'expo-app-loading';
import useFonts from './hooks/useFonts'

import LoginScreen from './screens/LoginScreen';
import JoinScreen from './screens/JoinScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import TranslateScreen from './screens/TranslateScreen';
import SearchScreen from './screens/SearchScreen';
import LogoutButton from './components/LogoutButton';
import SearchResultScreen from './screens/SearchResultScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, SetFontsLoaded] = React.useState<boolean>(false);
  const LoadFontsAndRestoreToken = async () => {
    await useFonts();
  };

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={LoadFontsAndRestoreToken}
        onFinish={() => SetFontsLoaded(true)}
        onError={() => {}}
      />
    );
  } 

  return (
    <NativeBaseProvider theme={nativeBaseTheme}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{headerShown: false}} 
          />
          <Stack.Screen
            name="Join"
            component={JoinScreen}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "NotiNote",
              headerBackVisible: false,
              headerRight: () => <LogoutButton/>
            }}
          />
          <Stack.Screen
            name="Translate"
            component={TranslateScreen}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
          />
          <Stack.Screen
            name="SearchResult"
            component={SearchResultScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
