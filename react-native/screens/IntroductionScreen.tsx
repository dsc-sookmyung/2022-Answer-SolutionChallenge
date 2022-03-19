import React, { useState, useEffect } from 'react';
import type { Navigation } from '../types';
import { StyleSheet, View, Image, SafeAreaView, TouchableHighlight } from 'react-native';
import { Text } from 'native-base'
import { theme } from '../core/theme';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen({ navigation }: Navigation) {
    useEffect(() => {
        const storeData = async () => {
            try {
                await AsyncStorage.setItem('isFirstRun', "false");
            } catch (error) {
                console.log("error occured while using AsyncStorage");
            }
        }
        storeData();
    })
    

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
                    <TouchableHighlight style={styles.startButton} onPress={() => navigation.navigate('Home')}>
                        <Text fontWeight={600} style={styles.buttonStyle}>
                            Start NotiNote
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
