import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Dimensions, Alert } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';
import BottomDrawer from '../components/BottomDrawer';
import type { Navigation, Notice } from '../types';
import { useAuth } from '../contexts/Auth';
import { useNavigation, StackActions } from '@react-navigation/native';

interface SearchResultScreenProps {
    navigation: Navigation,
    route: {
        key: string,
        name: string,
        params: {
            date: string,
            nid: number
        },
        path: string | undefined,
    }
}


export default function SearchResultScreen(props: SearchResultScreenProps) {
    const auth = useAuth();
    const navigation = useNavigation();

	const [notice, setNotice] = useState<Notice>({
        imageUri: '',
        fullText: [
            {id: 1, eid: 1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
            {id: 2, eid: -1, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false}
        ],
        korean: "희망찬 새해를 맞이하여 학부모님의 가정에 건강과 행복이 함께 하시기를 기원합니다."
    });
	const [showKorean, setShowKorean] = useState<boolean>(false);
	const [isFullDrawer, setFullDrawer] = useState<boolean>(false);

    useEffect(() => {
        if (auth?.authData?.access_token) {
            fetch(`http://localhost:8080/search/detail?nid=${props.route.params.nid}`, {
                method: 'GET',
                headers: {
                    'ACCESS-TOKEN': auth.authData.access_token
                },
                redirect: 'follow'
            })
            .then(response => response.json())
            .then(data => {
                console.log('data', data);
                if (data?.fullText.length) {
                    setNotice(data);
                }
            })
            .catch(function (error) {
                console.log(error)
                if(error.response.status==401) {
                    //redirect to login
                    Alert.alert("The session has expired. Please log in again.");
                    auth.signOut();
                    navigation.dispatch(StackActions.popToTop())
                }
            });
        }
    }, [auth])

    const handleKorean = (): void => {
		setShowKorean(!showKorean);
	}

    return (
        <View style={styles.container}>
            <ImageBackground style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.5 }} source={{ uri: notice?.imageUri }}>
                <SwipeUpDown
                    itemMini={
                        <BottomDrawer 
                            results={notice}
                            showKorean={showKorean}
                            isFullDrawer={isFullDrawer}
                            isTranslateScreen={false}
                            handleKorean={handleKorean}
                        />
                    }
                    itemFull={
                        <BottomDrawer 
                            results={notice}
                            showKorean={showKorean}
                            isFullDrawer={isFullDrawer}
                            isTranslateScreen={false}
                            handleKorean={handleKorean}
                        />
                    }
                    onShowMini={() => setFullDrawer(false)}
                    onShowFull={() => setFullDrawer(true)}
                    animation="easeInEaseOut"
                    disableSwipeIcon
                    extraMarginTop={10}
                    swipeHeight={Dimensions.get('window').height*0.5}
                />
            </ImageBackground>
        </View>   
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
