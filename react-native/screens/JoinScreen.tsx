import React, { useState, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, Alert, Platform, ScrollView, Image, GestureResponderEvent, View, TouchableHighlight, Dimensions } from 'react-native';
import { FormControl, Input, Button, VStack, Popover, Text, useToast, Box } from 'native-base';
import { Dropdown } from 'react-native-element-dropdown';
import { nameValidator } from '../core/utils';
import type { Navigation, UserData, JoinData } from '../types';
import { theme } from '../core/theme';
import { useAuth } from '../contexts/Auth';
import i18n from 'i18n-js'
import '../locales/i18n';
import useFonts from '../hooks/useFonts';
import AppLoading from 'expo-app-loading';


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
		uprofileImg: 0,
		username: '',
		ulanguage: '',
		uchildren: colors.map(color => ({ cname: '', cprofileImg: 1, color: color?.id }))
	})
	const [open, setOpen] = useState(-1);

	const [user, setUser] = useState<UserData>();
	const auth = useAuth();
	const toast = useToast();

	const [fontsLoaded, SetFontsLoaded] = useState<boolean>(false);
    const LoadFontsAndRestoreToken = async () => {
        await useFonts();
    };

	useEffect(() => {
		if (auth?.userData?.uroleType==='USER') {
			toast.show({    // Design according to mui toast guidelines (https://material.io/components/snackbars#anatomy)
				placement: "bottom",
				render: () => {
					return <Box bg="rgba(0,0,0,0.7)" p="4" rounded="xl" mx={2} shadow={2} alignItems="center">
							<Text color="white" fontSize="lg" mb={2}>🎉&nbsp; {i18n.t('loginSuccess')} &nbsp;🎉</Text>
							<Text color="white" textAlign="center">{i18n.t('loginSuccessText')}</Text>
						</Box>;
				}
			});
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
		// console.log(joinForm);
	}, [joinForm]);

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
		// console.log(array);
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
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} enabled keyboardVerticalOffset={80}>
			<ScrollView>
				<VStack space={4} style={{ flex: 8 }}>
					<FormControl isRequired style={{ flex: 1.2 }}>
						<FormControl.Label>{i18n.t('profileImage')}</FormControl.Label>
						<ScrollView horizontal={true}>
							{Array.from(Array(Number(7)).keys()).map((num, index) =>
								<Button key={'ub_'+index} variant="unstyled" onPress={handleProfileImg(index)}>
									<Image style={[styles.uprofileImage, joinForm.uprofileImg!==index && styles.disabled]} source={uProfileImgSource[index]} />
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
						<Dropdown
							style={styles.dropdown}
							placeholderStyle={styles.placeholderStyle}
							selectedTextStyle={styles.selectedTextStyle}
							inputSearchStyle={styles.inputSearchStyle}
							data={[
								{label: "中文", value: "zh"},
								{label: "English", value: "en"},
								{label: "日本語", value: "ja"},
								{label: "ខ្មែរ", value: "km"},
								{label: "한국어", value: "ko"},
								{label: "ไทย", value: "th"},
								{label: "Tiếng Việt", value: "vi"},
							]}
							search
							maxHeight={236}
							labelField="label"
							valueField="value"
							placeholder={i18n.t('selectLang')}
							searchPlaceholder="Search..."
							value={joinForm?.ulanguage}
							onChange={item => {
								setJoinForm({ ...joinForm, ['ulanguage']: item.value })
							}}
						/>
					</FormControl>
					<FormControl isRequired style={{ flex: 1 }}>
						<FormControl.Label>{i18n.t('childrenNum')}</FormControl.Label>
						<Dropdown
							style={styles.dropdown}
							placeholderStyle={styles.placeholderStyle}
							selectedTextStyle={styles.selectedTextStyle}
							inputSearchStyle={styles.inputSearchStyle}
							data={[
								{label: "1", value: "1"},
								{label: "2", value: "2"},
								{label: "3", value: "3"},
								{label: "4", value: "4"},
								{label: "5", value: "5"},
								{label: "6", value: "6"},
							]}
							maxHeight={185}
							labelField="label"
							valueField="value"
							placeholder={i18n.t('childrenNum')}
							searchPlaceholder="Search..."
							value={childrenNumber}
							onChange={item => {
								setChildrenNumber(item.value)
							}}
						/>
					</FormControl>
					<FormControl isRequired style={{ flex: 3 }}>
						<FormControl.Label>{i18n.t('childrenName')}</FormControl.Label>
						<ScrollView style={{height: 170 }}>
							{Array.from(Array(Number(childrenNumber)).keys()).map((child, index) => 
								<Input 
									key={'i_'+child}
									size="md"
									variant="underlined"
									value={joinForm?.uchildren && joinForm.uchildren[child]?.cname}
									onChangeText={(text) => handleChildrenName(child, text)}
									autoCapitalize="none"
									mb={2}
									InputRightElement={
										<Popover 
										key={'p_'+child}
										isOpen={open===child}
										onOpen={() => setOpen(child)}                                 
										onClose={() => setOpen(-1)}
										trigger={triggerProps => {
											return <Button {...triggerProps} variant="unstyled" onPress={() => setOpen(child)}>
												{joinForm && joinForm.uchildren &&
													<Image style={[styles.cprofileImage]} source={cProfileImgSource[joinForm.uchildren[child]?.cprofileImg]} />
												}
											</Button>
										}}
										>
											<View style={styles.shadow}>
												<Popover.Content accessibilityLabel="Profile Image" w="90%">
													<Popover.Body key={'pb_'+child}>
														<FormControl isRequired style={{ flex: 1.2 }}>
															<FormControl.Label>{i18n.t('profileImage')}</FormControl.Label>
															<ScrollView horizontal={true}>
																{Array.from(Array(Number(9)).keys()).map((num, i) =>
																	<Button key={'cb_'+num} variant="unstyled" onPress={handleChildrenProfileImg(child, num)}>
																		{joinForm && joinForm.uchildren && 
																			<Image style={[styles.uprofileImage, joinForm?.uchildren[child]?.cprofileImg!==num && styles.disabled]} source={cProfileImgSource[num]} />
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
			</ScrollView>
			<TouchableHighlight style={styles.startButton} onPress={onJoinPressed}>
				<Text fontWeight={600} style={styles.buttonStyle}>
					{i18n.t("signUp")}
				</Text>
			</TouchableHighlight>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: "5%",
		paddingVertical: 30,
		backgroundColor: theme.colors.background,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignContent: 'space-between'
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
	},
	dropdown: {
		height: 38,
		borderColor: '#e5e5e5',
		borderWidth: 0.6,
		borderRadius: 5,
		paddingHorizontal: 8,
		marginTop: 1
	},
	label: {
		position: 'absolute',
		backgroundColor: 'white',
		left: 22,
		top: 8,
		zIndex: 999,
		paddingHorizontal: 8,
		fontSize: 14,
		fontFamily: 'Lora_400Regular',
	},
	placeholderStyle: {
		fontSize: 14,
		fontFamily: 'Lora_400Regular',
		color: '#a3a3a3'
	},
	selectedTextStyle: {
		fontSize: 14,
		fontFamily: 'Lora_400Regular',
	},
	inputSearchStyle: {
		height: 36,
		fontSize: 14,
		fontFamily: 'Lora_400Regular',
	},
	startButton: {
		backgroundColor: theme.colors.primary,
		padding: 10,
		borderRadius: 8,
		marginTop: 20,
		position: "absolute",
		bottom: Dimensions.get('window').height / Dimensions.get('window').width > 2 ? 60 : 30,
		width: "100%",
		alignSelf: "center"
	},
	buttonStyle: {
		textAlign: "center",
		color: "white",
	},
});

