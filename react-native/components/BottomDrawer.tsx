import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, TouchableHighlight, ScrollView, Alert, Linking, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Popover, Button, Text, Modal, FormControl, Input, VStack, HStack, AlertDialog } from 'native-base';
import { theme } from '../core/theme';
import type { BottomDrawerProps, EventForm, ResultsForm, UserData } from '../types';
import { useAuth } from '../contexts/Auth';
import { useNavigation, StackActions } from '@react-navigation/native';
import i18n from 'i18n-js';
import '../locales/i18n';
import { Dropdown } from 'react-native-element-dropdown';
import useFonts from '../hooks/useFonts';
import AppLoading from 'expo-app-loading';


const highlight = (text: string, registered: boolean) =>
    <Text color="#fff" fontFamily="body" fontWeight={500} fontStyle="normal" fontSize='md' pt={24} style={!registered ? styles.highlighted : styles.grayBackground}>{text}</Text>

function BottomDrawer(props: BottomDrawerProps) {
    const [currentEvent, setCurrentEvent] = useState<number>(0);
    const [openEventForm, setOpenEventForm] = useState<boolean>(false); 
    const [eventForm, setEventForm] = useState<EventForm>({cid: 0, title: '', date: '', description: ''});
    const [calendarAlert, setCalendarAlert] = useState<boolean>(false);
    const [calendarUrl, setCalendarUrl] = useState<string>('');
    const [resultsForm, setResultsForm] = useState<ResultsForm>({cid: 0, title: 'title'});
    const [user, setUser] = useState<UserData>();
    const [firstCid, setFirstCid] = useState(0);
    const auth = useAuth();
    const navigation = useNavigation();
    const cancelRef = React.useRef(null);
    const [data, setData] = useState();

    const [fontsLoaded, SetFontsLoaded] = useState<boolean>(false);
    const LoadFontsAndRestoreToken = async () => {
        await useFonts();
    };

    useEffect(()=> {
        if (auth?.userData) {
            setUser(auth?.userData);
            if (auth?.userData?.uchildren && auth.userData.uchildren.length > 0) {
                let cid = auth.userData.uchildren[0].cid
                setEventForm({...eventForm, ['cid']: cid});
                setResultsForm({...resultsForm, ['cid']: cid});
                setFirstCid(cid);
            }
        }
    }, [auth]);

    useEffect(() => {
        if (currentEvent && eventForm?.cid) {
            let obj = props?.results?.fullText;
            let event = obj.find(function(item, index) {
                if (item.eid===currentEvent) {
                    return true;
                }
            });
            if (event?.content && user?.uchildren) {
                let cname = user.uchildren.filter(child => child.cid === eventForm.cid)[0].cname;
                setEventForm({title: '['+cname+'] ' + event.content, date: event?.date ? event.date : '', cid: eventForm.cid, description: eventForm.description });
            }
        }
    }, [currentEvent, eventForm?.cid])

	useEffect(() => {
        if (props.openSaveForm && firstCid) {
            setResultsForm({ cid: firstCid, title: props?.results?.title ? props.results.title : 'title' });
        }
	}, [props?.openSaveForm])

    const openPopup = (resultId: number) => () => {
        if (resultId === -1) {
            Alert.alert(i18n.t("saveFirst"));
        }
        else {
            setCurrentEvent(resultId);
        }
    }

    const closePopup = () => {
        setCurrentEvent(0);
    }

    const handleOpenEventForm = (prop?: string) => () => {
        if (prop==='save') {
            addEvent();
        }
        setOpenEventForm(!openEventForm);
    }

    const handleCalendarAlert = () => {
        setCalendarAlert(!calendarAlert);
    }

    const addEvent = () => {
        if (auth?.authData?.access_token && eventForm) {
            console.log(eventForm, currentEvent);
            fetch(`http://localhost:8080/event/register?eid=${currentEvent}`, {
                method: 'PUT',
                headers: {
                    'ACCESS-TOKEN': auth.authData.access_token,
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(eventForm),
                redirect: 'follow'
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.url) {
                    setCalendarUrl(data.url)    // console.log(data)
                    handleCalendarAlert();
					// auth?.handleUpdate();
                }
                else {
                    Alert.alert(i18n.t('registerFailed'));
                }
            })
            .catch(function (error) {
                console.log(error);
                if(error?.response?.status==401) {
                    //redirect to login
                    Alert.alert("The session has expired. Please log in again.");
                    auth.signOut();
                    navigation.dispatch(StackActions.popToTop())
                }
            });
        }
    }

    const linkingCalendar = () => {
        handleCalendarAlert();
        // TEST
        // Linking.openURL('https://www.google.com');
        if (calendarUrl) {
            Linking.openURL(calendarUrl);
        }
    }

    if (!fontsLoaded) {
        return (
          <AppLoading
            startAsync={LoadFontsAndRestoreToken}
            onFinish={() => SetFontsLoaded(true)}
            onError={() => {}}
          />
        );
    } 

    return (
        <View style={styles.bottomDrawer}>
            <View style={{ flex: 1 }}>
                <View style={styles.horizontalLine} />
                <View style={[styles.spaceBetween, { paddingBottom: 24 }]}>
                    <Text fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize='2xl' color="primary.500">{props.showKorean ? i18n.t('korean') : i18n.t('translation')}</Text>
                    <HStack space={2}>
                        <TouchableOpacity onPress={props.handleKorean}>
                            <MaterialIcons name="translate" size={32} color="#000"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={props.copyToClipboard}>
                            <MaterialIcons name="content-copy" size={32} color="black" />
                        </TouchableOpacity>
                    </HStack>
                </View>
                
                {/* <View style={{paddingBottom: 10, marginBottom: 10, flex: 1}}> */}
                <ScrollView  style={{ flex: 1 }}>
                    <TouchableWithoutFeedback>
                    <Text fontFamily="body" fontWeight={500} fontStyle="normal" fontSize='md' lineHeight='xl'>
                    {!props.showKorean ? (
                        props.results?.fullText?.map((item, index) => 
                            item.highlight ? (
                                <Popover 
                                    key={item.id} 
                                    isOpen={item.eid===currentEvent}
                                    onOpen={openPopup(item.eid)}                                 
                                    onClose={closePopup}
                                    trigger={triggerProps => {
                                        return <Text {...triggerProps}>
                                                {highlight(item.content, item.registered)}
                                            </Text>;
                                    }}
                                >
                                    {!item.registered ? (
                                        <Popover.Content accessibilityLabel={i18n.t('accessibilityLabel')} w={Dimensions.get('window').width*0.7}>
                                            <Popover.Arrow />
                                            <Popover.CloseButton />
                                            <Popover.Header>{i18n.t('addEvent')}</Popover.Header>
                                            <Popover.Body>
                                                {i18n.t('addEventDesc')}
                                            </Popover.Body>
                                            <Popover.Footer justifyContent="flex-end">
                                                <Button.Group space={4}>
                                                    <Button variant="ghost" onPress={closePopup}>
                                                        {i18n.t('cancel')}
                                                    </Button>
                                                    <Button onPress={handleOpenEventForm()}>{i18n.t('addCalendar')}</Button>
                                                    <Modal isOpen={openEventForm} onClose={handleOpenEventForm()}>
                                                        <Modal.Content maxWidth="400px">
                                                        <Modal.CloseButton />
                                                        <Modal.Header>{i18n.t('newEvent')}</Modal.Header>
                                                        <Modal.Body>
                                                            <VStack space={2}>
                                                                <FormControl>
                                                                    <FormControl.Label>{i18n.t('child')}</FormControl.Label>
                                                                    <Dropdown
                                                                        style={styles.dropdown}
                                                                        placeholderStyle={styles.placeholderStyle}
                                                                        selectedTextStyle={styles.selectedTextStyle}
                                                                        data={user?.uchildren?.length ? user?.uchildren?.map(child => 
                                                                            ({ label: child?.cname, value: child?.cid.toString()})
                                                                        ) : []}
                                                                        maxHeight={236}
                                                                        labelField="label"
                                                                        valueField="value"
                                                                        placeholder={i18n.t('selectLang')}
                                                                        searchPlaceholder="Search..."
                                                                        value={eventForm?.cid.toString()}
                                                                        onChange={itemValue => {
                                                                            setEventForm({ ...eventForm, ['cid']: Number(itemValue) })
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormControl>
                                                                    <FormControl.Label>{i18n.t('title')}</FormControl.Label>
                                                                    <Input 
                                                                        value={eventForm?.title}
                                                                        onChangeText={(text) => setEventForm({...eventForm, ['title']: text})}
                                                                        returnKeyType={"next"}
                                                                    />
                                                                    </FormControl>
                                                                <FormControl>
                                                                    <FormControl.Label>{i18n.t('date')}</FormControl.Label>
                                                                    <Input 
                                                                        value={eventForm?.date}
                                                                        isDisabled
                                                                    />
                                                                </FormControl>
                                                                <FormControl>
                                                                    <FormControl.Label>{i18n.t('addEventDesc')}</FormControl.Label>
                                                                    <Input 
                                                                        value={eventForm?.description}
                                                                        onChangeText={(text) => setEventForm({...eventForm, ['description']: text})}
                                                                    />
                                                                </FormControl>
                                                            </VStack>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button.Group space={2}>
                                                            <Button variant="ghost" colorScheme="blueGray" onPress={handleOpenEventForm()}>
                                                                {i18n.t('cancel')}
                                                            </Button>
                                                            <Button onPress={handleOpenEventForm('save')}>
                                                                {i18n.t('save')}
                                                            </Button>
                                                            </Button.Group>
                                                        </Modal.Footer>
                                                        </Modal.Content>
                                                    </Modal>
                                                    <AlertDialog leastDestructiveRef={cancelRef} isOpen={calendarAlert} onClose={handleCalendarAlert}>
                                                        <AlertDialog.Content>
                                                        <AlertDialog.CloseButton />
                                                        <AlertDialog.Header>{i18n.t('checkCalendar')}</AlertDialog.Header>
                                                        <AlertDialog.Body>
                                                            <Text>{i18n.t('formalart_1')}</Text>
                                                            <Text pt={1}>{i18n.t('formalart_2')}</Text>
                                                        </AlertDialog.Body>
                                                        <AlertDialog.Footer>
                                                            <Button.Group space={2}>
                                                            <Button variant='unstyled' colorScheme='coolGray' onPress={handleCalendarAlert} ref={cancelRef}>
                                                                {i18n.t('close')}
                                                            </Button>
                                                            <Button colorScheme='primary' onPress={linkingCalendar}>
                                                                {i18n.t('continue')}
                                                            </Button>
                                                            </Button.Group>
                                                        </AlertDialog.Footer>
                                                        </AlertDialog.Content>
                                                    </AlertDialog>
                                                </Button.Group>
                                            </Popover.Footer>
                                        </Popover.Content>
                                    ) : (
                                        <Popover.Content accessibilityLabel={i18n.t('accessibilityLabel')} w={Dimensions.get('window').width*0.7}>
                                            <Popover.Arrow />
                                            <Popover.CloseButton />
                                            <Popover.Header>{i18n.t('eventAlreadyRegistered')}</Popover.Header>
                                            <Popover.Body>
                                                {i18n.t('eventAlreadyRegisteredDesc')}
                                            </Popover.Body>
                                            <Popover.Footer justifyContent="flex-end">
                                                <Button.Group space={4}>
                                                    <Button variant="ghost" onPress={closePopup}>
                                                        {i18n.t('cancel')}
                                                    </Button>
                                                    <Button onPress={closePopup}>{i18n.t('gotIt')}</Button>
                                                </Button.Group>
                                            </Popover.Footer>
                                        </Popover.Content>
                                    )}
                                </Popover>
                            ) : (
                                <Text key={item.content}>
                                    {item.content.slice(72)}
                                </Text>
                            )
                        )
                    ) : (
                        <Text>{props.results?.korean}</Text>
                    )}
                    </Text>
                    </TouchableWithoutFeedback>
                </ScrollView>
                {/* </View> */}
            </View>
            {props.isTranslateScreen && 
                <View style={[styles.spaceBetween, props.isFullDrawer && styles.full ]}>
                    <TouchableHighlight style={[styles.regularButton, styles.grayBackground]} onPress={props.retakePicture}>
                        <Text color="white" fontWeight={500}>{i18n.t('retake')}</Text>
                    </TouchableHighlight>
                    <View style={styles.gap} />
                    {props.handleOpenSaveForm && 
                        <>
                        <TouchableHighlight style={[styles.regularButton, styles.primaryBackground]} onPress={props.handleOpenSaveForm}>
                            <Text color="white" fontWeight={500}>{i18n.t('save')}</Text>
                        </TouchableHighlight>
                        <Modal isOpen={props.openSaveForm} onClose={props.handleOpenSaveForm}>
                            <Modal.Content maxWidth="400px">
                            <Modal.CloseButton />
                            <Modal.Header>{i18n.t('saveResults')}</Modal.Header>
                            <Modal.Body>
                                <VStack space={2}>
                                    <FormControl>
                                        <FormControl.Label>{i18n.t('child')}</FormControl.Label>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            data={user?.uchildren?.length ? user?.uchildren?.map(child => 
                                                ({ label: child?.cname, value: child?.cid.toString()})
                                            ) : []}
                                            maxHeight={220}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={i18n.t('child')}
                                            value={eventForm?.cid.toString()}
                                            onChange={itemValue => {
                                                setResultsForm({...resultsForm, ['cid']: Number(itemValue) })
                                            }}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormControl.Label>Title</FormControl.Label>
                                        <Input 
                                            value={resultsForm['title']}
                                            onChangeText={(text) => setResultsForm({...resultsForm, ['title']: text})}
                                        />
                                        <FormControl.HelperText>
                                            {i18n.t('helpertext')}
                                        </FormControl.HelperText>
                                    </FormControl>
                                </VStack>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={props.handleOpenSaveForm}>
                                    {i18n.t('cancel')}
                                </Button>
                                <Button onPress={() => props?.saveResults && props.saveResults(resultsForm)}>
                                    {i18n.t('save')}
                                </Button>
                                </Button.Group>
                            </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                        </>
                    }
                </View>
            }
        </View>
    )
}

export default BottomDrawer

const styles = StyleSheet.create({
    bottomDrawer: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'space-between',
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 48,
        borderTopRightRadius: 48,
        padding: 32
    },
    horizontalLine: {
        flex: 1,
        marginHorizontal: Dimensions.get('window').width*0.33,
        marginBottom: 32,
        height: 4,
        maxHeight: 4,
        justifyContent: 'center',
        backgroundColor: theme.colors.gray
    },
    regularButton: {
        paddingVertical: 16,
        flex: 0.9,
        marginTop: 16,
        alignItems: 'center',
        borderRadius: 16
    },
    gap: {
        flex: 0.1
    },
    primaryBackground: {
        backgroundColor: theme.colors.primary
    },
    grayBackground: {
        backgroundColor: theme.colors.gray
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    alignRow: {
        flexDirection: 'row'
    },
    highlighted: {
        backgroundColor: theme.colors.primary,
    },
    full: {
        paddingBottom: 96
    },
    dropdown: {
		height: 32,
		borderColor: '#e5e5e5',
		borderWidth: 0.6,
		borderRadius: 5,
		paddingHorizontal: 8,
		marginTop: 1
	},
    placeholderStyle: {
		fontSize: 13,
		fontFamily: 'Lora_400Regular',
		color: '#a3a3a3'
	},
	selectedTextStyle: {
		fontSize: 13,
		fontFamily: 'Lora_400Regular',
	}
})
