import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableHighlight, Image, ImageBackground } from 'react-native';
import { Text } from 'native-base'
import { theme } from '../core/theme';
import type { Navigation, UserData } from '../types';
import { useAuth } from '../contexts/Auth';

export default function HomeScreen({ navigation }: Navigation) {
    const [events, setEvents] = useState<{cid: number, cname: string, events: {time: string, content: string}[]}[]>();
    const [totalEventsCount, setTotalEventsCount] = useState<number>(4);
    const [nowSelectedChildId, setNowSelectedChildId] = useState<number>(1);
    const [user, setUser] = useState<UserData>();
    const auth = useAuth();

    useEffect(()=> {
        setUser(auth?.userData);

        // TODO: get events by send header(`auth.AuthData`) to server
        setEvents([{
            cid: 1,
            cname: "Soo",
            events: [{
                time: "10:00",
                content: "the 17th Graduate Seremony"
            }, {
                time: "13:00",
                content: "Do-Dream Festival"
            }]
        }, {
            cid: 2,
            cname: "Hee",
            events: [{
                time: "11:00",
                content: "the 18th Matriculation"
            }, {
                time: "13:00",
                content: "Do-Dream Festival"
            }]
        }])
        // TODO: fetch API
        // .then => set nowSelectedChild 
    }, [auth])

    const handleNowSelectedChildId = (cid: number) => {
        setNowSelectedChildId(cid);
    }
    
    return (
        <>{
            user && events && (
            <SafeAreaView style={styles.container}>
                <View style={styles.profile}>
                    <ImageBackground style={styles.backgroundImage} source={require("../assets/images/pink-background-cropped.png")} resizeMode="cover" imageStyle={{ borderRadius: 12 }}>
                        <Image style={styles.profileImage} source={require(`../assets/images/profile-images/profile-1.png`)} />
                        <View style={styles.profielTextWrapper}>
                            <Text fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize="xl">{"Hi, " + user.username + "!"}</Text>
                            <Text fontFamily="mono" fontWeight={400} fontStyle="normal" fontSize="sm">You've got {totalEventsCount} events today.</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.noticeWrapper}>
                    <Text style={styles.smallTitle} fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize="xl">Today's Events</Text>
                    <View style={styles.childButtonWrapper}>
                        {events?.map((notice, index) => 
                            <TouchableHighlight key={'n_'+index} style={[styles.childButton, {
                                backgroundColor: nowSelectedChildId === notice.cid ? theme.colors.primary : "#ffffff",
                            }]} onPress={() => handleNowSelectedChildId(notice.cid)}>
                                <Text fontWeight={500} style={[{
                                    color: nowSelectedChildId !== notice.cid ? theme.colors.primary : "#ffffff",
                                }]}>{notice.cname}</Text>
                            </TouchableHighlight>
                        )}
                    </View>
                    <View style={styles.todayNoticeWrapper}>
                        {events.filter(notice => notice.cid == nowSelectedChildId)[0].events.map((event, index) => 
                            <View key={'e_'+index} style={{flexDirection: "row"}}>
                                <Text fontWeight={500} fontSize="md" lineHeight={28} pr={4} style={{color: theme.colors.primary}}>{event.time}</Text>
                                <Text fontSize="md" lineHeight={28}>{event.content}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.functionButtonWrapper}>
                    <Text style={styles.smallTitle} fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize="xl">Functions</Text>
                    
                    <TouchableHighlight onPress={() => navigation.navigate('Translate')}>
                        <ImageBackground source={require("../assets/images/button-background.png")} style={[styles.bigButton]} imageStyle={{ borderRadius: 12 }}>
                            <View>
                                <Text style={[styles.buttonName, styles.deepBlue]} fontWeight={700} fontSize="xl" pb={2}>Translate</Text>
                                <Text style={styles.deepBlue} fontSize="sm">Translation, summarization, and calendar registration are all possible just by taking a picture of the notice.</Text>
                            </View>
                        </ImageBackground>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => navigation.navigate('Search')}>
                        <ImageBackground source={require("../assets/images/button-background.png")} style={[styles.bigButton]} imageStyle={{ borderRadius: 12 }}>
                            <View>
                                <Text style={[styles.buttonName, styles.deepBlue]} fontWeight={700} fontSize="xl" pb={2}>Search</Text>
                                <Text style={styles.deepBlue} fontSize="sm">You can find notices you have translated.</Text>
                            </View>
                        </ImageBackground>
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
        width: "88%",
        flex: 1,
        marginBottom: 18
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
        flex: 1.5,
        width: '88%',
        paddingBottom: 30,
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
    },
    lightPink: {
        color: theme.colors.primary,
    }
})
