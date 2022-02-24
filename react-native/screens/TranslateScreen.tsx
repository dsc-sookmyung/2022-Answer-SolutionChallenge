import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableHighlight, ImageBackground, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { theme } from '../core/theme';
import type { Navigation } from '../types';
import AppLoading from 'expo-app-loading';
import useFonts from '../hooks/useFonts'


const NO_WIDTH_SPACE = '​';
const highlight = (text: string) =>
  text.split(' ').map((word, i) => (
    <Text key={i}>
      <Text style={styles.highlighted}>{word} </Text>
      {NO_WIDTH_SPACE}
    </Text>
  ));

export default function TranslateScreen({ navigation }: Navigation) {
	const [hasPermission, setHasPermission] = useState<boolean>(false);
	const [fontsLoaded, SetFontsLoaded] = useState<boolean>(false);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [camera, setCamera] = useState<any>(null);
	const [imageUri, setImageUri] = useState("");
	const [results, setResults] = useState<{"content": string; "underline": boolean}[]>();
	const [fullText, setFullText] = useState<{"translated": string; "korean": string}>();
	const [showFullText, setShowFullText] = useState<boolean>(false);
	const [showTranslated, setShowTranslated] = useState<boolean>(true);
	const [panelProps, setPanelProps] = useState({
		fullWidth: true,
		openLarge: false,
		onlyLarge: false,
		smallPanelHeight: Dimensions.get('window').height*0.6,
		onClose: () => {}
	})
	const [loaded, setLoaded] = useState<number>(0);

	const LoadFontsAndRestoreToken = async () => {
    await useFonts();
  };

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	if (hasPermission === null) {
		return <View />;
	}
	else if (hasPermission === false) {
		return <Text>No access to camera!</Text>
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

	const takePicture = async () => {
		if (camera) {
			const data = await camera.takePictureAsync(null);
			console.log(data.uri);
			setImageUri(data.uri);
		}
	};

	const extractText = () => {
		// TODO: api
		// TEST
		setResults([
			{"content": "Buy Suyeon a delicious meal.", "underline": false},
			{"content": "The graduation ceremony will be held in the auditorium at 2 p.m. on February 14th.", "underline": true},
		]);
		setFullText({ 
			"translated": "You have to buy Suyeon a delicious meal. Hee is writing ... The graduation ceremony will be held in the auditorium at 2 p.m. on February 14th. We look forward to your involvement! You have to buy Suyeon a delicious meal. Hee is writing ... The graduation ceremony will be held in the auditorium at 2 p.m. on February 14th. We look forward to your involvement! You have to buy Suyeon a delicious meal. Hee is writing ... The graduation ceremony will be held in the auditorium at 2 p.m. on February 14th. We look forward to your involvement!", 
			"korean": "수연이에게 맛있는 밥을 사야합니다. 희가 쓰는 중... 졸업식은 2월 14일에 강당에서 열릴 예정입니다. 많은 참여 부탁드립니다!" 
		});
	}

	const handleFullText = () => {
		setShowFullText(!showFullText);
		setPanelProps({...panelProps, openLarge: !panelProps.openLarge, onlyLarge: !panelProps.onlyLarge});
		// setPanelProps({...panelProps, onlyLarge: !panelProps.onlyLarge});
	}

	const saveResults = () => {
		// TODO: api
		console.log("save");
		alert('saved');
	}

	const handleTranslatedText = () => {
		setShowTranslated(!showTranslated);
	}

	const closeResults = () => {
		navigation.navigate('Home');
	}

	const retakePicture = () => {
		setImageUri('');
		setResults([]);
		setFullText({ "translated": "", "korean": "" });
		setShowFullText(false);
		setPanelProps({...panelProps, openLarge: false});
	}

	return (
		<View style={styles.container}>
			{/* After taking a picture */}
			{imageUri ? (
				/* After taking a picture and press the check button */
				results && results.length > 0 ? (
					<ImageBackground style={styles.container} resizeMode="cover" source={{ uri: imageUri }}>
						<SwipeablePanel {...panelProps} isActive={true}>
							<View style={styles.bottomDrawer}>
								<View style={{ flex: 1 }}>
									<View style={styles.spaceBetween}>
										<Text style={styles.title}>{showFullText ? "Full Text" : "Results"}</Text>
										{!showFullText ? (
											<View style={styles.alignRow}>
												<TouchableOpacity style={styles.rightSpace} onPress={handleFullText}>
													<Entypo name="text" size={32} color="#000"/>
												</TouchableOpacity>
												<TouchableOpacity onPress={saveResults}>
													<FontAwesome name="save" size={32} color='#000' />
												</TouchableOpacity>
											</View>
										) : (
											<TouchableOpacity style={styles.rightSpace} onPress={handleTranslatedText}>
												<MaterialIcons name="translate" size={32} color="#000"/>
											</TouchableOpacity>
										)}
									</View>
									
									<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
										{!showFullText ? (
											results.map((result, index) => 
												<Text key={result.content} style={styles.content}>
													{index+1}.&nbsp; 
													{result.underline ? (
														highlight(result.content)
													) : (
														result.content
													)}
												</Text>
											)
										) : (
											showTranslated ? (
												<Text style={styles.content}>{fullText?.translated}</Text>
											) : (
												<Text style={styles.content}>{fullText?.korean}</Text>
											)
										)}
									</ScrollView>
								</View>
								<View style={[styles.spaceBetween, { marginBottom: 16 }]}>
									{!showFullText ? (
										<TouchableHighlight style={[styles.regularButton, styles.grayBackground]} onPress={closeResults}>
											<Text style={styles.whiteText}>Close</Text>
										</TouchableHighlight>
									) : (
											<TouchableHighlight style={[styles.regularButton, styles.grayBackground]} onPress={handleFullText}>
												<Text style={styles.whiteText}>Back</Text>
											</TouchableHighlight>
									)}
									<View style={styles.gap} />
									<TouchableHighlight style={[styles.regularButton, styles.primaryBackground]} onPress={retakePicture}>
										<Text style={styles.whiteText}>Try again</Text>
									</TouchableHighlight>
								</View>
							</View>
						</SwipeablePanel>
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
	whiteText: {
		color: '#fff',
		fontSize: 16
	},
	whiteBackground: {
		backgroundColor: '#fff',
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
	innerCircle: {
		borderRadius: 48,
		padding: 8,
		height: 56,
		width: 56,
		borderWidth: 2
	},
	bottomDrawer: {
		flex: 1,
		height: Dimensions.get('window').height*0.5,
		flexDirection: 'column',
		alignContent: 'space-between',
		backgroundColor: theme.colors.background,
		borderTopLeftRadius: 48,
		borderTopRightRadius: 48,
		padding: 32
	},
	title: {
		fontFamily: 'Lora_700Bold',
		fontSize: 24,
		fontWeight: '700',
		color: theme.colors.primary,
	},
	content: {
		fontSize: 16,
		paddingBottom: 8
	},
	spaceBetween: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 24
	},
	alignRow: {
		flexDirection: 'row'
	},
	rightSpace: {
		paddingRight: 8
	},
	highlighted: {
		backgroundColor: theme.colors.skyblue
	}
}); 