import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { VStack, Text, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import type { Notices, UserData } from '../types';
import useFonts from '../hooks/useFonts'
import AppLoading from 'expo-app-loading';
import { theme } from '../core/theme';
import { useAuth } from '../contexts/Auth';
import i18n from 'i18n-js'
import '../locales/i18n';


export default function SearchedNotice(props: Notices) {
    const cProfileImgSource = [require(`../assets/images/cprofile-images/profile-1.png`), require(`../assets/images/cprofile-images/profile-2.png`), require(`../assets/images/cprofile-images/profile-3.png`),
	require(`../assets/images/cprofile-images/profile-4.png`), require(`../assets/images/cprofile-images/profile-5.png`), require(`../assets/images/cprofile-images/profile-6.png`), require(`../assets/images/cprofile-images/profile-7.png`), require(`../assets/images/cprofile-images/profile-8.png`), require(`../assets/images/cprofile-images/profile-9.png`)];
    const navigation = useNavigation<any>();
    const auth = useAuth();
    const [user, setUser] = useState<UserData>({
        uid: 1,
        username: "Soo",
        uemail: "kaithape@gmail.com",
        uprofileImg: 1,
        ulanguage: "english",
        uchildren:[{ cid: 1, cname:"Soo", cprofileImg: 1 }, { cid: 2, cname:"Hee", cprofileImg: 4 }]
    });
    const [fontsLoaded, SetFontsLoaded] = useState<boolean>(false);
    const LoadFontsAndRestoreToken = async () => {
        await useFonts();
    };

    useEffect(() => {
        if (auth?.userData) {
            setUser(auth?.userData);
        };
    }, [auth]);

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
        <View style={styles.container}>         
            <View style={styles.headerContainer}>
                <Text fontWeight={700} color="white">Saved on {props?.date.replaceAll("-", ". ")}</Text>
            </View>
            <VStack space={4}>
                {props?.saved?.map((child, index) =>
                    <TouchableOpacity 
                        key={'sc_'+index} 
                        onPress={() => navigation.navigate('SearchResult', {date: props?.date, cid: child?.cid})}
                        style={ styles.childNotice }
                    >
                        <View style={{ justifyContent: "space-between" }}>
                            <HStack style={styles.noticeHeader}>
                                <Text fontWeight={500}>{i18n.t('title')}</Text>
                                {user.uchildren &&
                                    <HStack style={ styles.cprofile }>
                                        <Text fontWeight={500}>{user.uchildren.filter(uchild => uchild.cid === child.cid)[0]?.cname}</Text>                    
                                        <Image style={styles.cprofileImageLg} source={cProfileImgSource[user.uchildren.filter(uchild => uchild.cid === child.cid)[0]?.cprofileImg-1]} />    
                                    </HStack>
                                }
                            </HStack>
                            {child?.titles?.map((title, tIndex) => 
                                <Text key={'sct_'+tIndex} style={styles.notices}>{(tIndex + 1) + ". " + title}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            </VStack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.primary,
        width: '100%',
        marginVertical: 8,
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
        flexDirection: "row",
        paddingBottom: 20,
    },
    date: {
        fontFamily: 'Lora_700Bold',
        marginBottom: 12,
    },
    notices: {
        lineHeight: 22,
        color: "#2A2A2A",
    },
    childNotice: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#acacac",
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: {
          height: 0,
          width: 0,
        }
    },
    cprofile: {
        alignItems: "center",
    },
    cprofileImageLg: {
        width: 32,
        height: 32,
        marginLeft: 8
    },
    noticeHeader: { 
        alignItems: "center", 
        justifyContent: "space-between", 
        paddingBottom: 6 
    }
})
