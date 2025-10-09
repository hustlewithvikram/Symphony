// src/theme/dark.js
import { baseColor } from './colors';
import { generateMaterialShades, materialColorVars } from './colors';

const palette = generateMaterialShades(baseColor);

export const DarkTheme = {
    mode: 'dark',
    colors: {
        ...materialColorVars(palette),

        // Dark-mode overrides for surfaces and backgrounds
        background: '#121212',
        surface: '#1E1E1E',
        surfaceVariant: '#2A2A2A',
        surfaceContainer: '#1A1A1A',

        onBackground: '#E4E4E4',
        onSurface: '#E4E4E4',
        onSurfaceVariant: '#BDBDBD',

        primary: palette[400],
        onPrimary: '#ffffff',
        primaryContainer: palette[700],
        onPrimaryContainer: '#E0E0E0',

        secondary: palette[300],
        onSecondary: '#000000',
        secondaryContainer: palette[600],
        onSecondaryContainer: '#EAEAEA',

        tertiary: palette[200],
        onTertiary: '#000000',
        tertiaryContainer: palette[500],
        onTertiaryContainer: '#EAEAEA',

        error: '#CF6679',
        onError: '#000000',

        outline: palette[600],
        outlineVariant: palette[500],
        shadow: '#000000',
        scrim: 'rgba(0, 0, 0, 0.5)',
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 40,
    },

    radius: {
        sm: 6,
        md: 12,
        lg: 20,
    },

    typography: {
        fontFamily: 'System',
        fontSize: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 20,
            xl: 24,
        },
    },
};
