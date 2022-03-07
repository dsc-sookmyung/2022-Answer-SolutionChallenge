import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Alert, Image, Platform } from 'react-native';
import { FormControl, Input, Button, Stack, VStack, Text } from 'native-base';
import { emailValidator, passwordValidator } from '../core/utils';
import { theme } from '../core/theme';
import type { Navigation } from '../types';

  
export default function LoginScreen({ navigation }: Navigation) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const errorAlert = (error: string) =>
    Alert.alert(                    
      "Login Failed",                 
      error,                      
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );

  const onLoginPressed = () => {
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);

    if (emailError || passwordError) {
      errorAlert(emailError ? emailError : passwordError);
      return;
    }

    navigation.navigate('Home');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.topView}>
        <Image
          style={styles.loginImage}
          source={require('../assets/images/favicon.png')}
        />
				<Text fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize={36} pt={5}>Sign in</Text>
      </View>

      <View style={styles.bottomView}>
        <VStack space={4}>
          <FormControl>
            <Input 
              size="md"
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoFocus
              autoCapitalize="none"
              returnKeyType={"next"}
            />
          </FormControl>
          <FormControl>
            <Input 
              size="md"
              placeholder="Password"
              type="password" 
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </FormControl>
        </VStack>
        <Button 
          style={{ alignSelf: 'flex-end' }}
          // colorScheme="text"
          variant="ghost"
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          Forgot Password?
        </Button>
        <Button mt="8" onPress={onLoginPressed}>
          Login
        </Button>

        <Button 
          onPress={() => navigation.navigate('Join')}
          variant="ghost"
        >
          <Stack direction={{ base: 'row' }}>
            <Text style={{ color: theme.colors.text }}>Don't have an account? </Text>
            <Text style={{ fontWeight: '700', color: theme.colors.primary }}>Sign up</Text>
          </Stack>
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.colors.background,
    flex: 1,
    flexDirection: 'column',
  },
  topView: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  bottomView: {
    flex: 1,
    paddingBottom: 40
  },
  loginImage: {
    width: 50,
    height: 50,
  },
  title: {
    paddingTop: 30,
    fontWeight: '700',
    fontSize: 36,
    fontFamily: 'Lora_700Bold',
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
});
  