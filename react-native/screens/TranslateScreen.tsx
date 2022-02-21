import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../core/theme';

export default function TranslateScreen() {
	const [hasPermission, setHasPermission] = useState<boolean>(false);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [camera, setCamera] = useState<any>(null);
	const [imageUri, setImageUri] = useState("");

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

	const takePicture = async () => {
		if (camera) {
			const data = await camera.takePictureAsync(null);
			console.log(data.uri);
			setImageUri(data.uri);
		}
	};

	const retakePicture = () => {
		setImageUri("");
	}

	return (
		<View style={styles.container}>
			{imageUri ? (
				<>
				<ImageBackground style={styles.camera} resizeMode="cover" source={{ uri: imageUri }} />
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.captureButton} onPress={retakePicture}>
						<Ionicons name="refresh" size={64} color="white" />
					</TouchableOpacity>
				</View>
				</>
			) : (
				<>
				<Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
					<View style={styles.cameraContainer}>
							<TouchableOpacity
								style={styles.button}
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
					<TouchableOpacity style={styles.captureButton} onPress={takePicture}>
							<Ionicons name="camera-outline" size={64} color="white" />
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
	button: {
		flex: 0.1,
		alignSelf: 'flex-end',
		alignItems: 'center',
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	captureButton: {
		backgroundColor: theme.colors.primary,
		borderRadius: 48,
		padding: 8
	}
}); 