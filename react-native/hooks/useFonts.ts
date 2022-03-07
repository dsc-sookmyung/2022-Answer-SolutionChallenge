import * as Font from 'expo-font';
import {
	Lora_400Regular,
	Lora_500Medium,
	Lora_600SemiBold,
	Lora_700Bold,
	Lora_400Regular_Italic,
	Lora_500Medium_Italic,
	Lora_600SemiBold_Italic,
	Lora_700Bold_Italic,
} from '@expo-google-fonts/lora';

const useFonts = async () => {
  await Font.loadAsync({
    Lora_400Regular,
		Lora_500Medium,
		Lora_600SemiBold,
		Lora_700Bold,
		Lora_400Regular_Italic,
		Lora_500Medium_Italic,
		Lora_600SemiBold_Italic,
		Lora_700Bold_Italic,
  });
};

export default useFonts;