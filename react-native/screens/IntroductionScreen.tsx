import React, { useState, useEffect } from 'react';
import type { Navigation } from '../types';
import { StyleSheet, View, Image, SafeAreaView, TouchableHighlight, Alert } from 'react-native';
import { Text } from 'native-base'
import { theme } from '../core/theme';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_CLIENT_ID_WEB } from '@env';
import { useAuth } from '../contexts/Auth';
import env from 'react-native-dotenv';

WebBrowser.maybeCompleteAuthSession();

// Set the key-value pairs for the different languages
i18n.translations = {
    en: {
        first_1: "Hi! I'm",
        first_2: ', I will help you and your children have a comfortable school life. Let me introduce our skills to help you.',
        second: 'Just take a picture of school notices and upload it! I will translate it, and automatically find and register to your calendar important events (e.g. graduation or entrance ceremony, school holidays). ',
        third: "Now you're ready! Let's start NotiNote with your Google account. NotiNote will register the events in your Google Calendar.",
        swipe: 'Swipe to continue ≫',
        start: 'Start NotiNote'
    },
    ko: {
        first_1: '반가워요! 저는',
        first_2: '에요. 당신과 아이들의 편안한 학교 생활을 위해서 제가 도와드릴게요! 학교 생활을 돕기 위한 우리의 기술을 소개합니다.',
        second: 'NotiNote로 번역하고 싶은 가정통신문이나 알림장의 사진을 찍어보세요. 그러면 자동으로 번역하고, 캘린더에 등록할 수 있는 이벤트들(졸업식, 입학식, 방학식 등)은 자동으로 등록해 드릴게요.',
        third: '이제 준비는 끝났습니다! 당신의 Google 계정으로 NotiNote를 시작해 보세요. 앞으로 당신의 Google Calendar에 이벤트를 등록해 드릴게요.',
        swipe: '계속하려면 넘겨주세요 ≫',
        start: 'NotiNote 시작하기'
    },
    ja: {
        first_1: 'こんにちは！',
        first_2: 'です。 私はあなたとあなたの子供たちが快適な学校生活を送るのを手伝います。 あなたを助けるために私たちのスキルを紹介しましょう。',
        second: '学校の通知の写真を撮ってアップロードするだけです！ 私はそれを翻訳し、あなたのカレンダーの重要なイベント（卒業式や入学式、学校の休みなど）を自動的に見つけて登録します。',
        third: 'これで準備が整いました。 GoogleアカウントでNotiNoteを始めましょう。 NotiNoteはイベントをGoogleカレンダーに登録します。',
        swipe: 'スワイプして続行します ≫',
        start: 'NotiNoteを起動します'
    },
    cn: {
        first_1: '你好！ 我是',
        first_2: '。 我会帮助你和你的孩子过上舒适的学校生活。 让我介绍一下我们的技能来帮助你。',
        second: '只需拍一张学校通知的照片并上传！ 我会翻译它，并自动查找并注册到您的日历中的重要事件（例如毕业或入学典礼、学校假期）。',
        third: '现在你准备好了！ 让我们使用您的 Google 帐户启动 NotiNote。 NotiNote 将在您的 Google 日历中注册事件。',
        swipe: '滑动以继续 ≫',
        start: '启动 NotiNote'
    },
    km: {
        first_1: 'សួស្តី! ខ្ញុំជា',
        first_2: '។ ខ្ញុំ​នឹង​ជួយ​អ្នក​និង​កូន​របស់​អ្នក​មាន​ជីវិត​សាលា​មាន​ផាសុកភាព។ ខ្ញុំសូមណែនាំជំនាញរបស់យើងដើម្បីជួយអ្នក។',
        second: 'គ្រាន់​តែ​ថត​រូប​ការ​ជូន​ដំណឹង​របស់​សាលា​ហើយ​បង្ហោះ​វា! ខ្ញុំនឹងបកប្រែវា ហើយស្វែងរកដោយស្វ័យប្រវត្តិ និងចុះឈ្មោះទៅកាន់ព្រឹត្តិការណ៍សំខាន់ៗក្នុងប្រតិទិនរបស់អ្នក (ឧ. ពិធីបញ្ចប់ការសិក្សា ឬពិធីចូលរៀន ថ្ងៃឈប់សម្រាកសាលា)។',
        third: 'ឥឡូវនេះអ្នករួចរាល់ហើយ! តោះចាប់ផ្តើម NotiNote ជាមួយគណនី Google របស់អ្នក។ NotiNote នឹងចុះឈ្មោះព្រឹត្តិការណ៍នៅក្នុង Google Calendar របស់អ្នក។',
        swipe: 'អូសដើម្បីបន្ត ≫',
        start: 'ចាប់ផ្តើម NotiNote'
    },
    ph: {
        first_1: 'Kamusta!',
        first_2: ' ako. Tutulungan kita at ang iyong mga anak na magkaroon ng komportableng buhay paaralan. Hayaan akong ipakilala ang aming mga kasanayan upang matulungan ka.',
        second: 'Kumuha lamang ng larawan ng mga abiso sa paaralan at i-upload ito! Isasalin ko ito, at awtomatikong hahanapin at irerehistro sa iyong kalendaryo ang mahahalagang kaganapan (hal. seremonya ng pagtatapos o pasukan, pista opisyal sa paaralan).',
        third: 'Ngayon ay handa ka na! Simulan natin ang NotiNote gamit ang iyong Google account. Irerehistro ng NotiNote ang mga kaganapan sa iyong Google Calendar.',
        swipe: 'Mag-swipe para magpatuloy ≫',
        start: 'Simulan ang NotiNote'
    },
    vn: {
        first_1: 'Xin chào! Tôi là',
        first_2: '. Tôi sẽ giúp bạn và con bạn có một cuộc sống thoải mái ở trường. Hãy để tôi giới thiệu các kỹ năng của chúng tôi để giúp bạn.',
        second: 'Chỉ cần chụp ảnh các thông báo của trường và tải lên! Tôi sẽ dịch nó, đồng thời tự động tìm và đăng ký các sự kiện quan trọng trên lịch của bạn (ví dụ: tốt nghiệp hoặc lễ nhập học, ngày nghỉ học).',
        third: 'Bây giờ bạn đã sẵn sàng! Hãy bắt đầu NotiNote với tài khoản Google của bạn. NotiNote sẽ đăng ký các sự kiện trong Lịch Google của bạn.',
        swipe: 'Vuốt để tiếp tục ≫',
        start: 'Bắt đầu NotiNote'
    },
    th: {
        first_1: 'สวัสดี! ฉันคือ',
        first_2: ' ฉันจะช่วยให้คุณและลูก ๆ ของคุณมีชีวิตในโรงเรียนที่สะดวกสบาย ให้ฉันแนะนำทักษะของเราที่จะช่วยคุณ',
        second: 'เพียงถ่ายรูปประกาศของโรงเรียนแล้วอัปโหลด! ฉันจะแปลให้ และค้นหาและลงทะเบียนกับกิจกรรมสำคัญในปฏิทินของคุณโดยอัตโนมัติ (เช่น พิธีรับปริญญาหรือพิธีเปิดเทอม วันหยุดโรงเรียน)',
        third: 'ตอนนี้คุณพร้อมแล้ว! เริ่มต้น NotiNote ด้วยบัญชี Google ของคุณ NotiNote จะลงทะเบียนกิจกรรมใน Google ปฏิทินของคุณ',
        swipe: 'ปัดเพื่อดำเนินการต่อ ≫',
        start: 'เริ่ม NotiNote'
    },
}
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale.split("-")[0];

export default function HomeScreen({ navigation }: Navigation) {
    const [request, response, promptAsync] = Google.useAuthRequest({
		expoClientId: GOOGLE_CLIENT_ID_WEB,
		webClientId: GOOGLE_CLIENT_ID_WEB,
	})
	const auth = useAuth();

    useEffect(() => {
        const storeData = async () => {
            try {
                await AsyncStorage.setItem('isFirstRun', "false");
            } catch (error) {
                console.log("error occured while using AsyncStorage");
            }
        }
        storeData();
    });

    useEffect(() => {
		if (response?.type === 'success') {
			const { authentication } = response;

			if (authentication) {
				auth.signIn(authentication?.accessToken);
			}
			else {
				Alert.alert("Authentication failed. Please try again.");
			}
		}
		else {
			console.log('fail',response)
		}
	}, [response]);

    useEffect(() => {
		if (auth?.authData?.uroleType === 'GUEST') {
			navigation.navigate('Join');
		} else if (auth?.authData?.uroleType === 'USER') {
			navigation.navigate('Home');
		}
	}, [auth?.authData]);

	const onLoginPressed = () => {
		navigation.navigate('Home');
	};

    return (
        <SafeAreaView style={styles.container}>
            <Swiper>
                <View style={styles.container}>
                    <Image source={require('../assets/images/family.png')} style={styles.imageStyle}/>
                    <Text fontSize="md" style={styles.description}>
                        <Text>
                            {i18n.t('first_1')}
                        </Text>
                        <Text style={styles.highlight}> Notenote</Text>
                        <Text>
                            {i18n.t('first_2')}
                        </Text>
                    </Text>
                    <Text style={[styles.highlight, styles.swipe]}>{i18n.t('swipe')}</Text>
                </View>
                <View style={styles.container}>
                    <Image source={require('../assets/images/image-upload.png')} style={styles.imageStyle}/>
                    <Text fontSize="md" style={styles.description}>
                        {i18n.t('second')}
                    </Text>
                    <Text style={[styles.highlight, styles.swipe]}>{i18n.t('swipe')}</Text>
                </View>
                <View style={styles.container}>
                    <Image source={require('../assets/images/calendar.png')} style={styles.imageStyle}/>
                    <Text fontSize="md" style={styles.description}>
                        {i18n.t('third')}
                    </Text>
                    <TouchableHighlight 
                        style={styles.startButton} 
                        onPress={() => {
                            promptAsync();
                        }}
                    >
                        <Text fontWeight={600} style={styles.buttonStyle}>
                            {i18n.t('start')}
                        </Text>
                    </TouchableHighlight>
                </View>
            </Swiper>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        width: 320,
        height: 320
    },
    highlight: {
        color: theme.colors.primary,
    },
    swipe: {
        marginTop: 100
    },
    description: {
        width: "80%",
        height: 100
    },
    startButton: {
        width: "90%",
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 8,
        marginTop: 42
    },
    buttonStyle: {
        textAlign: "center",
        color: "white",
    }
})
