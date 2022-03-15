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

/* TODO:
    - 스크롤 내려가게 하기 (지금은 ScrollView의 스크롤이 안 먹음)
    - low highlight 주기 (지금은 텍스트 높이만큼 background에 색 줘서 highlight)
*/ 

export default function TranslateScreen({ navigation }: Navigation) {
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [fontsLoaded, SetFontsLoaded] = useState<boolean>(false);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera, setCamera] = useState<any>(null);
    const [imageUri, setImageUri] = useState<string>(''); 
    const [results, setResults] = useState<Result>({id: 0, summary: [], fullText: '', korean: ''});
    const [showFullText, setShowFullText] = useState<boolean>(false);
    const [isFullDrawer, setFullDrawer] = useState<boolean>(false);

    const toast = useToast();

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
        if (results?.summary && results.summary.filter(item => item.highlight === true).length > 0) {
            const message = "You can add a schedule to the calendar by clicking the highlighted text."
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

    const extractText = (): void => {
        if (imageUri) {
            let FormData = require('form-data');
            const formdata = new FormData();
            formdata.append("uploadfile", {
                uri : imageUri,
                type: mime.getType(imageUri),
                name: imageUri.split("/").pop()
            });

            fetch("http://localhost:8080/notice/ocr", {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            })
            .then(response => response.text())	// TODO: response.json()
            .then(data => console.log(data))    // TODO: setResults(data)
            .catch(error => console.log('error', error));

            // TEST
            setResults({
                id: 1,
                summary: [
                    {"id": 1, "content": "Buy Suyeon a delicious meal.", "highlight": false, registered: false},
                    {"id": 2, "content": "The graduation ceremony will be held in the auditorium at 2 p.m. on February 14th.", "highlight": true, registered: false},
                    {"id": 3, "content": "Parents and outsiders are not allowed to enter each class.", "highlight": true, registered: true},
                ],
                fullText: "We wish you good health and happiness in your family in the hopeful new year of the 17th graduation ceremony in 2020. Thank you very much for supporting our educational activities and for your constant interest and cooperation in the midst of the 2020 COVID-19 crisis. The 17th graduation ceremony of Hwaam High School will be held in classrooms to prevent the spread of COVID-19. Parents and outsiders are not allowed to enter each class. Please understand that we cannot bring you together because it is an inevitable measure to prevent the spread of infectious diseases.", 
                korean: "2020학년도 제17회 졸업식 실시 안내 희망찬 새해를 맞이하여 학부모님의 가정에 건강과 행복이 함께 하시기를 기원합니다. 2020학년도 코로나19라는 위기 상황 속에서 본교 교육활동을 지지해주시고 변함없는 관심과 협조를 보내 주셔서 진심으로 감사드립니다. 화암고등학교 제17회 졸업식은 코로나19 확산 예방을 위해 각반 교실에서 진행합니다. 각반 교실에는 학부모 및 외부인의 출입이 불가능합니다. 감염병 확산 방지를 위한 불가피한 대책이니 함께 자리에 모시지 못함을 양해 부탁드립니다. 희망찬 내일을 향해 첫발을 내딛는 졸업생들에게 멀리서나마 축하와 격려를 보내주시기 바랍니다. -제17회 졸업식 안내- 1. 일시: 2021년 1월 5일(화) 10:00 2. 장소: 각반 교실 3: 내용: 각반 영상으로 졸업식 실시 * 졸업생 출입 가능 / 학부모 및 외부인 출입 불가 * 졸업생은 반드시 마스크 착용, 자가 진단 후 등교" 
            })
        }
    }
    
    const handleFullText = (): void => {
        setShowFullText(!showFullText);
    }

    const saveResults = (): void => {
        // TODO: api
        Alert.alert("The scanned result was saved in <Search>.");
    }

    const closeResults = (): void => {
        navigation.navigate('Home');
    }

    const retakePicture = (): void => {
        setImageUri('');
        setResults({id: 0, summary: [], fullText: '', korean: ''});
        setShowFullText(false);
    }

    return (
        <View style={styles.container}>
            {/* After taking a picture */}
            {imageUri ? (
                /* After taking a picture and press the check button */
                results?.summary && results?.fullText && results?.korean ? (
                    <ImageBackground style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.5 }} source={{ uri: imageUri }}>
                        <SwipeUpDown
                            itemMini={
                                <BottomDrawer 
                                    results={results}
                                    showFullText={showFullText}
                                    isFullDrawer={isFullDrawer}
                                    isTranslateScreen={true}
                                    handleFullText={handleFullText}
                                    saveResults={saveResults}
                                    closeResults={closeResults}
                                    retakePicture={retakePicture}
                                />
                            }
                            itemFull={
                                <BottomDrawer 
                                    results={results}
                                    showFullText={showFullText}
                                    isFullDrawer={isFullDrawer}
                                    isTranslateScreen={true}
                                    handleFullText={handleFullText}
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
                    <>
                    <ImageBackground style={styles.camera} resizeMode="cover" source={{ uri: imageUri }} />
                    <View style={[styles.buttonContainer, , {justifyContent: 'center' }]}>
                        <TouchableOpacity style={[styles.circleButton, styles.primaryBackground]} onPress={extractText}>
                            <Ionicons name="checkmark-sharp" size={32} color='#fff' />
                        </TouchableOpacity>
                    </View>
                    </>
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
