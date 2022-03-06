import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Alert, Platform, ScrollView, Image, GestureResponderEvent } from 'react-native';
import { FormControl, Input, Button, VStack, Select, CheckIcon } from 'native-base';
import { nameValidator } from '../core/utils';
import type { Navigation } from '../types';
import { theme } from '../core/theme';

export default function JoinScreen({ navigation }: Navigation) {
	const [profileImg, setProfileImg] = useState<number>(1);
	const [username, setUsername] = useState<string>('');
	const [language, setLanguage] = useState<string>('');
	const [childrenNumber, setChildrenNumber] = useState<string>('1');
	const [childrenName, setChildrenName] = useState<string[]>([]);
	const imgSource = [require(`../assets/images/profile-images/profile-1.png`), require(`../assets/images/profile-images/profile-2.png`), require(`../assets/images/profile-images/profile-3.png`),
	require(`../assets/images/profile-images/profile-4.png`), require(`../assets/images/profile-images/profile-5.png`), require(`../assets/images/profile-images/profile-6.png`), require(`../assets/images/profile-images/profile-7.png`)];
	const childrenColor = [theme.colors.primary, theme.colors.secondary, theme.colors.skyblue, theme.colors.coral, theme.colors.gray, '#000']
	
	const errorAlert = (error: string) =>
		Alert.alert(                    
		"Join Failed",                 
		error,                      
		[
			{ text: "OK", onPress: () => console.log("OK Pressed") }
		]
		);

	const handleProfileImg = (profileType: number) => (event: GestureResponderEvent) => {
		setProfileImg(profileType);
	}

	const handleChildName = (childNum: number, text: string) => {
		let array = [...childrenName];
		array[childNum] = text;
		setChildrenName(array);
	}

	const onJoinPressed = () => {
		const usernameError = nameValidator(username);
		const childrenNameError = childrenName.length !== Number(childrenNumber);

		if (usernameError || childrenNameError || !language) {
			console.log(usernameError);
			errorAlert("Please fill in all the blanks!");
			return;
		}

		Alert.alert(
		"Success",
		"Congratulations, your account has been successfully created."
		)
		navigation.navigate('Home');
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
			<View style={styles.topView}>
				<VStack space={4} style={{ flex: 1 }}>
					<FormControl isRequired style={{ flex: 1.2 }}>
						<FormControl.Label>Profile Image</FormControl.Label>
						<ScrollView horizontal={true}>
							{Array(7).fill(1).map((num, index) =>
								<Button key={'b_'+index} variant="unstyled" onPress={handleProfileImg(index+1)}>
									<Image style={[styles.profileImage, profileImg!==index+1 && styles.disabled]} source={imgSource[index]} />
								</Button>
							)}
						</ScrollView>
					</FormControl>
					<FormControl isRequired style={{ flex: 1 }}>
						<FormControl.Label>Username</FormControl.Label>
						<Input 
							size="md"
							value={username}
							onChangeText={(text) => setUsername(text)}
							autoFocus
							autoCapitalize="none"
							returnKeyType={"next"}
						/>
					</FormControl>
					<FormControl isRequired style={{ flex: 1 }}>
						<FormControl.Label>Select Your Language</FormControl.Label>
						<Select selectedValue={language} size="md" minWidth={200} accessibilityLabel="Select your language" placeholder="Select your language" onValueChange={itemValue => {
						setLanguage(itemValue);
					}} _selectedItem={{
						bg: "skyblue.500",
						endIcon: <CheckIcon size={5} />
					}} mt={1}>
						{/* Country code 3 digit ISO */}
						<Select.Item label="Armenian" value="arm" />
						<Select.Item label="Chinese" value="chn" />
						<Select.Item label="Japanese" value="jpn" />
						<Select.Item label="Indonesian" value="idn" />
						<Select.Item label="Korean" value="kor" />
						<Select.Item label="Malay" value="mys" />
						<Select.Item label="Ukrainian" value="ukr" />
						<Select.Item label="Slovak" value="svk" />
						<Select.Item label="Uzbek" value="uzb" />
						<Select.Item label="Vietnamese" value="vnm" />
						</Select>
					</FormControl>
					<FormControl isRequired style={{ flex: 1 }}>
						<FormControl.Label>Number of Children</FormControl.Label>
						<Select selectedValue={childrenNumber} size="md" minWidth={200} accessibilityLabel="Select number of children" placeholder="Select number of children" onValueChange={itemValue => {
						setChildrenNumber(itemValue);
					}} _selectedItem={{
						bg: "skyblue.500",
						endIcon: <CheckIcon size={5} />
					}} mt={1}>
						<Select.Item label="1" value="1" />
						<Select.Item label="2" value="2" />
						<Select.Item label="3" value="3" />
						<Select.Item label="4" value="4" />
						<Select.Item label="5" value="5" />
						<Select.Item label="6" value="6" />
						</Select>
					</FormControl>
					<FormControl isRequired style={{ flex: 2 }}>
						<FormControl.Label>Children name</FormControl.Label>
						<ScrollView style={{height: '100%'}}>
							{Array(Number(childrenNumber)).fill(1).map((child, index) => 
								<Input 
									key={'i_'+index}
									size="md"
									variant="underlined"
									value={childrenName[index]}
									onChangeText={(text) => handleChildName(index, text)}
									autoCapitalize="none"
									mb={2}
									InputRightElement={
										<Button bg={childrenColor[index]} borderRadius="full" m={1} size="xs" height={childrenNumber==="1" ? "60%": "50%"}>
											&nbsp;
										</Button>
									}
								/>
							)}
						</ScrollView>
					</FormControl>
				</VStack>
			</View>
			<View style={styles.bottomView}>
				<Button size="lg" onPress={onJoinPressed}>
					Sign up
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 25,
		paddingVertical: 40,
		backgroundColor: theme.colors.background,
		flex: 1,
		flexDirection: 'column',
	},
	topView: {
		flex: 5, 
	},
	bottomView: {
		flex: 1
	},
	profileImage: {
		width: 52,
		height: 52,
	},
	disabled: {
		opacity: 0.3
	}
});

