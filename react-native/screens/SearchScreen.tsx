import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import type { Navigation, Notice } from '../types';
import SearchedNotice from '../components/SearchedNotice';


export default function SearchScreen({ navigation }: Navigation) {
    const [search, setSearch] = useState<string>();
    const [notices, setNotices] = useState([{
        date: "2022-02-28",
        notices: [
            "개학일은 3월 2일입니다.",
            "3월 2일에는 4교시 이후 하교합니다.",
            "우유 급식 신청은 3월 8일까지 받습니다."
        ],
        fullText: "학부모님 안녕하십니까? 학부모님 댁내에 건강과 행복이 가득하기를 기원합니다. 3월 2일에 진행될 입학식을 진행하기에 앞서 몇 가지 안내 말씀을 드리고자 합니다.",
        TranslatedFullText: "Hello, parents. I hope your home will be full of health and happiness. Before the entrance ceremony, which will be held on March 2, I would like to give you some guidance."
    }, {
        date: "2022-03-02",
        notices: [
            "개학일은 3월 2일입니다.",
            "3월 2일에는 4교시 이후 하교합니다."
        ],
        fullText: "학부모님 안녕하십니까? 학부모님 댁내에 건강과 행복이 가득하기를 기원합니다. 3월 2일에 진행될 입학식을 진행하기에 앞서 몇 가지 안내 말씀을 드리고자 합니다.",
        TranslatedFullText: "Hello, parents. I hope your home will be full of health and happiness. Before the entrance ceremony, which will be held on March 2, I would like to give you some guidance."
    }])

    

    return (
        <View style={styles.container}>
            {notices.map(notice => 
                <SearchedNotice
                    date={notice.date}
                    notices={notice.notices}
                    fullText={notice.fullText}
                    TranslatedFullText={notice.TranslatedFullText}
                />    
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
    }
})
