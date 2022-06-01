import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { Text, HStack, VStack } from 'native-base'
import { theme } from '../core/theme';
import type { Navigation, Notices, UserData } from '../types';
import SearchedNotice from '../components/SearchedNotice';
import SearchBar from 'react-native-elements/dist/searchbar/SearchBar-ios';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { useAuth } from '../contexts/Auth';
import { StackActions } from '@react-navigation/native';
import i18n from 'i18n-js'
import '../locales/i18n';


export default function SearchScreen({ navigation }: Navigation) {
    const cProfileImgSource = [require(`../assets/images/cprofile-images/profile-1.png`), require(`../assets/images/cprofile-images/profile-2.png`), require(`../assets/images/cprofile-images/profile-3.png`),
	require(`../assets/images/cprofile-images/profile-4.png`), require(`../assets/images/cprofile-images/profile-5.png`), require(`../assets/images/cprofile-images/profile-6.png`), require(`../assets/images/cprofile-images/profile-7.png`), require(`../assets/images/cprofile-images/profile-8.png`), require(`../assets/images/cprofile-images/profile-9.png`)];
    const auth = useAuth();
    const [user, setUser] = useState<UserData>({
        uid: 1,
        username: "Soo",
        uemail: "kaithape@gmail.com",
        uprofileImg: 1,
        ulanguage: "english",
        uchildren:[{ cid: 1, cname:"Soo", cprofileImg: 1 }, { cid: 2, cname:"Hee", cprofileImg: 4 }]
    });

    const [search, setSearch] = useState<string>('');
    const [filteredNotices, setFilteredNotices] = useState<Notices[]>(
        [
            {
                date: "2022-02-19",
                saved: [
                    {
                        cid: 1,
                        titles: [
                            "17th Graduation Ceremony",
                            "School Day",
                        ]
                    },
                    {
                        cid: 2,
                        titles: [
                            "Opening Ceremony",
                        ]
                    }
                ]
            },
            {
                date: "2022-02-15",
                saved: [
                    {
                        cid: 1,
                        titles: [
                            "17th Graduation Ceremony",
                            "School Day",
                        ]
                    }
                ]
            },
        ]
    );
    const [notices, setNotices] = useState<Notices[]>(
        [
            {
                date: "2022-02-19",
                saved: [
                    {
                        cid: 1,
                        titles: [
                            "17th Graduation Ceremony",
                            "School Day",
                        ]
                    },
                    {
                        cid: 2,
                        titles: [
                            "Opening Ceremony",
                        ]
                    }
                ]
            },
            {
                date: "2022-02-15",
                saved: [
                    {
                        cid: 1,
                        titles: [
                            "17th Graduation Ceremony",
                            "School Day",
                        ]
                    }
                ]
            },
    ])
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [searchDate, setSearchDate] = useState<string>(i18n.t('searchByDateDefault'));
    const SHOW_ALL = -1;
    const [nowSelectedChildId, setNowSelectedChildId] = useState<number>(SHOW_ALL);

    useEffect(() => {
        if (auth?.userData) {
            setUser(auth?.userData);
        }

        if (auth?.authData?.access_token) {
            fetch('http://localhost:8080/search', {
                method: 'GET',
                headers: {
                    'ACCESS-TOKEN': auth.authData.access_token
                },
                redirect: 'follow'
            })
            .then(response => response.json())
            .then(data => {
                if (data?.date && data?.saved?.length) {
                    setNotices(data);
                    setFilteredNotices(data);    
                }
            })
            .catch(function (error) {
                console.log(error)
                if(error.response.status==401) {
                    //redirect to login
                    Alert.alert(i18n.t('SessionExpired'));
                    auth.signOut();
                    navigation.dispatch(StackActions.popToTop())
                }
            });
        }
    }, [auth])

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        console.log("A date has been picked: ", date);
        const splitedDate = date.toISOString().split("T")[0];
        setSearchDate(splitedDate);
        if (date) {
            const newData = notices?.filter((notice) => {
                return notice.date === splitedDate;
            })
            setFilteredNotices(newData ? newData : [{date: '', saved: []}]);
        } else {
            setFilteredNotices(notices);
        }
        hideDatePicker();
    };

    const searchFilter = (text: string | void) => {
        if (text) {
            const newData = notices?.filter((notice) => {
                let flag = false;
                notice?.saved?.filter((item) => {
                    const noticeData = item.titles?.join().toUpperCase();
                    const textData = text.toUpperCase();
                    if (noticeData.indexOf(textData) > -1) {
                        flag = true;
                    }
                })
                if (flag) {
                    return notice;
                }
            })
            setFilteredNotices(newData ? newData : [{date: '', saved: []}]);
        } else {
            setFilteredNotices(notices);
        }
        setSearch(text ? text : '');
    };

    const handleNowSelectedChildId = (cid: number) => {
        setNowSelectedChildId(cid);
        if (auth?.authData?.access_token) {
            fetch(`http://localhost:8080/search/child?cid=${cid}`, {
                method: 'GET',
                headers: {
                    'ACCESS-TOKEN': auth.authData.access_token
                },
                redirect: 'follow'
            })
            .then(response => response.json())
            .then(data => {
                setFilteredNotices(data);
                // console.log(data);
            }) 
            .catch((error) => {
                console.log(error)
                if (error?.response?.status==401) {
                    //redirect to login
                    Alert.alert(i18n.t('sessionExpired'));
                    auth.signOut();
                    navigation.dispatch(StackActions.popToTop())
                }
            });
        }
    }
        
    return (
        <View style={styles.container}>
            <HStack style={styles.searchWrapper}>
                <SearchBar
                    platform='ios'
                    onChangeText={(text: string | void) => searchFilter(text)}
                    onClear={() => searchFilter('')}
                    placeholder="Search"
                    value={search}
                    inputStyle={{ borderBottomColor: "#dddddd", borderBottomWidth: 1 }}
                />
                <View>
                    <TouchableOpacity onPress={showDatePicker}>
                        <Text style={styles.calendarIcon}>🗓</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>
            </HStack>
            
            <View style={styles.childButtonWrapper}>
                <ScrollView horizontal={true}>
                    <TouchableOpacity key={'n_all'} style={[styles.childButton, {
                        backgroundColor: nowSelectedChildId === SHOW_ALL ? theme.colors.primary : "#ffffff",
                    }]} onPress={() => handleNowSelectedChildId(-1)}>
                        <Text fontWeight={500} color={nowSelectedChildId !== SHOW_ALL ? theme.colors.primary : "#ffffff"}>
                            All
                        </Text>
                    </TouchableOpacity>
                    {user.uchildren?.map((child, index) =>
                        <TouchableOpacity key={'n_'+index} style={[styles.childButton, {
                            backgroundColor: nowSelectedChildId === child.cid ? theme.colors.primary : "#ffffff",
                        }]} onPress={() => handleNowSelectedChildId(child.cid)}>
                            <Image style={styles.cprofileImage} source={cProfileImgSource[child.cprofileImg-1]} />
                            <Text fontWeight={500} style={[{
                                color: nowSelectedChildId !== child.cid ? theme.colors.primary : "#ffffff",
                            }]}>{child.cname}</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
            
            <Text style={styles.smallDescription}>{i18n.t('results_cap')}</Text>

            <ScrollView style={styles.searchResults}>
                {filteredNotices && filteredNotices.length > 0 && (
                    filteredNotices?.map((notice, index) => 
                        <SearchedNotice key={"nt_" + index} date={notice?.date} saved={notice?.saved} />
                    )
                )}
                {/* TODO: empty icon
                : (
                    <Text>There are no results yet. Translate and save the results.</Text>
                )} */}
            </ScrollView>
        </View> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    smallDescription: {
        alignSelf: "flex-start",
        fontSize: 15,
        marginBottom: 8,
        color: "#666666",
        width: "100%"
    },
    searchWrapper: {
        alignItems: 'center',
        paddingRight: 12
    },
    searchResults: {
        width: '100%',
    },
    calendarIcon: {
        fontSize: 24,
    },
    selectedDate: {
        fontSize: 14,
        color: "#666666",
        marginRight: 30,
        width: "72%"
    },
    childButtonWrapper: {
        flexDirection: "row",
        alignSelf: "flex-start",
        paddingBottom: 30
    },
    childButton: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        height: 40,
        borderRadius: 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        marginRight: 12,
    },
    cprofileImage: {
        width: 20,
        height: 20,
        marginRight: 12
    },
})
