import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

import SwipeUpDown from 'react-native-swipe-up-down';
import BottomDrawer from '../components/BottomDrawer';
import type { Navigation, Notice } from '../types';

const { width } = Dimensions.get('window');

interface SearchResultScreenProps {
    navigation: Navigation,
    route: {
        key: string,
        name: string,
        params: {
            date: string
        },
        path: string | undefined,
    }
}

export default function SearchResultScreen(props: SearchResultScreenProps) {
    const [imageUri, setImageUri] = useState("../assets/images/calendar.png");
	const [notice, setNotice] = useState<Notice>({cid: 2, date: "", notices: {total_results: [], notice_body: []}});
	const [showKorean, setShowKorean] = useState<boolean>(false);
	const [isFullDrawer, setFullDrawer] = useState<boolean>(false);

    useEffect(() => {
        // TODO: Fetch API
        setNotice({
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
        })
    }, [])

    const handleKorean = (): void => {
		setShowKorean(!showKorean);
	}

    return (
        <View style={styles.container}>
            <Swiper>
                {notice && notice.notices.notice_body.length > 0 && notice.notices.notice_body.map((notice, index) =>
					<ImageBackground style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.5 }} source={{ uri: imageUri }} key={"ib_" + index}>
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
