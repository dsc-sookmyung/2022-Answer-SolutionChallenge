import React, { useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View, Alert, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { emailValidator, passwordValidator } from '../core/utils';
import { theme } from '../core/theme';
import type { Navigation } from '../types';
  
export default function LoginScreen({ navigation }: Navigation) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        <SafeAreaView style={styles.container}>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Image
                    style={styles.loginImage}
                    source={require('../assets/images/favicon.png')}
                />
                <Text style={ styles.title }>Sign in</Text>
            </View>

            <View style={{ paddingBottom: 40 }}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    returnKeyType="next"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    autoComplete="email"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    returnKeyType="done"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    autoComplete="password"
                    secureTextEntry
                />

                <Button 
                    style={{ alignSelf: 'flex-end', marginBottom: 20 }}
                    color={theme.colors.text}
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    Forgot Password?
                </Button>

                <Button 
                    style={styles.submit}
                    mode="contained"
                    onPress={onLoginPressed}
                >
                    Login
                </Button>

                <Button 
                    onPress={() => navigation.navigate('Join')}
                >
                    <Text style={{ color: theme.colors.text }}>Don't have an account? </Text>
                    <Text style={{ fontWeight: '700' }}>Sign up</Text>
                </Button>
            </View>

        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        margin: 20,
        backgroundColor: theme.colors.background,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    loginImage: {
        width: 50,
        height: 50,
    },
    title: {
        paddingTop: 40,
        fontWeight: '700',
        fontSize: 36,
    },
    input: {
        height: 40,
        borderWidth: 1,
        marginVertical: 10,
        borderRadius: 4,
        backgroundColor: '#fff'
    },
    submit: {
        height: 40,
        marginBottom: 10
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
});
  