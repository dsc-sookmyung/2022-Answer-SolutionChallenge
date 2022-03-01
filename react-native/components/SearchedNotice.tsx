import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';
import type { Notice } from '../types';
import useFonts from '../hooks/useFonts'
import AppLoading from 'expo-app-loading';
import { AntDesign } from '@expo/vector-icons';
import { theme } from '../core/theme';


export default function SearchedNotice(props: Notice) {
    const [componentOpened, setComponentOpened] = useState<boolean>(false);
    const [fontsLoaded, SetFontsLoaded] = useState<boolean>(false);
    const LoadFontsAndRestoreToken = async () => {
        await useFonts();
    };

    const updateComponentOpened = () => {
        setComponentOpened(!componentOpened);
    }

    if (!fontsLoaded) {
        return (
          <AppLoading
            startAsync={LoadFontsAndRestoreToken}
            onFinish={() => SetFontsLoaded(true)}
            onError={() => {}}
          />
        );
    } 

    return (
        <View style={[styles.container, {
            height: componentOpened ? (80 + props.notices.length * 22): 60,
            paddingBottom: componentOpened ? 20: 0
        }]}>
            <View style={styles.headerContainer}>
                <Text style={[styles.date, {
                    color: componentOpened ? theme.colors.primary : "#2A2A2A",
                    textDecorationLine: componentOpened ? "underline": "none"
                }]}>{props.date}</Text>
                <TouchableHighlight onPress={updateComponentOpened}>
                    <AntDesign name={componentOpened ? "caretup" : "caretdown"} color={componentOpened ? theme.colors.primary : "#000"} size={14}/>
                </TouchableHighlight>
            </View>
             {componentOpened && (
                <TouchableHighlight>
                    <View>
                        {props.notices.map((notice, index) => 
                            <Text style={styles.notices}>{(index + 1) + ". " + notice}</Text>
                        )}
                    </View>
                </TouchableHighlight>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        width: '100%',
        marginVertical: 4,
        paddingVertical: 20,
        paddingHorizontal: 28,
        borderRadius: 16,
        shadowColor: "#acacac",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: {
          height: 0,
          width: 0,
        }
    },
    headerContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    date: {
        fontFamily: 'Lora_700Bold',
        marginBottom: 12,
    },
    notices: {
        lineHeight: 22,
        color: "#2A2A2A",
    }
})
