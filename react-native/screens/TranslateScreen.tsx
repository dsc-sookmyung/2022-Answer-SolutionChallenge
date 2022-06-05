import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ImageBackground, Dimensions, Alert, Image } from 'react-native';
import { useToast, Button, HStack, Text, Divider, Modal, VStack } from 'native-base';
import axios, { AxiosRequestConfig } from "axios";
import { Camera } from 'expo-camera';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { theme } from '../core/theme';
import type { Navigation, Result, ResultsForm } from '../types';
import SwipeUpDown from 'react-native-swipe-up-down';
import BottomDrawer from '../components/BottomDrawer';
import mime from "mime";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/Auth';
import Loading from '../components/Loading';
import i18n from 'i18n-js';
import '../locales/i18n';


/* TODO:
    - 스크롤 내려가게 하기 (지금은 ScrollView의 스크롤이 안 먹음)
*/

const date = new Date();


export default function TranslateScreen({ navigation }: Navigation) {
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera, setCamera] = useState<any>(null);
    const [imageUri, setImageUri] = useState<string>('');
    const [results, setResults] = useState<Result>();
    const [showKorean, setShowKorean] = useState<boolean>(false);
    const [isFullDrawer, setFullDrawer] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [openSaveForm, setOpenSaveForm] = useState<boolean>(false);
    const [openInitialEventForm, setOpenInitialEventForm] = useState<boolean>(true);

    const toast = useToast();
    const auth = useAuth();

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
    }, [imageUri]);

    // DEV TEST
    // if (hasPermission === null) {
    //  return <View />;
    // }
    // else if (hasPermission === false) {
    //  return <Text>No access to camera!</Text>
    // }

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
                const axiosInstance = axios.create({
                    baseURL: 'http://localhost:8080', 
                    timeout: 30000,
                    headers: {
                        "X-Platform": 'iOS',
                        "X-App-Build-Number": '1.0.0',
                        'ACCESS-TOKEN': auth.authData.access_token
                    },
                });
    
                const formData = new FormData();
                formData.append("uploadfile", {
                    uri : imageUri,
                    type: mime.getType(imageUri),
                    name: imageUri.split("/").pop()
                });
                
                const config: AxiosRequestConfig = {
                    method: "post",
                    url: "/notice/ocr",
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    transformRequest: (data, headers) => {
                        return formData;
                    },
                    onUploadProgress: (progressEvent) => {
                    },
                    data: formData,
                };
    
                // send post request and get response
                const response = await axiosInstance.request(config);
    
                // console.log('response',response.data);
                if (response.data) {
                    setResults(response.data);
                    setLoading(false);
                }
            }
        }

        // TEST: mockup data
        // setResults({
        //     fullText: [
        //         {id: 1, eid: -1, content: "1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.\n1) ", date: "", highlight: false, registered: false},
        //         {id: 2, eid: -1, content: "Closing ceremony", date: "2022-01-04", highlight: true, registered: false},
        //         {id: 3, eid: -1, content: ": 1st and 2nd graders, each classroom, 9:00-10:50 (no meals)\n2) ", date: "", highlight: false, registered: false},
        //         {id: 4, eid: -1, content: "Diploma representation ceremony", date: "2022-01-04", highlight: true, registered: true},
        //         {id: 5, eid: -1, content: ": 3rd grade, multi-purpose auditorium (2nd floor), 10:30-12:20\n2. School opening and entrance ceremony for new students: March 4th (Mon), 2019 at 9 o'clock for students to go to school.", date: "", highlight: false, registered: false},
        //     ],
        //     korean: "가정통신문\n예당중학교\n8053-8388\n꿈은 크게. 마음은 넘게·\n행동은 바르게\n학부모님께\n희망찬 새해를 맞이하며 학부모님 가정에 건강과 행운이 함께 하시기를 기원 드립니다.\n드릴 말씀은, 2018학년도 종업식 및 졸업장 수여식과 2019학년도 개학 및 신입생 입학식을 다음과 같이 안내드리오니, 이후 3월 개학 때까지 학생들이 자기주도 학습 능력을 배양하고 다양한 체험 활동을 통하여 심신이 건강해지며 각종 유해 환경에 노출되지 않고 안전하고 줄거운 시간이 되도록 지도해 주시기 바랍니다.\n",
        //     trans_full: "hello",
        //     event_num: 2,
        //     events: [
        //         {
        //             title: "opening ceremony",
        //             date: "2022-03-24"
        //         },
        //         {
        //             title: "closing ceremony",
        //             date: "2022-03-24"
        //         }
        //     ],
        //     title: "closing ceremony"
        // });
    }

    const handleKorean = (): void => {
        setShowKorean(!showKorean);
    }

    const handleOpenSaveForm = () => {
        setOpenSaveForm(!openSaveForm);
    }

    const saveResults = async(form: ResultsForm): Promise<any> => {
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
            
            if (auth?.authData?.access_token) {
                const axiosInstance = axios.create({
                    baseURL: 'http://localhost:8080', 
                    timeout: 30000,
                    headers: {
                        "X-Platform": 'iOS',
                        "X-App-Build-Number": '1.0.0',
                        'ACCESS-TOKEN': auth.authData.access_token
                    },
                });

                axiosInstance({
                    method: "post",
                    url: "/notice/image",
                    transformRequest: (data, headers) => {
                        return formdata;
                    },
                    onUploadProgress: (progressEvent) => {
                    },
                    data: formdata,
                })
                .then(function (response) {
                    console.log('image response',response.data);
                    if (response.data && auth?.authData?.access_token) {
                        const imageUrl = response.data.imageUrl;

                        let data = {
                            imageUrl: imageUrl,
                            cid: form?.cid,
                            title: form?.title,
                            date: new Date().toISOString().slice(0, 10),
                            korean: results?.korean,
                            fullText: results?.trans_full
                        }

                        axios({
                            method: "post",
                            url: 'http://localhost:8080/notice/save',
                            headers: {'ACCESS-TOKEN': auth.authData.access_token },
                            data: data
                        })
                        .then(response => {
                            if (response.data) {
                                console.log('success', response.data);
                                Alert.alert(`The result was saved in Search as [${response.data?.title}]`);
                                setResults(response.data);
                                handleOpenSaveForm();   
                            }
                        })
                        .catch(err => {
                            console.log('save err', err);
                        })
                    }
                })
                .catch(function (error) {
                    console.log('error',error.response);
                });
            }
        }
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
                            <Modal isOpen={openInitialEventForm} animationPreset="slide">
                                <Modal.Content maxWidth="400">
                                <Modal.Header>
                                    <VStack space={2}>
                                        {results?.event_num ? (
                                            <Text fontSize="lg" fontWeight={600} textAlign="center">We found {results.event_num} events for you</Text>
                                        ) : (
                                            <Text fontSize="lg" fontWeight={600} textAlign="center">{i18n.t('eventNotFound')}</Text>
                                        )}
                                    </VStack>
                                </Modal.Header>
                                <Modal.Body maxHeight={200}>
                                    {results?.events?.length ? (
                                        results.events.map((item, index) =>
                                            <HStack key={'re_'+index} space={4} my={2} alignItems="center">
                                                <SimpleLineIcons name="magic-wand" size={28} />
                                                <VStack>
                                                    <Text fontSize="xs">{item.date}</Text>
                                                    <Text fontWeight={600}>{item.title}</Text>
                                                </VStack>
                                            </HStack>
                                        )
                                    ) : (
                                        <Image source={require("../assets/images/empty.png")} style={styles.imageStyle} />
                                    )}
                                </Modal.Body>
                                <Divider />
                                <Modal.Footer alignSelf="center" bgColor="muted.50" p={2}>
                                    <Button variant="unstyled" onPress={() => setOpenInitialEventForm(false)}>
                                        OK
                                    </Button>
                                </Modal.Footer>
                                </Modal.Content>
                            </Modal>
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
    },
    imageStyle: {
        width: 80,
        height: 80,
        margin: 20,
        alignSelf: 'center'
    }
});
