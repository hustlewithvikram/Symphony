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
 * Material You-inspired color roles
 */
export const materialColorVars = (palette) => ({
    // --- Primary group
    primary: palette[500],
    onPrimary: '#ffffff',
    primaryContainer: palette[100],
    onPrimaryContainer: palette[900],

    // --- Secondary group
    secondary: palette[600],
    onSecondary: '#ffffff',
    secondaryContainer: palette[100],
    onSecondaryContainer: palette[800],

    // --- Tertiary group
    tertiary: palette[400],
    onTertiary: '#ffffff',
    tertiaryContainer: palette[100],
    onTertiaryContainer: palette[800],

    // --- Neutral & Neutral Variant
    neutral: '#9E9E9E',
    neutralVariant: '#BDBDBD',
    surface: '#ffffff',
    surfaceVariant: '#f3f3f3',
    surfaceContainer: '#fafafa',
    onSurface: '#1c1b1f',
    onSurfaceVariant: '#49454f',

    // --- Background
    background: '#f9f9f9',
    onBackground: '#1c1b1f',

    // --- Error
    error: '#B3261E',
    onError: '#ffffff',
    errorContainer: '#f2b8b5',
    onErrorContainer: '#601410',

    // --- Outlines & Shadows
    outline: palette[300],
    outlineVariant: palette[200],
    shadow: palette[900],
    scrim: 'rgba(0, 0, 0, 0.32)',

    // --- Inverse colors
    inverseSurface: '#2f2f2f',
    inverseOnSurface: '#f2f2f2',
    inversePrimary: palette[700],

    // --- Gradual scales
    primaryLight: palette[200],
    primaryDark: palette[700],
    primaryA100: palette.A100,
    primaryA400: palette.A400,

    // text color
    text: '#ffffff',
    textWhiteDark: '#3C3C3C00',
    textDark: '#000000',
    textGray: 'gray',
});

/**
 * Generate a complete color system (multiple key palettes)
 */
export const createColorSystem = (base = '#6750A4') => {
    const primary = generateMaterialShades(base);
    const secondary = generateMaterialShades(adjustColor(base, -30));
    const tertiary = generateMaterialShades(adjustColor(base, 30));

    return {
        primary,
        secondary,
        tertiary,
        material: {
            ...materialColorVars(primary),
            secondary: secondary[500],
            tertiary: tertiary[400],
        },
    };
};
