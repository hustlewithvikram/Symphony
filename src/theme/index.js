// src/theme/index.js
import { useColorScheme } from 'react-native';
import { LightTheme } from './light';
import { DarkTheme } from './dark';

export const useAppTheme = () => {
    const scheme = useColorScheme(); // detects system dark/light
    return scheme === 'dark' ? DarkTheme : LightTheme;
};

// direct exports (for ThemeProvider or manual theme switching)
export const AppTheme = {
    light: LightTheme,
    dark: DarkTheme,
};
