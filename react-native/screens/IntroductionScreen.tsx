import React, { useState, useEffect } from 'react';
import type { Navigation } from '../types';
import { StyleSheet, View, Image, SafeAreaView, TouchableHighlight, Alert } from 'react-native';
import { Text } from 'native-base'
import { theme } from '../core/theme';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_CLIENT_ID_WEB } from '@env';
import { useAuth } from '../contexts/Auth';
import env from 'react-native-dotenv';

WebBrowser.maybeCompleteAuthSession();


export default function HomeScreen({ navigation }: Navigation) {
    const [request, response, promptAsync] = Google.useAuthRequest({
		expoClientId: GOOGLE_CLIENT_ID_WEB,
		webClientId: GOOGLE_CLIENT_ID_WEB,
	})
	const auth = useAuth();

    useEffect(() => {
        const storeData = async () => {
            try {
                await AsyncStorage.setItem('isFirstRun', "false");
            } catch (error) {
                console.log("error occured while using AsyncStorage");
            }
        }
        storeData();
    });

    useEffect(() => {
		if (response?.type === 'success') {
			const { authentication } = response;

			if (authentication) {
				auth.signIn(authentication?.accessToken);
			}
			else {
				Alert.alert("Authentication failed. Please try again.");
			}
		}
		else {
			console.log('fail',response)
		}
	}, [response]);

    useEffect(() => {
		if (auth?.userData?.uroleType === 'GUEST') {
			navigation.navigate('Join');
		} else if (auth?.userData?.uroleType === 'USER') {
			navigation.navigate('Home');
		}
	}, [auth?.userData]);

    return (
        <SafeAreaView style={styles.container}>
            <Swiper>
                <View style={styles.container}>
                    <Image source={require('../assets/images/family.png')} style={styles.imageStyle}/>
                    <Text fontSize="md" style={styles.description}>
                        <Text>
                            Hello! I'm 
                        </Text>
                        <Text style={styles.highlight}> Notenote</Text>
                        <Text>
                            , I will help you and your children have a comfortable school life.
                            Let me introduce our skills to help you.
                        </Text>
                    </Text>
                    <Text style={[styles.highlight, styles.swipe]}>Swipe to continue ≫</Text>
                </View>
                <View style={styles.container}>
                    <Image source={require('../assets/images/image-upload.png')} style={styles.imageStyle}/>
                    <Text fontSize="md" style={styles.description}>
                        Just take a picture of school notices and upload it! We will translate it, and automatically find and register to your calendar important events (e.g. graduation or entrance ceremony, school holidays). 
                    </Text>
                    <Text style={[styles.highlight, styles.swipe]}>Swipe to continue ≫</Text>
                </View>
                <View style={styles.container}>
                    <Image source={require('../assets/images/calendar.png')} style={styles.imageStyle}/>
                    <Text fontSize="md" style={styles.description}>
                        Now you're ready! Let's start NotiNote with your Google account. NotiNote will register the events in your Google Calendar.
                    </Text>
                    <TouchableHighlight 
                        style={styles.startButton} 
                        onPress={() => {
                            promptAsync();
                        }}
                    >
                        <Text fontWeight={600} style={styles.buttonStyle}>
                            Sign In With Google
                        </Text>
                    </TouchableHighlight>
                </View>
            </Swiper>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        width: 320,
        height: 320
    },
    highlight: {
        color: theme.colors.primary,
    },
    swipe: {
        marginTop: 100
    },
    description: {
        width: "80%",
        height: 100
    },
    startButton: {
        width: "90%",
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 8,
        marginTop: 42
    },
    buttonStyle: {
        textAlign: "center",
        color: "white",
    }
})
