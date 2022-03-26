import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox, Image, StatusBar, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import { nativeBaseTheme } from './core/theme';
import AppLoading from 'expo-app-loading';
import useFonts from './hooks/useFonts';
import { theme } from './core/theme';

import { AuthProvider } from './contexts/Auth';

import JoinScreen from './screens/JoinScreen';
import HomeScreen from './screens/HomeScreen';
import TranslateScreen from './screens/TranslateScreen';
import SearchScreen from './screens/SearchScreen';
import LogoutButton from './components/LogoutButton';
import SearchResultScreen from './screens/SearchResultScreen';
import IntrodcutionScreen from './screens/IntroductionScreen'

import i18n from 'i18n-js';
import '../locales/i18n';


LogBox.ignoreAllLogs();
console.warn = () => {};

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

  if (Platform.OS == 'ios') {
      StatusBar.setBarStyle('light-content', true);
  }

  return (
    <AuthProvider>
      <StatusBar backgroundColor={"#000"} />
      <NativeBaseProvider theme={nativeBaseTheme}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Introduction"
          >
            <Stack.Screen
              name="Join"
              component={JoinScreen}
              options={{
                title: i18n.t('join'),
                headerStyle: { backgroundColor: theme.colors.primary },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="Introduction" 
              component={IntrodcutionScreen} 
              options={{
                headerShown: false,
              }} 
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
              options={{
                title: i18n.t('translate'),
                headerStyle: { backgroundColor: theme.colors.primary },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{
                title: i18n.t('search'),
                headerStyle: { backgroundColor: theme.colors.primary },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="SearchResult"
              component={SearchResultScreen}
              options={{
                title: i18n.t('searchResult'),
                headerStyle: { backgroundColor: theme.colors.primary },
                headerTintColor: '#fff',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </AuthProvider>
  );
}
