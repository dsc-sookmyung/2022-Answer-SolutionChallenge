import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, TouchableHighlight, ScrollView, Alert } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Popover, Button, Text, Modal, FormControl, Input, VStack, Select, CheckIcon } from 'native-base';
import { theme } from '../core/theme';
import type { BottomDrawerProps, EventForm, UserData } from '../types';
import { useAuth } from '../contexts/Auth';
import { useNavigation, StackActions } from '@react-navigation/native';


const highlight = (text: string, registered: boolean) =>
	<Text fontFamily="body" fontWeight={700} fontStyle="normal" fontSize='md' pt={24} style={!registered ? styles.highlighted : styles.grayBackground}>{text}</Text>

function BottomDrawer(props: BottomDrawerProps) {
	const [currentEvent, setCurrentEvent] = useState<number>(0);
	const [openSaveForm, setOpenSaveForm] = useState<boolean>(false);
	const [resultsTitle, setResultsTitle] = useState<string>('title');
	const [openEventForm, setOpenEventForm] = useState<boolean>(false);	
	const [eventForm, setEventForm] = useState<EventForm>({cId: 1, title: '', date: '', description: ''});
	// TEST: mockup data
	const [user, setUser] = useState<UserData>({uid: 1, uprofileImg: 1, username: 'hee', ulanguage: 'ko', uchildren: [{cid: 1, cname: 'soo', color: 1}, {cid: 2, cname: 'joo', color: 3}]})
	// const [user, setUser] = useState<UserData>();
    const auth = useAuth();
	const navigation = useNavigation();

	useEffect(()=> {
        // setUser(auth?.userData);
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

	const openPopup = (resultId: number) => () => {
		setCurrentEvent(resultId);
	}

	const closePopup = () => {
		setCurrentEvent(0);
	}
	
	const handleOpenSaveForm = () => {
		if (openSaveForm) {
			setResultsTitle('title');
		}
		setOpenSaveForm(!openSaveForm);
	}

	const handleOpenEventForm = (prop?: string) => () => {
		if (prop==='save') {
			addEvent();
		}
		setOpenEventForm(!openEventForm);
	}

	const addEvent = () => {
		// TODO: fetch api
		let status = "success";

		if (auth?.authData?.jwt_token && eventForm) {
			fetch("http://localhost:8080/notice/calendar", {
				method: 'POST',
				headers: {
					'JWT_TOKEN': auth.authData.jwt_token
				},
				body: JSON.stringify(eventForm),
				redirect: 'follow'
			})
			.then(response => response.json())
			.then(data => status = data)
			.catch(function (error) {
				console.log(error.response.status) // 401
				console.log(error.response.data.error) //Please Authenticate or whatever returned from server
				if(error.response.status==401) {
					//redirect to login
					Alert.alert("The session has expired. Please log in again.");
					auth.signOut();
					navigation.dispatch(StackActions.popToTop())
				}
			});
		}

		switch (status) {
			case "success": 
				Alert.alert("The event has been successfully added to your calendar!");
				setCurrentEvent(0);	
				break;
			case "duplicate": 
				Alert.alert("This schedule has already been registered.");
				setCurrentEvent(0);
				break;
			default:
				Alert.alert("Failed to add event to calendar. Please try again.")
		}
	}

	return (
		<View style={styles.bottomDrawer}>
			<View style={{ flex: 1 }}>
				<View style={styles.horizontalLine} />
				<View style={[styles.spaceBetween, { paddingBottom: 24 }]}>
				<Text fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize='2xl' color="primary.500">{props.showKorean ? "Korean" : "Results"}</Text>
					<View style={styles.alignRow}>
						<TouchableOpacity style={styles.rightSpace} onPress={props.handleKorean}>
							<MaterialIcons name="translate" size={32} color="#000"/>
						</TouchableOpacity>
						{props.isTranslateScreen &&
						<>
							<TouchableOpacity onPress={() => handleOpenSaveForm()}>
								<FontAwesome name="save" size={32} color='#000' />
							</TouchableOpacity>
							<Modal isOpen={openSaveForm} onClose={() => handleOpenSaveForm()}>
								<Modal.Content maxWidth="400px">
								<Modal.CloseButton />
								<Modal.Header>Save Results</Modal.Header>
								<Modal.Body>
									<FormControl>
									<FormControl.Label>Title</FormControl.Label>
									<Input 
										value={resultsTitle}
										onChangeText={(text) => setResultsTitle(text)}
									/>
									<FormControl.HelperText>
										Give your results a title.
									</FormControl.HelperText>
									</FormControl>
								</Modal.Body>
								<Modal.Footer>
									<Button.Group space={2}>
									<Button variant="ghost" colorScheme="blueGray" onPress={() => {
									handleOpenSaveForm()
									}}>
										Cancel
									</Button>
									<Button onPress={() => props?.saveResults && props.saveResults(resultsTitle)}>
										Save
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
										<Popover.Content accessibilityLabel="Add schedule to calendar" w={Dimensions.get('window').width*0.7}>
											<Popover.Arrow />
											<Popover.CloseButton />
											<Popover.Header>Add an event</Popover.Header>
											<Popover.Body>
												You can add this schedule to the Google calendar.
											</Popover.Body>
											<Popover.Footer justifyContent="flex-end">
												<Button.Group space={4}>
													<Button variant="ghost" onPress={closePopup}>
														Cancel
													</Button>
													<Button onPress={handleOpenEventForm()}>Add to calendar</Button>
													<Modal isOpen={openEventForm} onClose={handleOpenEventForm()}>
														<Modal.Content maxWidth="400px">
														<Modal.CloseButton />
														<Modal.Header>New Event</Modal.Header>
														<Modal.Body>
															<VStack space={2}>
																<FormControl>
																	<FormControl.Label>Child</FormControl.Label>
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
																	<FormControl.Label>Title</FormControl.Label>
																	<Input 
																		value={eventForm?.title}
																		onChangeText={(text) => setEventForm({...eventForm, ['title']: text})}
																	/>
																	</FormControl>
																<FormControl>
																	<FormControl.Label>Date</FormControl.Label>
																	<Input 
																		value={eventForm?.date}
																		isDisabled
																	/>
																</FormControl>
																<FormControl>
																	<FormControl.Label>Description</FormControl.Label>
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
																Cancel
															</Button>
															<Button onPress={handleOpenEventForm('save')}>
																Save
															</Button>
															</Button.Group>
														</Modal.Footer>
														</Modal.Content>
													</Modal>
												</Button.Group>
											</Popover.Footer>
										</Popover.Content>
									) : (
										<Popover.Content accessibilityLabel="Add schedule to calendar" w={Dimensions.get('window').width*0.7}>
											<Popover.Arrow />
											<Popover.CloseButton />
											<Popover.Header>Event already registered</Popover.Header>
											<Popover.Body>
												This event is already registered in Google Calendar.
											</Popover.Body>
											<Popover.Footer justifyContent="flex-end">
												<Button.Group space={4}>
													<Button variant="ghost" onPress={closePopup}>
														Cancel
													</Button>
													<Button onPress={closePopup}>Got it</Button>
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
						<Text color="white">Close</Text>
					</TouchableHighlight>
					<View style={styles.gap} />
					<TouchableHighlight style={[styles.regularButton, styles.primaryBackground]} onPress={props.retakePicture}>
						<Text color="white">Try again</Text>
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
