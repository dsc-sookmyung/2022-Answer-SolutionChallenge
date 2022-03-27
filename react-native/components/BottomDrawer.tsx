BottomDrawer

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, TouchableHighlight, ScrollView, Alert, Linking } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Popover, Button, Text, Modal, FormControl, Input, VStack, Select, CheckIcon, AlertDialog } from 'native-base';
import { theme } from '../core/theme';
import type { BottomDrawerProps, EventForm, UserData } from '../types';
import { useAuth } from '../contexts/Auth';
import { useNavigation, StackActions } from '@react-navigation/native';
import i18n from 'i18n-js';
import '../locales/i18n';


const highlight = (text: string, registered: boolean) =>
    <Text fontFamily="body" fontWeight={700} fontStyle="normal" fontSize='md' pt={24} style={!registered ? styles.highlighted : styles.grayBackground}>{text}</Text>

function BottomDrawer(props: BottomDrawerProps) {
    const [currentEvent, setCurrentEvent] = useState<number>(0);
    const [openEventForm, setOpenEventForm] = useState<boolean>(false); 
    const [eventForm, setEventForm] = useState<EventForm>({cId: 1, title: '', date: '', description: ''});
    const [calendarAlert, setCalendarAlert] = useState<boolean>(false);
    const [calendarUrl, setCalendarUrl] = useState<string>('');
    const [resultsTitle, setResultsTitle] = useState<string>('title');
    const [user, setUser] = useState<UserData>();
    const auth = useAuth();
    const navigation = useNavigation();
    const cancelRef = React.useRef(null);

    useEffect(()=> {
        setUser(auth?.userData);
    }, [auth]);

    useEffect(() => {
        if (currentEvent && eventForm?.cId) {
            let obj = props?.results?.fullText;
            let event = obj.find(function(item, index) {
                if (item.id===currentEvent) {
                    return true;
                }
            });
            if (event?.content && user?.uchildren) {
                setEventForm({title: '['+user.uchildren[eventForm.cId-1]?.cname+'] ' + event.content, date: event?.date ? event.date : '', cId: eventForm.cId, description: eventForm.description });
            }
        }
    }, [currentEvent, eventForm?.cId])

	useEffect(() => {
        if (props.openSaveForm) {
            setResultsTitle('title');
        }
	}, [props?.openSaveForm])

    const openPopup = (resultId: number) => () => {
        setCurrentEvent(resultId);
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
        // TODO: fetch api
        let status = "success";

        if (auth?.authData?.jwt_token && eventForm) {
            console.log(eventForm, currentEvent);
            fetch(`http://localhost:8080/event/register?id=${currentEvent}`, {
                method: 'PUT',
                headers: {
                    'JWT_TOKEN': auth.authData.jwt_token,
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

    return (
        <View style={styles.bottomDrawer}>
            <View style={{ flex: 1 }}>
                <View style={styles.horizontalLine} />
                <View style={[styles.spaceBetween, { paddingBottom: 24 }]}>
                <Text fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize='2xl' color="primary.500">{props.showKorean ? i18n.t('korean') : i18n.t('results')}</Text>
                    <View style={styles.alignRow}>
                        <TouchableOpacity style={styles.rightSpace} onPress={props.handleKorean}>
                            <MaterialIcons name="translate" size={32} color="#000"/>
                        </TouchableOpacity>
                        {props.isTranslateScreen && props.handleOpenSaveForm && 
                        <>
                            <TouchableOpacity onPress={props.handleOpenSaveForm}>
                                <FontAwesome name="save" size={32} color='#000' />
                            </TouchableOpacity>
                            <Modal isOpen={props.openSaveForm} onClose={props.handleOpenSaveForm}>
                                <Modal.Content maxWidth="400px">
                                <Modal.CloseButton />
                                <Modal.Header>{i18n.t('saveResults')}</Modal.Header>
                                <Modal.Body>
                                    <FormControl>
                                    <FormControl.Label>Title</FormControl.Label>
                                    <Input 
                                        value={resultsTitle}
                                        onChangeText={(text) => setResultsTitle(text)}
                                    />
                                    <FormControl.HelperText>
                                        {i18n.t('helpertext')}
                                    </FormControl.HelperText>
                                    </FormControl>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button.Group space={2}>
                                    <Button variant="ghost" colorScheme="blueGray" onPress={props.handleOpenSaveForm}>
                                        {i18n.t('cancel')}
                                    </Button>
                                    <Button onPress={() => props?.saveResults && props.saveResults(resultsTitle)}>
                                        {i18n.t('save')}
                                    </Button>
                                    </Button.Group>
                                </Modal.Footer>
                                </Modal.Content>
                            </Modal>
                        </>
                        }
                    </View>
                </View>
                
                <ScrollView style={{ flex: 1 }}>
                    <Text fontFamily="body" fontWeight={500} fontStyle="normal" fontSize='md' lineHeight='xl'>
                    {!props.showKorean ? (
                        props.results?.fullText?.map((item, index) => 
                            item.highlight ? (
                                <Popover 
                                    key={item.id} 
                                    isOpen={item.id===currentEvent}
                                    onOpen={openPopup(item.id)}                                 
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
                                                                        <Select selectedValue={eventForm?.cId.toString()} accessibilityLabel="Child" onValueChange={itemValue => {
                                                                            setEventForm({ ...eventForm, ['cId']: Number(itemValue) })
                                                                        }} _selectedItem={{
                                                                            bg: "skyblue.500",
                                                                            endIcon: <CheckIcon size={3} />
                                                                        }}>
                                                                            {/* Country code 3 digit ISO */}
                                                                            {user?.uchildren?.map((child, index) => 
                                                                                child?.cname && child?.cid &&
                                                                                    <Select.Item key={'cs_'+index} label={child?.cname} value={child?.cid.toString()} />
                                                                            )}
                                                                        </Select>
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
                                    {item.content}
                                </Text>
                            )
                        )
                    ) : (
                        <Text>{props.results?.korean}</Text>
                    )}
                    </Text>
                </ScrollView>
            </View>
            {props.isTranslateScreen && 
                <View style={[styles.spaceBetween, props.isFullDrawer && styles.full ]}>
                    <TouchableHighlight style={[styles.regularButton, styles.grayBackground]} onPress={props.closeResults}>
                        <Text color="white">{i18n.t('close')}</Text>
                    </TouchableHighlight>
                    <View style={styles.gap} />
                    <TouchableHighlight style={[styles.regularButton, styles.primaryBackground]} onPress={props.retakePicture}>
                        <Text color="white">{i18n.t('tryAgain')}</Text>
                    </TouchableHighlight>
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
        backgroundColor: theme.colors.skyblue
    },
    rightSpace: {
        paddingRight: 8
    },
    full: {
        paddingBottom: 96
    },
})
