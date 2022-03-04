import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { NativeBaseProvider } from 'native-base';
import { Button } from 'react-native';
import { theme, nativeBaseTheme } from './core/theme';

import LoginScreen from './screens/LoginScreen';
import JoinScreen from './screens/JoinScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import TranslateScreen from './screens/TranslateScreen';
import LogoutButton from './components/LogoutButton';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
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
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </PaperProvider>
  );
}
