import React, { useState } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, TouchableHighlight, ScrollView, Alert } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { Popover, Button, Divider, Text } from 'native-base';
import { theme } from '../core/theme';
import type { BottomDrawerProps } from '../types';


const NO_WIDTH_SPACE = '​';
const highlight = (text: string, registered: boolean) =>
  text.split(' ').map((word, i) => (
    <Text key={i}>
      <Text style={!registered ? styles.highlighted : styles.grayBackground}>{word} </Text>
      {NO_WIDTH_SPACE}
    </Text>
  ));

function BottomDrawer(props: BottomDrawerProps) {
	const [currentEvent, setCurrentEvent] = useState<number>(0);

	const openPopup = (resultId: number) => () => {
		setCurrentEvent(resultId);
	}

	const closePopup = () => {
		setCurrentEvent(0);
	}

	const addEvent = (resultId: number) => () => {
		// TODO: api
		// TEST
		let status = "success";
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
				<Text fontFamily="heading" fontWeight={700} fontStyle="normal" fontSize={24} color="primary.500">{props.showFullText ? "Full Text" : "Results"}</Text>
					<View style={styles.alignRow}>
						<TouchableOpacity style={styles.rightSpace} onPress={props.handleFullText}>
							<Entypo name="text" size={32} color="#000"/>
						</TouchableOpacity>
						{props.isTranslateScreen &&
							<TouchableOpacity onPress={props.saveResults}>
								<FontAwesome name="save" size={32} color='#000' />
							</TouchableOpacity>
						}
					</View>
				</View>
				
				<ScrollView style={{ flex: 1 }}>
					{!props.showFullText ? (
						props.results?.summary?.map((item, index) => 
							item.highlight ? (
								<Popover 
									key={item.id} 
									isOpen={item.id===currentEvent}
									onOpen={openPopup(item.id)}									
									onClose={closePopup}
									trigger={triggerProps => {
										return <Text {...triggerProps}>
											<Text key={item.content} style={styles.content}>
												{index+1}.&nbsp; 
												{item.highlight ? (
													highlight(item.content, item.registered)
												) : (
													item.content
												)}
											</Text>
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
												<Button onPress={addEvent(item.id)}>Add to calendar</Button>
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
								<Text key={item.content} style={styles.content}>
									{index+1}.&nbsp; {item.content}
								</Text>
							)
						)
					) : (
						<View style={{flex:1, flexDirection: 'column'}}>
							<ScrollView style={{flex:1}}>
								<Text >{props.results?.fullText}</Text>
							</ScrollView>
							<Divider my="2" />
							<ScrollView style={{flex:2}}>
								<Text>{props.results?.korean}</Text>
							</ScrollView>
						</View>
					)}
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
	content: {
		fontSize: 16,
		paddingBottom: 8,
		letterSpacing: 1
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
