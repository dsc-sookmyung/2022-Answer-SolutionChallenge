import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Alert, Platform, ScrollView, Image, GestureResponderEvent } from 'react-native';
import { FormControl, Input, Button, VStack, Select, CheckIcon } from 'native-base';
import { nameValidator } from '../core/utils';
import type { Navigation, UserData, JoinData } from '../types';
import { theme } from '../core/theme';
import { useAuth } from '../contexts/Auth';

export default function JoinScreen({ navigation }: Navigation) {
	const [childrenNumber, setChildrenNumber] = useState<string>('1');
	const imgSource = [require(`../assets/images/profile-images/profile-1.png`), require(`../assets/images/profile-images/profile-2.png`), require(`../assets/images/profile-images/profile-3.png`),
	require(`../assets/images/profile-images/profile-4.png`), require(`../assets/images/profile-images/profile-5.png`), require(`../assets/images/profile-images/profile-6.png`), require(`../assets/images/profile-images/profile-7.png`)];
	const colors = [{id: 1, hex: '#7986cb'}, {id: 3, hex: '#8e24aa'}, {id: 4, hex: '#e67c73'}, {id: 5, hex: '#f6bf26'}, {id: 7, hex: '#039be5'}, {id: 10, hex: '#0b8043'}]
	// 1 3 4 5 7 10
	const [joinForm, setJoinForm] = useState<JoinData>({
		uid: undefined,
		uprofileImg: 1,
		username: '',
		ulanguage: '',
		uchildren: colors.map(color => ({'cname': '', 'color': color?.id}))
	})

	const [user, setUser] = useState<UserData>();
	const auth = useAuth();

	useEffect(() => {
		if (auth?.userData?.uroleType==='USER') {
			Alert.alert(
				"Success",
				"Congratulations, your account has been successfully created."
			)
			navigation.navigate('Home');
		}
		else if (auth?.userData?.uroleType==='GUEST') {
			setUser(auth?.userData);
		}
	}, [auth]);

	useEffect(() => {
		if (user?.username) {
			setJoinForm({ ...joinForm, ['username']: user.username });
		}
	}, [user]);

	const errorAlert = (error: string) =>
		Alert.alert(                    
			"Join Failed",                 
			error,                      
			[
				{ text: "OK", onPress: () => console.log("OK Pressed") }
			]
		);

	const handleProfileImg = (profileType: number) => (event: GestureResponderEvent) => {
		setJoinForm({ ...joinForm, ['uprofileImg']: profileType });
	}

	const handleChildren = (childNum: number, text: string) => {
		let array = joinForm?.uchildren;
		if (array) array[childNum].cname = text;
		setJoinForm({ ...joinForm, ['uchildren']: array });
	}

	const onJoinPressed = () => {
		if (user && joinForm) {
			joinForm.uid = user?.uid;

			let childrenArr = joinForm?.uchildren;
			childrenArr = childrenArr?.slice(0, Number(childrenNumber));
			joinForm.uchildren = childrenArr;

			const usernameError = nameValidator(joinForm.username);
			const childrenNameError = joinForm.uchildren?.some(child => child.cname === '');
	
			if (usernameError || childrenNameError || !joinForm.ulanguage) {
				errorAlert("Please fill in all the blanks!");
				return;
			}
	
			auth.signUp(joinForm);
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} enabled keyboardVerticalOffset={100}>
			<ScrollView>
				<VStack space={4} style={{ flex: 1 }}>
					<FormControl isRequired style={{ flex: 1.2 }}>
						<FormControl.Label>Profile Image</FormControl.Label>
						<ScrollView horizontal={true}>
							{Array(7).fill(1).map((num, index) =>
								<Button key={'b_'+index} variant="unstyled" onPress={handleProfileImg(index+1)}>
									<Image style={[styles.profileImage, joinForm.uprofileImg!==index+1 && styles.disabled]} source={imgSource[index]} />
								</Button>
							)}
						</ScrollView>
					</FormControl>
					<FormControl isRequired style={{ flex: 1 }}>
						<FormControl.Label>Username</FormControl.Label>
						<Input 
							size="md"
							value={joinForm.username}
							onChangeText={(text) => setJoinForm({ ...joinForm, ['username']: text })}
							autoFocus
							autoCapitalize="none"
							returnKeyType={"next"}
						/>
					</FormControl>
					<FormControl isRequired style={{ flex: 1 }}>
						<FormControl.Label>Select Your Language</FormControl.Label>
						<Select selectedValue={joinForm?.ulanguage} size="md" minWidth={200} accessibilityLabel="Select your language" placeholder="Select your language" onValueChange={itemValue => {
						setJoinForm({ ...joinForm, ['ulanguage']: itemValue })
					}} _selectedItem={{
						bg: "skyblue.500",
						endIcon: <CheckIcon size={5} />
					}} mt={1}>
							{/* Country code 3 digit ISO */}
							<Select.Item label="Chinese (Traditional)" value="zh-CN" />
							<Select.Item label="Chinese (Simplified)" value="zh-TW" />
							<Select.Item label="English" value="en" />
							<Select.Item label="Filipino" value="tl" />
							<Select.Item label="Japanese" value="ja" />
							<Select.Item label="Khmer" value="km" />
							<Select.Item label="Korean" value="ko" />
							<Select.Item label="Thai" value="th" />
							<Select.Item label="Vietnamese" value="vi" />
						</Select>
					</FormControl>
					<FormControl isRequired style={{ flex: 1 }}>
						<FormControl.Label>Number of Children</FormControl.Label>
						<Select selectedValue={childrenNumber} size="md" minWidth={200} accessibilityLabel="Select number of children" placeholder="Select number of children" onValueChange={itemValue => {
						setChildrenNumber(itemValue);
					}} _selectedItem={{
						bg: "skyblue.500",
						endIcon: <CheckIcon size={3} />
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
									value={joinForm?.uchildren && joinForm.uchildren[index]?.cname}
									onChangeText={(text) => handleChildren(index, text)}
									autoCapitalize="none"
									mb={2}
									InputRightElement={
										<Button bg={colors[index]?.hex} borderRadius="full" m={1} size="xs" height={childrenNumber==="1" ? "60%": "50%"}>
											&nbsp;
										</Button>
									}
								/>
							)}
						</ScrollView>
					</FormControl>
				</VStack>
				<Button size="lg" my={2} onPress={onJoinPressed}>
					Sign up
				</Button>
			</ScrollView>
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
		justifyContent: 'center'
	},
	profileImage: {
		width: 52,
		height: 52,
	},
	disabled: {
		opacity: 0.3
	}
});

