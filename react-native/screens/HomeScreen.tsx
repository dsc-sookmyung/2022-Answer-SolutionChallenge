import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { Text } from 'native-base'
import { theme } from '../core/theme';
import type { Navigation, UserData } from '../types';
import { useAuth } from '../contexts/Auth';
import { StackActions } from '@react-navigation/native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import HomeMenu from '../components/HomeMenu';


export default function HomeScreen({ navigation }: Navigation) {
    const [events, setEvents] = useState<{event_num: number, children: { cid: number, cname: string, events: string[] }[]}>(
        {event_num: 4,
            children: [
                {
                    cid: 1,
                    cname: "Soo",
                    events: [
                        "the 17th Graduate Seremony",
                        "Do-Dream Festival"
                    ]
                }, {
                    cid: 2,
                    cname: "Hee",
                    events: []
                }
            ]
        }
    );
    const SHOW_ALL = -1;
    const [nowSelectedChildId, setNowSelectedChildId] = useState<number>(SHOW_ALL);
    const [user, setUser] = useState<UserData>();
    const auth = useAuth();
    

    useEffect(()=> {
        // setUser(auth?.userData);
        setUser({
            uid: 1,
            username: "Soo",
            uemail: "kaithape@gmail.com",
            uprofileImg: 1,
            ulanguage: "english",
            uchildren:[{cid: 1, cname:"Soo"}, {cid: 2, cname:"Hee"}]
        })

        navigation.setOptions({
            headerRight: () => (
                <HomeMenu/>
            )
        });

        if (auth?.authData?.jwt_token) {
            fetch('http://localhost:8080/user/children', {
                method: 'GET',
                headers: {
                    'JWT_TOKEN': auth.authData.jwt_token
                },
                redirect: 'follow'
            })
            .then(response => response.json())
            .then(data => {
                setEvents(data);
            }) // console.log(data)
            .catch((error) => {
                console.log(error)
                if (error?.response?.status==401) {
                    //redirect to login
                    Alert.alert("The session has expired. Please log in again.");
                    auth.signOut();
                    navigation.dispatch(StackActions.popToTop())
                }
            });
        }
    }, [auth]);

    useEffect(() => {
        if (events && events?.children?.length > 0) {
            setNowSelectedChildId(events.children[0].cid);
        }
    }, [events]);

    const handleNowSelectedChildId = (cid: number) => {
        setNowSelectedChildId(cid);
    }

    
    return (
        <>{
            user && events && events.children?.length > 0 && (
            <SafeAreaView style={styles.container}>
                <ImageBackground source={require("../assets/images/home-button-background.png")} style={[styles.functionButtonImageBackground]} imageStyle={{}}>
                    <View style={styles.functionButtonWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate('Translate')}>
                            <ImageBackground source={require("../assets/images/pink-background-cropped.png")} style={[styles.bigButton]} imageStyle={{ borderRadius: 12 }}>
                                <View style={[styles.bigButtonContentWrapper]}>
                                    <Text style={[styles.buttonName, styles.deepBlue]} fontWeight={700} fontSize="xl" pb={2}>Translate</Text>
                                    <MaterialIcons name="g-translate" size={32} color="#333"/>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                            <ImageBackground source={require("../assets/images/pink-background-cropped.png")} style={[styles.bigButton]} imageStyle={{ borderRadius: 12 }}>
                                <View style={[styles.bigButtonContentWrapper]}>
                                    <Text style={[styles.buttonName, styles.deepBlue]} fontWeight={700} fontSize="xl" pb={2}>Search</Text>
                                    <MaterialIcons name="search" size={32} color="#333"/>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <View style={styles.noticeWrapper}>
                    <Text style={styles.smallTitle} fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize="xl">Today's Events</Text>
                    <View style={styles.childButtonWrapper}>
                        <TouchableOpacity key={'n_all'} style={[styles.childButton, {
                            backgroundColor: nowSelectedChildId === SHOW_ALL ? theme.colors.primary : "#ffffff",
                        }]} onPress={() => handleNowSelectedChildId(-1)}>
                            <Text fontWeight={500} style={[{
                                color: nowSelectedChildId !== SHOW_ALL ? theme.colors.primary : "#ffffff",
                            }]}>All</Text>
                            </TouchableOpacity>
                        {events.children?.map((notice, index) => 
                            <TouchableOpacity key={'n_'+index} style={[styles.childButton, {
                                backgroundColor: nowSelectedChildId === notice.cid ? theme.colors.primary : "#ffffff",
                            }]} onPress={() => handleNowSelectedChildId(notice.cid)}>
                                <Text fontWeight={500} style={[{
                                    color: nowSelectedChildId !== notice.cid ? theme.colors.primary : "#ffffff",
                                }]}>{notice.cname}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.todayNoticeWrapper}>
                        {nowSelectedChildId === SHOW_ALL ? events.children.map((notice, index) =>
                            <View key={'n_'+index}>
                                {notice.events.map((event, index) => {
                                    return (
                                        <Text fontWeight={400} fontStyle="normal" fontSize="sm" marginBottom="1">{`[${notice.cname}] ` + event}</Text>
                                    )
                                })}
                            </View>
                        ) : events.children.filter(notice => notice.cid === nowSelectedChildId).map((notice, index) => {
                                return (
                                    <View key={'n_'+index}>
                                        {notice.events.map((event, index) => {
                                            return (
                                                <Text fontWeight={400} fontStyle="normal" fontSize="sm" marginBottom="1">{event}</Text>
                                            )
                                        })}
                                    </View>
                                )
                            }
                        )}
                    </View>
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
        marginBottom: 18,
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
        paddingTop: 18,
        paddingHorizontal: 12,
        overflow: "scroll",
        flex: 1,
        width: "100%"
    },
    profileImage: {
        width: 60,
        height: 60,
    },
    profielTextWrapper: {
        paddingRight: 30,
    },
    functionButtonImageBackground: {
        flex: 1.16,
        flexDirection: "row",
        alignItems: "center",
    },
    functionButtonWrapper: {
        flex: 1,
        paddingBottom: 30,
        marginHorizontal: 20,
        marginTop: -36
    },
    smallTitle: {
        marginBottom: 8,
    },
    buttonName: {
        fontSize: 24,
    },
    bigButton: {
        padding: 26,
        marginBottom: 22,
        borderRadius: 16,
        height: 86
    },
    bigButtonContentWrapper: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    deepBlue: {
        color: "#333333",
    },
    lightPink: {
        color: theme.colors.primary,
    },
    emptyBox: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
