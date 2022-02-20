import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableHighlight, Image } from 'react-native';
import { theme } from '../core/theme';
import type { Navigation } from '../types';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Lora_400Regular,
  Lora_500Medium,
  Lora_600SemiBold,
  Lora_700Bold,
  Lora_400Regular_Italic,
  Lora_500Medium_Italic,
  Lora_600SemiBold_Italic,
  Lora_700Bold_Italic,
} from '@expo-google-fonts/lora';


export default function HomeScreen({ navigation }: Navigation) {
    const [fontsLoaded] = useFonts({
        Lora_700Bold,
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableHighlight onPress={() => navigation.navigate('Login')} style={[styles.bigButton, styles.deepBlue]}>
                    <View>
                        <Text style={[styles.buttonName, styles.deepBlue]}>Translate</Text>
                        <Image
                            style={styles.buttonImage}
                            source={require('../assets/images/translate.png')}
                        />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => navigation.navigate('Login')} style={[styles.bigButton, styles.lightPink, {margin: 20}]}>
                    <View>
                        <Text style={[styles.buttonName, styles.lightPink]}>Calendar</Text>
                        <Image
                            style={styles.buttonImage}
                            source={require('../assets/images/calendar.png')}
                        />
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => navigation.navigate('Login')} style={[styles.bigButton, styles.deepBlue]}>
                    <View>
                        <Text style={[styles.buttonName, styles.deepBlue]}>Database</Text>
                        <Image
                            style={styles.buttonImage}
                            source={require('../assets/images/database.png')}
                        />
                    </View>
                </TouchableHighlight>
            </SafeAreaView>
        )
    };
}

const styles = StyleSheet.create({
    buttonImage: {
        position: 'absolute',
        top: 8,
        right: 0,
        width: 190,
        height: 190,
        alignSelf: 'flex-end'
    },
    container: {
        padding: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    buttonName: {
        fontFamily: 'Lora_700Bold',
        fontSize: 28,
    },
    bigButton: {
        flex: 1,
        width: '90%',
        height: 120,
        padding: 26,
        borderRadius: 16,
        shadowColor: "#999999",
        shadowOpacity: 0.5,
        shadowRadius: 8,
        shadowOffset: {
          height: 0,
          width: 0,
        },
    },
    deepBlue: {
        color: theme.colors.accent,
        backgroundColor: theme.colors.primary,
    },
    lightPink: {
        color: theme.colors.primary,
        backgroundColor: theme.colors.accent,
    }
})
