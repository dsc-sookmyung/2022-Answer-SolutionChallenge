import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Dimensions, Alert } from 'react-native';
import Swiper from 'react-native-swiper';
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
            cid: number
        },
        path: string | undefined,
    }
}


export default function SearchResultScreen(props: SearchResultScreenProps) {
    const auth = useAuth();
    const navigation = useNavigation();

	const [notices, setNotices] = useState<Notice>({date: "", results: []});
	const [showKorean, setShowKorean] = useState<boolean>(false);
	const [isFullDrawer, setFullDrawer] = useState<boolean>(false);

    useEffect(() => {
        // TODO: Fetch API   
        // mockup data
        setNotices({
            date: "2022-02-10",
            results: [{
                id: 1,
                imageUri: '',
                fullText: [
                    {id: 1, eid: 1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
                    {id: 2, eid: -1, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false}
                ],
                korean: "희망찬 새해를 맞이하여 학부모님의 가정에 건강과 행복이 함께 하시기를 기원합니다."
            }, {
                id: 2,
                imageUri: '',
                fullText: [
                    {id: 1, eid: -1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
                    {id: 2, eid: 2, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false}
                ],
                korean: "개학일은 3월 2일이며, 개학식에 참여하고자 하는 학부모님께서는 10시까지 강당으로 오시기 바랍니다.",
                trans_full: ""
            }]
        })

        if (auth?.authData?.access_token) {
            fetch(`http://localhost:8080/search/detail?date=${props.route.params.date}&cid=${props.route.params.cid}`, {
                method: 'GET',
                headers: {
                    'ACCESS-TOKEN': auth.authData.access_token
                },
                redirect: 'follow'
            })
            .then(response => response.json())
            .then(data => {
                if (data?.date && data?.results.length) {
                    setNotices(data);
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
            <Swiper>
                {notices?.results && notices.results.length > 0 && notices.results.map((notice, index) =>
					<ImageBackground style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.5 }} source={{ uri: notice?.imageUri }} key={"ib_" + index}>
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
				)}
            </Swiper>
        </View>   
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
