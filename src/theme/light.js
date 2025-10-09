// src/theme/light.js
import { baseColor } from './colors';
import { generateMaterialShades, materialColorVars } from './colors';

const palette = generateMaterialShades(baseColor);

export const LightTheme = {
    mode: 'light',
    colors: {
        ...materialColorVars(palette, 'light'),
        ...palette, // optional direct access (50–900, A100–A700)
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
    },
};
