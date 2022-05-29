import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ImageBackground, Dimensions, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../core/theme';
import type { Navigation, Result, ResultsForm } from '../types';
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
    const [results, setResults] = useState<Result>({fullText: [], korean: '', trans_full: ''});
    const [showKorean, setShowKorean] = useState<boolean>(false);
    const [isFullDrawer, setFullDrawer] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [openSaveForm, setOpenSaveForm] = useState<boolean>(false);

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
            // console.log(imageUri);
            let FormData = require('form-data');
            const formdata = new FormData();
            formdata.append("uploadfile", {
                uri : imageUri,
                type: mime.getType(imageUri),
                name: imageUri.split("/").pop()
            });

            console.log('ocr',formdata);

            setLoading(true);

            if (auth?.authData?.access_token) {
                await fetch("http://localhost:8080/notice/ocr", {
                    method: 'POST',
                    headers: {
                        'ACCESS-TOKEN': auth.authData.access_token
                    },
                    body: formdata,
                    redirect: 'follow'
                })
                .then(response => response.json())
                .then(data => { 
                    console.log(data)
                    setResults(data)
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
        }
    }
    
    const handleKorean = (): void => {
        setShowKorean(!showKorean);
    }

    const handleOpenSaveForm = () => {
        setOpenSaveForm(!openSaveForm);
    }

    const saveResults = (form: ResultsForm): void => {
        // data 보내고, success 라면, 서버에 저장된 제목 받아와서 보여주기!
        if (!form?.title) {
            Alert.alert("You must enter at least one character for the title.");
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
                cid: form?.cid,
                title: form?.title,
                date: new Date().toISOString().slice(0, 10),
                korean: results?.korean,
                fullText: results?.trans_full
            }
            formdata.append("noticeRequestDto", JSON.stringify(data));
            // formdata.append('noticeRequestDto', new Blob([JSON.stringify(data)], {type: 'application/json'}));
            
            // formdata.append('cid', form?.cid);
            // formdata.append('title', form?.title);
            // formdata.append('date', new Date().toISOString().slice(0, 10));
            // formdata.append('korean', results?.korean);
            // formdata.append('trans_full', results?.trans_full);
            
            // console.log(formdata);
            
            if (auth?.authData?.access_token) {
                fetch('http://localhost:8080/notice/save', {
                    method: 'POST',
                    headers: {
                        'ACCESS-TOKEN': auth.authData.access_token,
                    },
                    body: formdata,
                    redirect: 'follow'
                })
                .then(response => response.json())
                .then(data => {
                    Alert.alert(`The result was saved in Search as [${data?.title}]`);
                    handleOpenSaveForm();   
					// auth?.handleUpdate();
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
                    <ImageBackground style={styles.container} resizeMode="cover" source={{ uri: imageUri }}>
                        <View style={styles.backdrop}>
                            <SwipeUpDown
                                itemMini={
                                    <BottomDrawer 
                                        results={results}
                                        showKorean={showKorean}
                                        isFullDrawer={isFullDrawer}
                                        isTranslateScreen={true}
                                        openSaveForm={openSaveForm}
                                        handleKorean={handleKorean}
                                        saveResults={saveResults}
                                        closeResults={closeResults}
                                        retakePicture={retakePicture}
                                        handleOpenSaveForm={handleOpenSaveForm}
                                    />
                                }
                                itemFull={
                                    <BottomDrawer 
                                        results={results}
                                        showKorean={showKorean}
                                        isFullDrawer={isFullDrawer}
                                        isTranslateScreen={true}
                                        openSaveForm={openSaveForm}
                                        handleKorean={handleKorean}
                                        saveResults={saveResults}
                                        closeResults={closeResults}
                                        retakePicture={retakePicture}
                                        handleOpenSaveForm={handleOpenSaveForm}
                                    />
                                }
                                onShowMini={() => setFullDrawer(false)}
                                onShowFull={() => setFullDrawer(true)}
                                animation="easeInEaseOut"
                                disableSwipeIcon
                                extraMarginTop={10}
                                swipeHeight={Dimensions.get('window').height*0.65}
                            />
                        </View>

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
    },
    backdrop: {
        flex: 1, 
        backgroundColor: 'rgba(0,0,0, 0.60)'
    }
}); 
