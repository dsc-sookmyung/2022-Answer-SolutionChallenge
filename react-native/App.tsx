import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './core/theme';
import LoginScreen from './screens/LoginScreen';
import JoinScreen from './screens/JoinScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import TranslateScreen from './screens/TranslateScreen';

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
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Translate"
            component={TranslateScreen}
          />
          </Stack.Navigator>
        </NavigationContainer>
    </PaperProvider>
  );
}
