import { extendTheme } from 'native-base';

/* StyleSheet */
export const theme = {
  colors: {
    primary: '#333D79',
    secondary: '#FAEBEF',
    text: '#343a40',
    surface: '#fafafa',
    background: '#fafafa',
    error: '#f13a59',
    coral: '#FF6B6B',
    skyblue: '#D0E1FC',
    gray: '#dddddd',
  },
};

/* native-base */
export const nativeBaseTheme = extendTheme({
  colors: {
    primary: {
      500: '#333D79',
      400: '#333D79', // https://github.com/GeekyAnts/NativeBase/blob/v3.1.0/src/theme/components/input.ts
    },
    secondary: {
      500: '#FAEBEF',
    },
    text: {
      500: '#343a40',
    },
    surface: {
      500: '#fafafa',
    },
    background: {
      500: '#fafafa',
    },
    error: {
      500: '#f13a59',
    },
    coral: {
      500: '#FF6B6B',
    },
    skyblue: {
      500: '#D0E1FC',
    },
    gray: {
      500: '#dddddd',
    },
  },
  fontConfig: {
    Lora: {
      400: {
        normal: "Lora_400Regular",
        italic: "Lora_400Regular_Italic",
      },
      500: {
        normal: "Lora_500Medium",
        italic: "Lora_500Medium_Italic",
      },
      600: {
        normal: "Lora_600SemiBold",
        italic: "Lora_600SemiBold_Italic",
      },
      700: {
        normal: "Lora_700Bold",
        italic: "Lora_700Bold_Italic",
      }
    }
  },
  fonts: {
    heading: "Lora",
    body: "Lora",
    mono: "Lora",
  },
  components: {
    Button: {
      defaultProps: {
        _pressed: {
          bg: 'transparent'
        }
      }
    }
  }
})
