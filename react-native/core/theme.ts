import { DefaultTheme } from 'react-native-paper';
import { extendTheme } from 'native-base';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
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

export const nativeBaseTheme = extendTheme({
  colors: {
    primary: {
      500: '#333D79',
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
  }
})