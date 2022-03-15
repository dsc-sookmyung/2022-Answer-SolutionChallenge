import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import { nativeBaseTheme } from './core/theme';
import AppLoading from 'expo-app-loading';
import useFonts from './hooks/useFonts';
import { theme } from './core/theme';

import { AuthProvider } from './contexts/Auth';

import LoginScreen from './screens/LoginScreen';
import JoinScreen from './screens/JoinScreen';
import HomeScreen from './screens/HomeScreen';
import TranslateScreen from './screens/TranslateScreen';
import SearchScreen from './screens/SearchScreen';
import LogoutButton from './components/LogoutButton';
import SearchResultScreen from './screens/SearchResultScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, SetFontsLoaded] = useState<boolean>(false);
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
    <AuthProvider>
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
              name="Home"
              component={HomeScreen}
              options={{
                headerStyle: { backgroundColor: theme.colors.primary },
                title: "NotiNote",
                headerBackVisible: false,
                headerRight: () => <LogoutButton/>,
                
                headerTitle: (props) => ( // App Logo
                  <Image
                    style={{ width: 90, height: 50 }}
                    source={require('./assets/images/notinote-icon-white.png')}
                    resizeMode='contain'
                  />
                ),
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
      </NativeBaseProvider>
    </AuthProvider>
  );
}
