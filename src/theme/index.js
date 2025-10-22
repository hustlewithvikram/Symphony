import { useColorScheme } from "react-native";

export const baseColor = '#aa87ff';

/**
 * Converts hex → RGB
 */
const hexToRgb = (hex) => {
    const parsed = hex.replace('#', '');
    const bigint = parseInt(parsed, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
};

/**
 * Converts RGB → hex
 */
const rgbToHex = (r, g, b) => {
    const clamp = (x) => Math.max(0, Math.min(255, Math.round(x)));
    return (
        '#' +
        [clamp(r), clamp(g), clamp(b)]
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('')
    );
};

/**
 * Lightens or darkens a color (Material-inspired)
 */
const adjustColor = (hex, percent) => {
    const { r, g, b } = hexToRgb(hex);
    const factor = (100 + percent) / 100;
    return rgbToHex(r * factor, g * factor, b * factor);
};

/**
 * Generate Material-style color palette from one base color
 */
export const generateMaterialShades = (baseColor) => {
    const shades = {
        50: adjustColor(baseColor, 80),
        100: adjustColor(baseColor, 60),
        200: adjustColor(baseColor, 40),
        300: adjustColor(baseColor, 20),
        400: adjustColor(baseColor, 10),
        500: baseColor,
        600: adjustColor(baseColor, -10),
        700: adjustColor(baseColor, -20),
        800: adjustColor(baseColor, -30),
        900: adjustColor(baseColor, -40),

        // Accents
        A100: adjustColor(baseColor, 25),
        A200: adjustColor(baseColor, 15),
        A400: adjustColor(baseColor, -10),
        A700: adjustColor(baseColor, -25),
    };

    return shades;
};

/**
 * Material You-inspired color roles with dark/light adaptation
 */
export const materialColorVars = (palette, isDark = false) => {
    // Base colors that adapt to theme
    const surface = isDark ? '#121212' : '#ffffff';
    const onSurface = isDark ? '#e6e1e5' : '#1c1b1f';
    const background = isDark ? '#121212' : '#f9f9f9';
    const inverseSurface = isDark ? '#e6e1e5' : '#2f2f2f';
    const inverseOnSurface = isDark ? '#1c1b1f' : '#f2f2f2';

    return {
        // --- Primary group
        primary: palette[500],
        onPrimary: isDark ? '#000000' : '#ffffff',
        primaryContainer: isDark ? palette[200] : palette[100],
        onPrimaryContainer: isDark ? palette[900] : palette[800],

        // --- Secondary group
        secondary: palette[600],
        onSecondary: isDark ? '#000000' : '#ffffff',
        secondaryContainer: isDark ? palette[800] : palette[100],
        onSecondaryContainer: isDark ? palette[100] : palette[800],

        // --- Tertiary group
        tertiary: palette[400],
        onTertiary: isDark ? '#000000' : '#ffffff',
        tertiaryContainer: isDark ? palette[800] : palette[100],
        onTertiaryContainer: isDark ? palette[100] : palette[800],

        // --- Neutral & Neutral Variant
        neutral: isDark ? '#9E9E9E' : '#757575',
        neutralVariant: isDark ? '#BDBDBD' : '#9E9E9E',
        surface: surface,
        surfaceVariant: isDark ? '#2d2a32' : '#f3f3f3',
        surfaceContainer: isDark ? '#1e1a22' : '#fafafa',
        onSurface: onSurface,
        onSurfaceVariant: isDark ? '#cac4d0' : '#49454f',

        // --- Background
        background: background,
        onBackground: onSurface,

        // --- Error
        error: isDark ? '#f2b8b5' : '#B3261E',
        onError: isDark ? '#601410' : '#ffffff',
        errorContainer: isDark ? '#8c1d18' : '#f2b8b5',
        onErrorContainer: isDark ? '#f9dedc' : '#601410',

        // --- Outlines & Shadows
        outline: isDark ? palette[700] : palette[300],
        outlineVariant: isDark ? palette[800] : palette[200],
        shadow: isDark ? '#000000' : palette[900],
        scrim: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.32)',

        // --- Inverse colors
        inverseSurface: inverseSurface,
        inverseOnSurface: inverseOnSurface,
        inversePrimary: isDark ? palette[400] : palette[700],

        // --- Gradual scales
        primaryLight: palette[200],
        primaryDark: palette[700],
        primaryA100: palette.A100,
        primaryA400: palette.A400,

        // Text colors
        text: isDark ? '#ffffff' : '#000000',
        textWhite: '#ffffff',
        textWhiteDark: isDark ? '#ffffff' : '#3C3C3C',
        textDark: isDark ? '#e6e1e5' : '#000000',
        textGray: isDark ? '#b0b0b0' : 'gray',

        // normal colors
        black: '#000000',
        white: '#ffffff',

        // white shades
        powderWhite: '#FBFCFA',

        // Additional semantic colors
        success: isDark ? '#81c995' : '#2e7d32',
        warning: isDark ? '#ffb74d' : '#f57c00',
        info: isDark ? '#4fc3f7' : '#0288d1',
    };
};

/**
 * Generate a complete color system (multiple key palettes)
 */
export const createColorSystem = (base = '#6750A4', isDark = false) => {
    const primary = generateMaterialShades(base);
    const secondary = generateMaterialShades(adjustColor(base, -30));
    const tertiary = generateMaterialShades(adjustColor(base, 30));

    return {
        primary,
        secondary,
        tertiary,
        material: {
            ...materialColorVars(primary, isDark),
            secondary: secondary[500],
            tertiary: tertiary[400],
        },
    };
};

/**
 * Unified theme hook that adapts to system dark/light mode
 */
export const useAppTheme = (baseColor = '#6750A4') => {
    const colorScheme = useColorScheme(); // 'light' | 'dark' | null
    const isDark = colorScheme === 'dark';

    const colorSystem = createColorSystem(baseColor, isDark);

    return {
        colors: colorSystem.material,
        palettes: {
            primary: colorSystem.primary,
            secondary: colorSystem.secondary,
            tertiary: colorSystem.tertiary,
        },
        // Theme metadata
        isDark,
        scheme: colorScheme,
        // Spacing (you can customize these)
        spacing: {
            xs: 4,
            sm: 8,
            md: 16,
            lg: 24,
            xl: 32,
            xxl: 48,
        },
        // Typography (you can customize these)
        typography: {
            heading: {
                fontSize: 24,
                fontWeight: 'bold',
                color: colorSystem.material.onSurface,
            },
            body: {
                fontSize: 16,
                color: colorSystem.material.onSurface,
            },
            caption: {
                fontSize: 12,
                color: colorSystem.material.onSurfaceVariant,
            },
        },
        // Border radius
        borderRadius: {
            sm: 4,
            md: 8,
            lg: 12,
            xl: 16,
            round: 9999,
        },
        // Shadows
        shadows: {
            sm: {
                shadowColor: colorSystem.material.shadow,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 1,
            },
            md: {
                shadowColor: colorSystem.material.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 3,
            },
            lg: {
                shadowColor: colorSystem.material.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
            },
        },
    };
};

// Optional: Export a default theme for use outside of components
export const getDefaultTheme = (baseColor = '#6750A4', isDark = false) => {
    const colorSystem = createColorSystem(baseColor, isDark);

    return {
        colors: colorSystem.material,
        palettes: colorSystem,
        isDark,
        spacing: {
            xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
        },
        borderRadius: {
            sm: 4, md: 8, lg: 12, xl: 16, round: 9999,
        },
    };
};
