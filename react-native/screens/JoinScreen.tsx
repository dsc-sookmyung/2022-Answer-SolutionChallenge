import React, { useState, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, Alert, Platform, ScrollView, Image, GestureResponderEvent, View } from 'react-native';
import { FormControl, Input, Button, VStack, Select, CheckIcon, Popover } from 'native-base';
import { nameValidator } from '../core/utils';
import type { Navigation, UserData, JoinData } from '../types';
import { theme } from '../core/theme';
import { useAuth } from '../contexts/Auth';
import i18n from 'i18n-js'
import '../locales/i18n';


export default function JoinScreen({ navigation }: Navigation) {
	const [childrenNumber, setChildrenNumber] = useState<string>('1');
	const uProfileImgSource = [require(`../assets/images/profile-images/profile-1.png`), require(`../assets/images/profile-images/profile-2.png`), require(`../assets/images/profile-images/profile-3.png`),
	require(`../assets/images/profile-images/profile-4.png`), require(`../assets/images/profile-images/profile-5.png`), require(`../assets/images/profile-images/profile-6.png`), require(`../assets/images/profile-images/profile-7.png`)];
	const cProfileImgSource = [require(`../assets/images/cprofile-images/profile-1.png`), require(`../assets/images/cprofile-images/profile-2.png`), require(`../assets/images/cprofile-images/profile-3.png`),
	require(`../assets/images/cprofile-images/profile-4.png`), require(`../assets/images/cprofile-images/profile-5.png`), require(`../assets/images/cprofile-images/profile-6.png`), require(`../assets/images/cprofile-images/profile-7.png`), require(`../assets/images/cprofile-images/profile-8.png`), require(`../assets/images/cprofile-images/profile-9.png`)];
	const colors = [{id: 1, hex: '#7986cb'}, {id: 3, hex: '#8e24aa'}, {id: 4, hex: '#e67c73'}, {id: 5, hex: '#f6bf26'}, {id: 7, hex: '#039be5'}, {id: 10, hex: '#0b8043'}]
	// 1 3 4 5 7 10
	const [joinForm, setJoinForm] = useState<JoinData>({
		uid: undefined,
		uprofileImg: 1,
		username: '',
		ulanguage: '',
		uchildren: colors.map(color => ({'cname': '', 'cprofileImg': 1, 'color': color?.id}))
	})
	const [open, setOpen] = useState(-1);

	const [user, setUser] = useState<UserData>();
	const auth = useAuth();

	useEffect(() => {
		if (auth?.userData?.uroleType==='USER') {
			Alert.alert(
				i18n.t('loginSuccess'),
				i18n.t('loginSuccessText')
			)
			navigation.navigate('Home');
		}
		else if (auth?.userData?.uroleType==='GUEST') {
			setUser(auth?.userData);
		}
	}, [auth?.userData]);

	useEffect(() => {
		if (user?.username) {
			setJoinForm({ ...joinForm, ['username']: user.username });
		}
	}, [user]);

	useEffect(() => {
		//console.log(joinForm);
	}, [joinForm])

	const errorAlert = (error: string) =>
		Alert.alert(                    
			i18n.t('joinFailed'),                 
			error,                      
			[
				{ text: "OK", onPress: () => console.log("OK Pressed") }
			]
		);

	const handleProfileImg = (profileType: number) => (event: GestureResponderEvent) => {
		setJoinForm({ ...joinForm, ['uprofileImg']: profileType });
	}

	const handleChildrenName = (childNum: number, value: string) => {
		let array = joinForm?.uchildren;
		if (array) {
			array[childNum].cname = value;
		}
		setJoinForm({ ...joinForm, ['uchildren']: array });	
	}

	const handleChildrenProfileImg = (childNum: number,value: number) => (event: GestureResponderEvent) => {
		let array = joinForm?.uchildren;
		console.log(array);
		if (array) {
			array[childNum].cprofileImg = value;
			setOpen(-1);
		}
		setJoinForm({ ...joinForm, ['uchildren']: array });
	}

	const onJoinPressed = () => {
		if (user && joinForm) {
			joinForm.uid = user?.uid;

			let childrenArr = joinForm?.uchildren;
			childrenArr = childrenArr?.slice(0, Number(childrenNumber));

			const usernameError = nameValidator(joinForm.username);
			const childrenNameError = childrenArr?.some(child => child.cname === '');
	
			if (usernameError || childrenNameError || !joinForm.ulanguage) {
				errorAlert(i18n.t('fillAlarm'));
				return;
			}
	
			joinForm.uchildren = childrenArr;
			
			auth.signUp(joinForm);
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} enabled keyboardVerticalOffset={100}>
			<ScrollView>
				<VStack space={4} style={{ flex: 1 }}>
					<FormControl isRequired style={{ flex: 1.2 }}>
						<FormControl.Label>{i18n.t('profileImage')}</FormControl.Label>
						<ScrollView horizontal={true}>
							{Array(7).fill(1).map((num, index) =>
								<Button key={'b_'+index} variant="unstyled" onPress={handleProfileImg(index+1)}>
									<Image style={[styles.uprofileImage, joinForm.uprofileImg!==index+1 && styles.disabled]} source={uProfileImgSource[index]} />
								</Button>
							)}
						</ScrollView>
					</FormControl>
					<FormControl isRequired style={{ flex: 1 }}>
						<FormControl.Label>{i18n.t('username')}</FormControl.Label>
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
						<FormControl.Label>{i18n.t('selectLang')}</FormControl.Label>
						<Select selectedValue={joinForm?.ulanguage} size="md" minWidth={200} accessibilityLabel="Select your language" placeholder="Select your language" onValueChange={itemValue => {
						setJoinForm({ ...joinForm, ['ulanguage']: itemValue })
					}} _selectedItem={{
						bg: "skyblue.500",
						endIcon: <CheckIcon size={5} />
					}} mt={1}>
							{/* Country code 3 digit ISO */}
							<Select.Item label="Chinese" value="zh" />
							<Select.Item label="English" value="en" />
							<Select.Item label="Japanese" value="ja" />
							<Select.Item label="Khmer" value="km" />
							<Select.Item label="Korean" value="ko" />
							<Select.Item label="Thai" value="th" />
							<Select.Item label="Vietnamese" value="vi" />
						</Select>
					</FormControl>
					<FormControl isRequired style={{ flex: 1 }}>
						<FormControl.Label>{i18n.t('childrenNum')}</FormControl.Label>
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
						<FormControl.Label>{i18n.t('childrenName')}</FormControl.Label>
						<ScrollView style={{height: '100%'}}>
							{Array(Number(childrenNumber)).fill(1).map((child, index) => 
								<Input 
									key={'i_'+index}
									size="md"
									variant="underlined"
									value={joinForm?.uchildren && joinForm.uchildren[index]?.cname}
									onChangeText={(text) => handleChildrenName(index, text)}
									autoCapitalize="none"
									mb={2}
									InputRightElement={
										<Popover 
										isOpen={open===index}
										onOpen={() => setOpen(index)}                                 
										onClose={() => setOpen(-1)}
										trigger={triggerProps => {
											return <Button {...triggerProps} variant="unstyled" onPress={() => setOpen(index)}>
												{joinForm && joinForm.uchildren && 
													<Image style={[styles.cprofileImage]} source={cProfileImgSource[joinForm?.uchildren[index]?.cprofileImg-1]} />
												}
											</Button>
										}}
										>
											<View style={styles.shadow}>
												<Popover.Content accessibilityLabel="Profile Image" w="90%">
													<Popover.Body>
														<FormControl isRequired style={{ flex: 1.2 }}>
															<FormControl.Label>{i18n.t('profileImage')}</FormControl.Label>
															<ScrollView horizontal={true}>
																{Array(7).fill(1).map((num, i) =>
																	<Button key={'b_'+i} variant="unstyled" onPress={handleChildrenProfileImg(index, i+1)}>
																		{joinForm && joinForm.uchildren && 
																			<Image style={[styles.uprofileImage, joinForm?.uchildren[index]?.cprofileImg!==i+1 && styles.disabled]} source={cProfileImgSource[i]} />
																		}
																	</Button>
																)}
															</ScrollView>
														</FormControl>
													</Popover.Body>
												</Popover.Content>
											</View>
										</Popover>
									}
								/>
							)}
						</ScrollView>
					</FormControl>
				</VStack>
				<Button size="lg" my={2} onPress={onJoinPressed}>
					{i18n.t('signUp')}
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
	uprofileImage: {
		width: 52,
		height: 52,
	},
	cprofileImage: {
		width: 32,
		height: 32,
	},
	disabled: {
		opacity: 0.3
	},
	shadow: {
		shadowColor: "#999999",
        shadowOpacity: 0.5,
        shadowRadius: 8,
        shadowOffset: {
          height: 0,
          width: 0,
        },
	}
});

