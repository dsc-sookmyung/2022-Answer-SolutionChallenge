import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import type { Navigation, Notices } from '../types';
import SearchedNotice from '../components/SearchedNotice';
import SearchBar from 'react-native-elements/dist/searchbar/SearchBar-ios';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { useAuth } from '../contexts/Auth';
import { StackActions } from '@react-navigation/native';
import i18n from 'i18n-js'
import '../locales/i18n';


export default function SearchScreen({ navigation }: Navigation) {
    const auth = useAuth();

    const [search, setSearch] = useState<string>('');
    const [filteredNotices, setFilteredNotices] = useState<Notices[]>(
        [
            {
                date: "2022-02-19",
                saved_titles: [
                    "17th Graduation Ceremony",
                    "School Day"
                ]
            },
            {
                date: "2022-02-10",
                saved_titles: [
                    "17th Graduation Ceremony",
                    "School Day"
                ]
            }
        ]
    );
    const [notices, setNotices] = useState<Notices[]>(
        [
            {
                date: "2022-02-19",
                saved_titles: [
                    "17th Graduation Ceremony",
                    "School Day"
                ]
            },
            {
                date: "2022-02-10",
                saved_titles: [
                    "17th Graduation Ceremony",
                    "School Day"
                ]
            }
    ])
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [searchDate, setSearchDate] = useState<string>(i18n.t('searchByDateDefault'));

    useEffect(() => {
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
                setNotices(data);
                setFilteredNotices(data);
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
            setFilteredNotices(newData ? newData : [{date: '', saved_titles: []}]);
        } else {
            setFilteredNotices(notices);
        }
        hideDatePicker();
    };

    const searchFilter = (text: string | void) => {
        if (text) {
            const newData = notices?.filter((notice) => {
                const noticeData = notice.saved_titles?.join().toUpperCase();
                const textData = text.toUpperCase();
                return noticeData.indexOf(textData) > -1;
            })
            setFilteredNotices(newData ? newData : [{date: '', saved_titles: []}]);
        } else {
            setFilteredNotices(notices);
        }
        setSearch(text ? text : '');
    };
        
    return (
        <View style={styles.container}>
            <View style={styles.searchDateWrapper}>
                <Text style={styles.smallDescription}>{i18n.t('searchByDate')}</Text>
                <View style={styles.searchDateContainer}>
                    <TouchableOpacity onPress={showDatePicker}>
                        <Text style={styles.calendarIcon}>🗓</Text>
                    </TouchableOpacity>
                    <Text style={styles.selectedDate}>{searchDate}</Text>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>
            </View>
            <View >
                <Text style={styles.smallDescription}>{i18n.t('searchByText')}</Text>
                <SearchBar
                    platform='ios'
                    onChangeText={(text: string | void) => searchFilter(text)}
                    onClear={() => searchFilter('')}
                    placeholder="Type Here..."
                    value={search}
                />
            </View>
            {filteredNotices && filteredNotices.length > 0 &&
                <View style={styles.searchResults}>
                    <Text style={styles.smallDescription}>RESULTS</Text>
                    {filteredNotices?.map((notice, index) => 
                        <SearchedNotice key={"nt_" + index} date={notice?.date} saved_titles={notice?.saved_titles} />
                    )}
                </View>
            }
        </View> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        flexDirection: 'column',
        alignItems: 'center',
    },
    smallDescription: {
        alignSelf: "flex-start",
        fontSize: 12,
        marginBottom: 8,
        color: "#666666",
        width: "100%"
    },
    searchDateWrapper: {
        marginBottom: 20,
    },
    searchDateContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    searchResults: {
        width: '100%'
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
})
