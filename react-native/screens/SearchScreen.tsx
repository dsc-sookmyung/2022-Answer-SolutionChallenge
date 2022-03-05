import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import type { Navigation, Notice } from '../types';
import SearchedNotice from '../components/SearchedNotice';
import SearchBar from 'react-native-elements/dist/searchbar/SearchBar-ios';


export default function SearchScreen({ navigation }: Navigation) {
    const [search, setSearch] = useState<string>('');
    const [filteredNotices, setFilteredNotices] = useState<Notice[]>([{
        date: "2022-02-10",
        notices: {
            total_results: [
                "17th Graduation Ceremony",
                "School Day"
            ],
            notice_body: [{
                id: 1,
                title: "17th Graduation Ceremony",
                summary: [
                    {id: 1, content: "17th Graduation Ceremony is on February 14th", highlight: true},
                    {id: 2, content: "held  in classrooms to prevent the spread of COVID-19", highlight: false}
                ],
                fullText: "We wish you good health and happiness in your family",
                korean: "희망찬 새해를 맞이하여 학부모님의 가정에 건강과 행복이 함께 하시기를 기원합니다."
            }, {
                id: 2,
                title: "School Day",
                summary: [
                    {id: 1, content: "School day is March 2nd", highlight: true},
                    {id: 2, content: "Parents participate is available", highlight: false}
                ],
                fullText: "The school starts on March 2nd, and parents who want to participate in the opening ceremony are request to com to auditorium",
                korean: "개학일은 3월 2일이며, 개학식에 참여하고자 하는 학부모님께서는 10시까지 강당으로 오시기 바랍니다."
            }]
        }
    }, {
        date: "2022-02-10",
        notices: {
            total_results: [
                "17th Graduation Ceremony",
                "School Day"
            ],
            notice_body: [{
                id: 1,
                title: "17th Graduation Ceremony",
                summary: [
                    {id: 1, content: "17th Graduation Ceremony is on February 14th", highlight: true},
                    {id: 2, content: "held  in classrooms to prevent the spread of COVID-19", highlight: false}
                ],
                fullText: "We wish you good health and happiness in your family",
                korean: "희망찬 새해를 맞이하여 학부모님의 가정에 건강과 행복이 함께 하시기를 기원합니다."
            }, {
                id: 2,
                title: "School Day",
                summary: [
                    {id: 1, content: "School day is March 2nd", highlight: true},
                    {id: 2, content: "Parents participate is available", highlight: false}
                ],
                fullText: "The school starts on March 2nd, and parents who want to participate in the opening ceremony are request to com to auditorium",
                korean: "개학일은 3월 2일이며, 개학식에 참여하고자 하는 학부모님께서는 10시까지 강당으로 오시기 바랍니다."
            }]
        }
    }]);
    const [notices, setNotices] = useState<Notice[]>([{
        date: "2022-02-10",
        notices: {
            total_results: [
                "17th Graduation Ceremony",
                "School Day"
            ],
            notice_body: [{
                id: 1,
                title: "17th Graduation Ceremony",
                summary: [
                    {id: 1, content: "17th Graduation Ceremony is on February 14th", highlight: true},
                    {id: 2, content: "held  in classrooms to prevent the spread of COVID-19", highlight: false}
                ],
                fullText: "We wish you good health and happiness in your family",
                korean: "희망찬 새해를 맞이하여 학부모님의 가정에 건강과 행복이 함께 하시기를 기원합니다."
            }, {
                id: 2,
                title: "School Day",
                summary: [
                    {id: 1, content: "School day is March 2nd", highlight: true},
                    {id: 2, content: "Parents participate is available", highlight: false}
                ],
                fullText: "The school starts on March 2nd, and parents who want to participate in the opening ceremony are request to com to auditorium",
                korean: "개학일은 3월 2일이며, 개학식에 참여하고자 하는 학부모님께서는 10시까지 강당으로 오시기 바랍니다."
            }]
        }
    }, {
        date: "2022-02-10",
        notices: {
            total_results: [
                "17th Graduation Ceremony",
                "School Day"
            ],
            notice_body: [{
                id: 1,
                title: "17th Graduation Ceremony",
                summary: [
                    {id: 1, content: "17th Graduation Ceremony is on February 14th", highlight: true},
                    {id: 2, content: "held  in classrooms to prevent the spread of COVID-19", highlight: false}
                ],
                fullText: "We wish you good health and happiness in your family",
                korean: "희망찬 새해를 맞이하여 학부모님의 가정에 건강과 행복이 함께 하시기를 기원합니다."
            }, {
                id: 2,
                title: "School Day",
                summary: [
                    {id: 1, content: "School day is March 2nd", highlight: true},
                    {id: 2, content: "Parents participate is available", highlight: false}
                ],
                fullText: "The school starts on March 2nd, and parents who want to participate in the opening ceremony are request to com to auditorium",
                korean: "개학일은 3월 2일이며, 개학식에 참여하고자 하는 학부모님께서는 10시까지 강당으로 오시기 바랍니다."
            }]
        }
    }])

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
            <Text style={styles.smallDescription}>SEARCH BY TEXT</Text>
            <SearchBar
                platform='ios'
                onChangeText={(text: string | void) => searchFilter(text)}
                onClear={() => searchFilter('')}
                placeholder="Type Here..."
                value={search}
            />
            <Text style={styles.smallDescription}>RESULTS</Text>
            {filteredNotices.map(notice => 
                <SearchedNotice date={notice.date} summariedNotices={notice.notices.total_results}/>
            )}
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
        color: "#666666"
    }
})
