import React, { useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Image, Platform, TouchableOpacity } from 'react-native';
import { Button, Text } from 'native-base';
import { theme } from '../core/theme';
import type { Navigation } from '../types';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_CLIENT_ID_WEB } from '@env';

WebBrowser.maybeCompleteAuthSession();

  
export default function LoginScreen({ navigation }: Navigation) {
	const [request, response, promptAsync] = Google.useAuthRequest({
		expoClientId: GOOGLE_CLIENT_ID_WEB,
		webClientId: GOOGLE_CLIENT_ID_WEB,
		// responseType: 'id_token'
	})

	useEffect(() => {
		// WebBrowser.dismissAuthSession();
		if (response?.type === 'success') {
		const { authentication } = response;
		// console.log('success!')
		console.log(authentication);
		// console.log(response.params);
		// TODO: fetch API
		// TEST
		let status = 'join';
		switch(status) {
			case 'login':   // if account exists
			navigation.navigate('Home');
			case 'join':    // if no account
			navigation.navigate('Join');
		}
		}
		else {
			console.log('fail')
			console.log(response)
		}
	}, [response]);

	const onLoginPressed = () => {
		navigation.navigate('Home');
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
		<View style={styles.topView}>
			<Image
			style={styles.loginImage}
			source={require('../assets/images/favicon.png')}
			/>
			<Text fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize="4xl" pt={5}>Sign in</Text>
		</View>

		<View style={styles.bottomView}>
			{/* TEST: 바로 Home 화면 입장하기 위한 버튼 */}
			<Button
				size="lg"
				onPress={onLoginPressed}
			>
				Home
			</Button>

			<TouchableOpacity 
				activeOpacity={0.5} 
				style={{ alignItems: 'center' }}
				disabled={!request}
				onPress={() => {
					promptAsync();
				}}
			>
				{/* <Image
					style={{ transform: [{ scale: 0.75 }] }}
					source={require('../assets/images/btn_google_signin_dark_normal.png')}
				/> */}
				<Text mt={4}>Sign In With Google</Text>
			</TouchableOpacity>
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
		height: 50
	},
});
  