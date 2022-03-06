import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableHighlight, Image, ImageBackground, GestureResponderEvent } from 'react-native';
import { Text } from 'native-base'
import { theme } from '../core/theme';
import type { Navigation, UserProfile, Notice } from '../types';
import AppLoading from 'expo-app-loading';
import useFonts from '../hooks/useFonts'


export default function HomeScreen({ navigation }: Navigation) {
    const [fontsLoaded, SetFontsLoaded] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserProfile>({userId: 0, username: "", gmail: "", profileImageType: 0, language: "", children: []});
    const [summariedNotices, setSummariedNotices] = useState<{childId: number, childName: string, summaried_notices: string[]}[]>();
    const [totalNoticesCount, setTotalNoticesCount] = useState<number>(0);
    const [nowSelectedChildId, setNowSelectedChildId] = useState<number>(1);

    useEffect(()=> {
        setUserProfile({
            userId: 1,
            username: "Suyeon",
            gmail: "kaithape@gmail.com",
            profileImageType: 1,
            language: "english",
            children: [{childName: "Soo", childId: 1}, {childName: "Hee", childId: 2}]
        })

        setSummariedNotices([{
            childId: 1,
            childName: "Soo",
            summaried_notices: [
                "the 17th Graduate Seremony",
                "Do-Dream Festival",
                "I'm about to have dinner",
            ]
        }, {
            childId: 2,
            childName: "Hee",
            summaried_notices: [
                "the 18th Matriculation",
                "Do-Dream Festival"
            ]
        }])
        // TODO: fetch API
        // .then => set nowSelectedChild 
    }, [])

    const handleNowSelectedChildId = (childId: number) => {
        setNowSelectedChildId(childId);
    }
    
    return (
        <>{
            userProfile && summariedNotices && (
            <SafeAreaView style={styles.container}>
                <View style={styles.profile}>
                    <ImageBackground style={styles.backgroundImage} source={require("../assets/images/pink-background-cropped.png")} resizeMode="cover" imageStyle={{ borderRadius: 12 }}>
                        <Image style={styles.profileImage} source={require(`../assets/images/profile-images/profile-1.png`)} />
                        <View style={styles.profielTextWrapper}>
                            <Text fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize="xl">{"Hi, " + userProfile.username + "!"}</Text>
                            <Text fontFamily="mono" fontWeight={400} fontStyle="normal" fontSize="sm">You've got 4 notices today.</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.noticeWrapper}>
                    <Text style={styles.smallTitle} fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize="xl">Today's Notices</Text>
                    <View style={styles.childButtonWrapper}>
                        {summariedNotices?.map(notice =>
                            <TouchableHighlight style={[styles.childButton, {
                                backgroundColor: nowSelectedChildId === notice.childId ? theme.colors.primary : "#ffffff",
                            }]} onPress={() => handleNowSelectedChildId(notice.childId)}>
                                <Text fontWeight={500} style={[{
                                    color: nowSelectedChildId !== notice.childId ? theme.colors.primary : "#ffffff",
                                }]}>{notice.childName}</Text>
                            </TouchableHighlight>
                        )}
                    </View>
                    <View style={styles.todayNoticeWrapper}>
                        {summariedNotices.filter(notice => notice.childId == nowSelectedChildId)[0].summaried_notices.map(notice =>
                            <Text fontSize="md" lineHeight={28}>{notice}</Text>
                        )}
                    </View>
                </View>
                <View style={styles.functionButtonWrapper}>
                    <Text style={styles.smallTitle} fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize="xl">Functions</Text>
                    <TouchableHighlight onPress={() => navigation.navigate('Translate')} style={[styles.bigButton, styles.deepBlue]}>
                        <View>
                            <Text style={[styles.buttonName, styles.deepBlue]} fontWeight={700} fontSize="xl" pb={2}>Translate</Text>
                            <Text style={styles.deepBlue} fontSize="xs">Translation, summarization, and calendar registration are all possible just by taking a picture of the notice.</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => navigation.navigate('Search')} style={[styles.bigButton, styles.deepBlue]}>
                        <View>
                            <Text style={[styles.buttonName, styles.deepBlue]} fontWeight={700} fontSize="xl" pb={2}>Search</Text>
                            <Text style={styles.deepBlue} fontSize="xs">You can find notices you have translated.</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </SafeAreaView> )}
        </>
    )
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
        backgroundColor: "#ffffff",
        padding: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    profile: {
        height: 92,
        width: "90%",
        margin: 22,
        backgroundColor: "#1134a1",
        borderRadius: 20,
    },
    backgroundImage: {
        width: "100%",
        height: "100%",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly"
    },
    noticeWrapper: {
        width: "90%",
        flex: 1,
        marginBottom: 22
    },
    childButtonWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    childButton: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        height: 30,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        marginRight: 8,
    },
    todayNoticeWrapper: {
        alignSelf: "flex-start",
        marginTop: 18,
        marginLeft: 12,
        overflow: "scroll",
        flex: 1,
    },
    profileImage: {
        width: 60,
        height: 60,
    },
    profielTextWrapper: {
        paddingRight: 30,
    },
    functionButtonWrapper: {
        flex: 1,
        width: '90%',
        paddingBottom: 100,
    },
    smallTitle: {
        marginBottom: 8,
    },
    buttonName: {
        fontSize: 24,
    },
    bigButton: {
        padding: 26,
        marginBottom: 18,
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
        color: theme.colors.secondary,
        backgroundColor: theme.colors.primary,
    },
    lightPink: {
        color: theme.colors.primary,
        backgroundColor: theme.colors.secondary,
    }
})
