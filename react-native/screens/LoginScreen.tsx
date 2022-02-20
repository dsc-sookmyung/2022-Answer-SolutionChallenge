import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Alert, Image, Platform } from 'react-native';
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
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
			<View style={styles.topView}>
				<Image
					style={styles.loginImage}
					source={require('../assets/images/favicon.png')}
				/>
				<Text style={ styles.title }>Sign in</Text>
			</View>

			<View style={styles.bottomView}>
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
					autoFocus
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
		</KeyboardAvoidingView>
	)
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 20,
		margin: 20,
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
  