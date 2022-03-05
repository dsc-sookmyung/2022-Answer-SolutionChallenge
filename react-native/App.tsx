import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Button } from 'react-native';
import { theme } from './core/theme';

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
  return (
    <PaperProvider theme={theme}>
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
