import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ImageBackground, Dimensions, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../core/theme';
import type { Navigation, Result } from '../types';
import AppLoading from 'expo-app-loading';
import useFonts from '../hooks/useFonts'
import SwipeUpDown from 'react-native-swipe-up-down';
import BottomDrawer from '../components/BottomDrawer';
import { useToast, Box } from 'native-base';
import mime from "mime";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/Auth';
import { StackActions } from '@react-navigation/native';
import Loading from '../components/Loading';
import i18n from 'i18n-js';
import '../locales/i18n';


/* TODO:
    - 스크롤 내려가게 하기 (지금은 ScrollView의 스크롤이 안 먹음)
    - low highlight 주기 (지금은 텍스트 높이만큼 background에 색 줘서 highlight)
*/ 

const date = new Date();

export default function TranslateScreen({ navigation }: Navigation) {
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [fontsLoaded, SetFontsLoaded] = useState<boolean>(false);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera, setCamera] = useState<any>(null);
    const [imageUri, setImageUri] = useState<string>(''); 
    const [results, setResults] = useState<Result>({fullText: [], korean: ''});
    const [showKorean, setShowKorean] = useState<boolean>(false);
    const [isFullDrawer, setFullDrawer] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const toast = useToast();
    const auth = useAuth();

    const LoadFontsAndRestoreToken = async () => {
        await useFonts();
    };

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        if (imageUri) {
            extractText
        }
    }, [imageUri])

    useEffect(() => {
        if (results?.fullText && results.fullText.filter(item => item.highlight === true).length > 0) {
            const message = i18n.t('translateMessage_1')
            toast.show({    // Design according to mui toast guidelines (https://material.io/components/snackbars#anatomy)
                render: () => {
                    return <Box bg="rgba(0,0,0,0.8)" px="3" py="2" rounded="xl" mx={2} mb={12} shadow={2}>
                            {message}
                        </Box>;
                }
            });
        }
    }, [results])

    // DEV TEST 
    // if (hasPermission === null) {
    //  return <View />;
    // }
    // else if (hasPermission === false) {
    //  return <Text>No access to camera!</Text>
    // }

    if (!fontsLoaded) {
        return (
        <AppLoading
            startAsync={LoadFontsAndRestoreToken}
            onFinish={() => SetFontsLoaded(true)}
            onError={() => {}}
        />
        );
    }

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            setImageUri(data.uri);
        }
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        
        if (!result.cancelled) {
          setImageUri(result.uri);
        }
    };  

    const extractText = async(): Promise<any> => {
        if (imageUri) {
            let FormData = require('form-data');
            const formdata = new FormData();
            formdata.append("uploadfile", {
                uri : imageUri,
                type: mime.getType(imageUri),
                name: imageUri.split("/").pop()
            });

            setLoading(true);

            if (auth?.authData?.jwt_token) {
                await fetch("http://localhost:8080/notice/ocr", {
                    method: 'POST',
                    headers: {
                        'JWT_TOKEN': auth.authData.jwt_token
                    },
                    body: formdata,
                    redirect: 'follow'
                })
                .then(response => response.json())
                .then(data => { 
                    // setResults(data)
                    console.log(data)
                    setLoading(false)
                })
                .catch(function (error) {
                    console.log(error?.response?.status) // 401
                    console.log(error?.response?.data?.error) //Please Authenticate or whatever returned from server
                    if(error?.response?.status==401) {
                        //redirect to login
                        Alert.alert(i18n.t('sessionExpired'));
                        auth.signOut();
                        navigation.dispatch(StackActions.popToTop())
                    }
                });
            }
            // TEST: mockup data
            setResults({
                fullText: [
                    {id: 1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
                    {id: 2, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false},
                    {id: 3, content: ": 1st and 2nd graders, each classroom, 9:00-10:50 (no meals)\n2) ", date: "", highlight: false, registered: false},
                    {id: 4, content: "Diploma representation ceremony", date: "2022-01-04", highlight: true, registered: true},
                    {id: 5, content: ": 3rd grade, multi-purpose auditorium (2nd floor), 10:30-12:20\n2. School opening and entrance ceremony for new students: March 4th (Mon), 2019 at 9 o'clock for students to go to school.", date: "", highlight: false, registered: false},
                ],
                korean: "가정통신문\n예당중학교\n8053-8388\n꿈은 크게. 마음은 넘게·\n행동은 바르게\n학부모님께\n희망찬 새해를 맞이하며 학부모님 가정에 건강과 행운이 함께 하시기를 기원 드립니다.\n드릴 말씀은, 2018학년도 종업식 및 졸업장 수여식과 2019학년도 개학 및 신입생 입학식을 다음과 같이 안내드리오니, 이후 3월 개학 때까지 학생들이 자기주도 학습 능력을 배양하고 다양한 체험 활동을 통하여 심신이 건강해지며 각종 유해 환경에 노출되지 않고 안전하고 줄거운 시간이 되도록 지도해 주시기 바랍니다.\n\
1. 종업식 및 졸업장 수여식 일정 : 2019년 1월 4일(금), 학생 등교 9시\n\
1) 종업식 : 1· 2학년, 각 교실, 9:00-10:50 (급식 없음)\n\
2) 졸업장 수여식 : 3학년, 다목적 강당(2층), 10:30~12:20\n\
2. 개학 및 신입생 입학식 : 2019년 3월 4일(월), 학생 등교 9시\n\
1) 3월 4일 일정 : 월요일 정상수업 (급식 실시)\n\
(준비물: 교과서, 노트, 필기도구. 학생용 실내화(흰색) 등)\n\
2) 신입생 입학식 : 다목적 강당(2층) 10시 30분, 신입생 등교 9시(신반 교실로 입장)\n" 
            })
        }
    }
    
    const handleKorean = (): void => {
        setShowKorean(!showKorean);
    }

    const saveResults = (title: string): void => {
        // TODO: api
        // TODO: fetch api
        // data 보내고, success 라면, 서버에 저장된 제목 받아와서 보여주기!
        if (!title) {
            Alert.alert(i18n.t('translateMessage_2'));
            return;
        }
        
        if (imageUri) {
            let FormData = require('form-data');
            const formdata = new FormData();
            formdata.append('uploadfile', {
                uri : imageUri,
                type: mime.getType(imageUri),
                name: imageUri.split("/").pop()
            });
            let data = {
                'title': title,
                'date': date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
                'fullText': results?.fullText,
                'korean': results?.korean
            }
            formdata.append('noticeRequestDTO',  new Blob([JSON.stringify(data)], {type: 'application/json'}));

            if (auth?.authData?.jwt_token) {
                fetch('http://localhost:8080/notice/save', {
                    method: 'POST',
                    headers: {
                        'JWT_TOKEN': auth.authData.jwt_token
                    },
                    body: formdata,
                    redirect: 'follow'
                })
                .then(response => response.json())
                .then(data => Alert.alert(`${i18n.t('saveAlarm')}: [${data?.title}]`))
                .catch(function (error) {
                    console.log(error)
                    if(error.response.status==401) {
                        //redirect to login
                        Alert.alert(i18n.t('sessionExpired'));
                        auth.signOut();
                        navigation.dispatch(StackActions.popToTop())
                    }
                });
            }
        }
    }

    const closeResults = (): void => {
        navigation.navigate('Home');
    }

    const retakePicture = (): void => {
        setImageUri('');
        setResults({id: 0, fullText: [], korean: ''});
        setShowKorean(false);
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            {/* After taking a picture */}
            {imageUri ? (
                /* After taking a picture and press the check button */
                results?.fullText && results?.korean ? (
                    <ImageBackground style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.5 }} source={{ uri: imageUri }}>
                        <SwipeUpDown
                            itemMini={
                                <BottomDrawer 
                                    results={results}
                                    showKorean={showKorean}
                                    isFullDrawer={isFullDrawer}
                                    isTranslateScreen={true}
                                    handleKorean={handleKorean}
                                    saveResults={saveResults}
                                    closeResults={closeResults}
                                    retakePicture={retakePicture}
                                />
                            }
                            itemFull={
                                <BottomDrawer 
                                    results={results}
                                    showKorean={showKorean}
                                    isFullDrawer={isFullDrawer}
                                    isTranslateScreen={true}
                                    handleKorean={handleKorean}
                                    saveResults={saveResults}
                                    closeResults={closeResults}
                                    retakePicture={retakePicture}
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
                ) : (
                    /* After taking a picture, before OCR(pressing the check button) */
                    loading ? (
                        <Loading />
                    ) : (
                        <>
                        <ImageBackground style={styles.camera} resizeMode="cover" source={{ uri: imageUri }} />
                        <View style={[styles.buttonContainer, , {justifyContent: 'center' }]}>
                            <TouchableOpacity style={[styles.circleButton, styles.primaryBackground]} onPress={extractText}>
                                <Ionicons name="checkmark-sharp" size={32} color='#fff' />
                            </TouchableOpacity>
                        </View>
                        </>
                    )
                )
            ) : (
                /* Before taking a picture, Camera ready */
                <>
                <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
                    <View style={styles.cameraContainer} />
                </Camera>
                <View style={[styles.buttonContainer, {justifyContent: 'space-between' }]}>
                    <TouchableOpacity onPress={pickImage}>
                        <Ionicons name="image-outline" size={32} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.circleButton, styles.whiteBackground]} onPress={takePicture}>
                        <View style={[styles.innerCircle, styles.whiteBackground]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                        setType(
                            type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                        }}>
                        <Ionicons name="camera-reverse-outline" size={32} color="white" />
                    </TouchableOpacity>
                </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 4,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#000'
    },
    circleButton: {
        borderRadius: 48,
        height: 64,
        width: 64,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryBackground: {
        backgroundColor: theme.colors.primary
    },
    grayBackground: {
        backgroundColor: theme.colors.gray
    },
    whiteBackground: {
        backgroundColor: '#fff',
    },
    innerCircle: {
        borderRadius: 48,
        padding: 8,
        height: 56,
        width: 56,
        borderWidth: 2
    }
}); 
