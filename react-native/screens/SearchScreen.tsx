import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import type { Navigation, Notice } from '../types';
import SearchedNotice from '../components/SearchedNotice';
import SearchBar from 'react-native-elements/dist/searchbar/SearchBar-ios';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { Column } from 'native-base';
import { useAuth } from '../contexts/Auth';


export default function SearchScreen({ navigation }: Navigation) {
    const auth = useAuth(); // TODO: get notices by send header(`auth.AuthData`) to server

    const [search, setSearch] = useState<string>('');
    const [filteredNotices, setFilteredNotices] = useState<Notice[]>([{
        cid: 1, 
        date: "2022-02-19",
        notices: {
            total_results: [
                "17th Graduation Ceremony",
                "School Day"
            ],
            notice_body: [{
                id: 1,
                title: "17th Graduation Ceremony",
                fullText: [
                    {id: 1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
                    {id: 2, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false}
                ],
                korean: "희망찬 새해를 맞이하여 학부모님의 가정에 건강과 행복이 함께 하시기를 기원합니다."
            }, {
                id: 2,
                title: "School Day",
                fullText: [
                    {id: 1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
                    {id: 2, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false}
                ],
                korean: "개학일은 3월 2일이며, 개학식에 참여하고자 하는 학부모님께서는 10시까지 강당으로 오시기 바랍니다."
            }]
        }
    }, {
        cid: 1, 
        date: "2022-02-10",
        notices: {
            total_results: [
                "17th Graduation Ceremony",
                "School Day"
            ],
            notice_body: [{
                id: 1,
                title: "17th Graduation Ceremony",
                fullText: [
                    {id: 1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
                    {id: 2, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false}
                ],
                korean: "희망찬 새해를 맞이하여 학부모님의 가정에 건강과 행복이 함께 하시기를 기원합니다."
            }, {
                id: 2,
                title: "School Day",
                fullText: [
                    {id: 1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
                    {id: 2, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false}
                ],
                korean: "개학일은 3월 2일이며, 개학식에 참여하고자 하는 학부모님께서는 10시까지 강당으로 오시기 바랍니다."
            }]
        }
    }]);
    const [notices, setNotices] = useState<Notice[]>([{
        cid: 1, 
        date: "2022-02-19",
        notices: {
            total_results: [
                "17th Graduation Ceremony",
                "School Day"
            ],
            notice_body: [{
                id: 1,
                title: "17th Graduation Ceremony",
                fullText: [
                    {id: 1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
                    {id: 2, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false}
                ],
                korean: "희망찬 새해를 맞이하여 학부모님의 가정에 건강과 행복이 함께 하시기를 기원합니다."
            }, {
                id: 2,
                title: "School Day",
                fullText: [
                    {id: 1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
                    {id: 2, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false}
                ],
                korean: "개학일은 3월 2일이며, 개학식에 참여하고자 하는 학부모님께서는 10시까지 강당으로 오시기 바랍니다."
            }]
        }
    }, {
        cid: 1, 
        date: "2022-02-10",
        notices: {
            total_results: [
                "17th Graduation Ceremony",
                "School Day"
            ],
            notice_body: [{
                id: 1,
                title: "17th Graduation Ceremony",
                fullText: [
                    {id: 1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
                    {id: 2, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false}
                ],
                korean: "희망찬 새해를 맞이하여 학부모님의 가정에 건강과 행복이 함께 하시기를 기원합니다."
            }, {
                id: 2,
                title: "School Day",
                fullText: [
                    {id: 1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
                    {id: 2, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false}
                ],
                korean: "개학일은 3월 2일이며, 개학식에 참여하고자 하는 학부모님께서는 10시까지 강당으로 오시기 바랍니다."
            }]
        }
    }])
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [searchDate, setSearchDate] = useState<string>("Click calendar icon to select date.");

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
            const newData = notices.filter((notice) => {
                return notice.date === splitedDate;
            })
            setFilteredNotices(newData);
        } else {
            setFilteredNotices(notices);
        }
        hideDatePicker();
    };

    const searchFilter = (text: string | void) => {
        if (text) {
            const newData = notices.filter((notice) => {
                const noticeData = notice.notices.total_results.join().toUpperCase();
                const textData = text.toUpperCase();
                return noticeData.indexOf(textData) > -1;
            })
            setFilteredNotices(newData);
        } else {
            setFilteredNotices(notices);
        }
        setSearch(text ? text : '');
    };
        
    return (
        <View style={styles.container}>
            <View style={styles.searchDateWrapper}>
                <Text style={styles.smallDescription}>SEARCH BY DATE</Text>
                <View style={styles.searchDateContainer}>
                    <TouchableHighlight onPress={showDatePicker}>
                        <Text style={styles.calendarIcon}>🗓</Text>
                    </TouchableHighlight>
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
                <Text style={styles.smallDescription}>SEARCH BY TEXT</Text>
                <SearchBar
                    platform='ios'
                    onChangeText={(text: string | void) => searchFilter(text)}
                    onClear={() => searchFilter('')}
                    placeholder="Type Here..."
                    value={search}
                />
            </View>
            <View style={styles.searchResults}>
                <Text style={styles.smallDescription}>RESULTS</Text>
                {filteredNotices?.map((notice, index) => 
                    <SearchedNotice date={notice.date} summariedNotices={notice.notices.total_results} key={"nt_" + index}/>
                )}
            </View>
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
