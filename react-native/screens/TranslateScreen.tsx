import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../core/theme';
import type { Navigation } from '../types';
import AppLoading from 'expo-app-loading';
import useFonts from '../hooks/useFonts'
import SwipeUpDown from 'react-native-swipe-up-down';
import BottomDrawer from '../components/BottomDrawer';

/* TODO:
	- 스크롤 내려가게 하기 (지금은 ScrollView의 스크롤이 안 먹음)
	- low highlight 주기 (지금은 텍스트 높이만큼 background에 색 줘서 highlight)
*/ 

export default function TranslateScreen({ navigation }: Navigation) {
	const [hasPermission, setHasPermission] = useState<boolean>(false);
	const [fontsLoaded, SetFontsLoaded] = useState<boolean>(false);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [camera, setCamera] = useState<any>(null);
	const [imageUri, setImageUri] = useState("");
	const [results, setResults] = useState<{"content": string; "highlight": boolean}[]>();

	const [fullText, setFullText] = useState<{"translated": string; "korean": string}>();
	const [showFullText, setShowFullText] = useState<boolean>(false);
	const [showTranslated, setShowTranslated] = useState<boolean>(true);
	const [isFullDrawer, setFullDrawer] = useState<boolean>(false);

	const LoadFontsAndRestoreToken = async () => {
		await useFonts();
	};

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
		extractText
	}, []);

	// if (hasPermission === null) {
	// 	return <View />;
	// }
	// else if (hasPermission === false) {
	// 	return <Text>No access to camera!</Text>
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
			console.log(data.uri);
			setImageUri(data.uri);
		}
	};

	const extractText = (): void => {
		// TODO: api
		// TEST
		setResults([
			{"content": "Buy Suyeon a delicious meal.", "highlight": false},
			{"content": "The graduation ceremony will be held in the auditorium at 2 p.m. on February 14th.", "highlight": true},
		]);
		setFullText({ 
			"translated": "You have to buy Suyeon a delicious meal. Hee is writing ... The graduation ceremony will be held in the auditorium at 2 p.m. on February 14th. We look forward to your involvement! You have to buy Suyeon a delicious meal. Hee is writing ... The graduation ceremony will be held in the auditorium at 2 p.m. on February 14th. We look forward to your involvement! You have to buy Suyeon a delicious meal. Hee is writing ... The graduation ceremony will be held in the auditorium at 2 p.m. on February 14th. We look forward to your involvement!", 
			"korean": "수연이에게 맛있는 밥을 사야합니다. 희가 쓰는 중... 졸업식은 2월 14일에 강당에서 열릴 예정입니다. 많은 참여 부탁드립니다!" 
		});
	}
	
	const handleFullText = (): void => {
		setShowFullText(!showFullText);
	}

	const saveResults = (): void => {
		// TODO: api
		alert('saved');
	}

	const handleTranslatedText = (): void => {
		setShowTranslated(!showTranslated);
	}

	const closeResults = (): void => {
		navigation.navigate('Home');
	}

	const retakePicture = (): void => {
		setImageUri('');
		setResults([]);
		setFullText({ "translated": "", "korean": "" });
		setShowFullText(false);
	}

	return (
		<View style={styles.container}>
			{/* After taking a picture */}
			{imageUri ? (
				/* After taking a picture and press the check button */
				results && results.length > 0 ? (
					<ImageBackground style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.5 }} source={{ uri: imageUri }}>
						<SwipeUpDown
							itemMini={
								<BottomDrawer 
									results={results}
									fullText={fullText} 
									showFullText={showFullText}
									showTranslated={showTranslated}
									isFullDrawer={isFullDrawer}
									save={true}
									handleFullText={handleFullText}
									saveResults={saveResults}
									handleTranslatedText={handleTranslatedText}
									closeResults={closeResults}
									retakePicture={retakePicture}
								/>
							}
							itemFull={
								<BottomDrawer 
									results={results}
									fullText={fullText} 
									showFullText={showFullText}
									showTranslated={showTranslated}
									isFullDrawer={isFullDrawer}
									save={true}
									handleFullText={handleFullText}
									saveResults={saveResults}
									handleTranslatedText={handleTranslatedText}
									closeResults={closeResults}
									retakePicture={retakePicture}
								/>
							}
							onShowMini={() => setFullDrawer(false)}
							onShowFull={() => setFullDrawer(true)}
							animation="easeInEaseOut"
							disableSwipeIcon
							extraMarginTop={10}
							swipeHeight={Dimensions.get('window').height*0.5}
						/>
					</ImageBackground>
				) : (
					/* After taking a picture, before OCR(pressing the check button) */
					<>
					<ImageBackground style={styles.camera} resizeMode="cover" source={{ uri: imageUri }} />
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={[styles.circleButton, styles.primaryBackground]} onPress={extractText}>
							<Ionicons name="checkmark-sharp" size={32} color='#fff' />
						</TouchableOpacity>
					</View>
					</>
				)
			) : (
				/* Before taking a picture, Camera ready */
				<>
				<Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
					<View style={styles.cameraContainer}>
						<TouchableOpacity
							style={styles.reverseButton}
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
				</Camera>
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={[styles.circleButton, styles.whiteBackground]} onPress={takePicture}>
							<View style={[styles.innerCircle, styles.whiteBackground]} />
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
	reverseButton: {
		flex: 0.1,
		alignSelf: 'flex-end',
		alignItems: 'center',
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
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
	}
}); 
