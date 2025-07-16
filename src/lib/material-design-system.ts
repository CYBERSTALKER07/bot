/**
 * Google Material Design 3 (Material You) Design System
 * Following the latest Material Design 3 specifications
 */

// Material Design 3 Color System
export const materialColors = {
  // Primary colors (Your brand colors adapted to Material Design 3)
  primary: {
    0: '#000000',
    10: '#3D0013',
    20: '#5D0028',
    30: '#80003A', // ASU Maroon
    40: '#A1004F',
    50: '#C30064',
    60: '#E4207A',
    70: '#FF4C91',
    80: '#FF7BA9',
    90: '#FFD9E2',
    95: '#FFECF0',
    99: '#FFFBFF',
    100: '#FFFFFF',
  },
  
  // Secondary colors (ASU Gold adapted)
  secondary: {
    0: '#000000',
    10: '#2F1A00',
    20: '#4A2D00',
    30: '#664200',
    40: '#835800',
    50: '#A16F00',
    60: '#C0881A',
    70: '#DFA235',
    80: '#FFC627', // ASU Gold
    90: '#FFDF8A',
    95: '#FFEFB8',
    99: '#FFFBFF',
    100: '#FFFFFF',
  },
  
  // Tertiary colors (Lime accent adapted)
  tertiary: {
    0: '#000000',
    10: '#0F2000',
    20: '#1E3700',
    30: '#2E4F00',
    40: '#3F6800',
    50: '#518200',
    60: '#6B9D1A',
    70: '#86B935',
    80: '#A2D550',
    90: '#BFF26B',
    95: '#E3FF70', // Lime accent
    99: '#F6FFDF',
    100: '#FFFFFF',
  },
  
  // Error colors
  error: {
    0: '#000000',
    10: '#410002',
    20: '#690005',
    30: '#93000A',
    40: '#BA1A1A',
    50: '#DE3730',
    60: '#FF5449',
    70: '#FF897D',
    80: '#FFB4AB',
    90: '#FFDAD6',
    95: '#FFEDEA',
    99: '#FFFBFF',
    100: '#FFFFFF',
  },
  
  // Neutral colors
  neutral: {
    0: '#000000',
    4: '#0F0D11',
    6: '#141218',
    10: '#1D1B1E',
    12: '#211F22',
    17: '#2B292C',
    20: '#323034',
    22: '#36343A',
    24: '#3B383E',
    30: '#49454F',
    40: '#605D62',
    50: '#787579',
    60: '#939094',
    70: '#AEA9AC',
    80: '#CAC4C9',
    87: '#DDD8DC',
    90: '#E6E0E5',
    92: '#ECE6EA',
    94: '#F2EDF1',
    95: '#F5EFF7',
    96: '#F7F2FA',
    98: '#FBF8FD',
    99: '#FEFBFF',
    100: '#FFFFFF',
  },
  
  // Neutral variant colors
  neutralVariant: {
    0: '#000000',
    10: '#1D1A22',
    20: '#332F37',
    30: '#4A454E',
    40: '#625B66',
    50: '#7B737E',
    60: '#958D98',
    70: '#B0A7B3',
    80: '#CCC2CE',
    90: '#E8DEEA',
    95: '#F6ECF8',
    99: '#FEFBFF',
    100: '#FFFFFF',
  }
};

// Material Design 3 Typography System
export const materialTypography = {
  // Display styles
  displayLarge: {
    fontSize: '57px',
    lineHeight: '64px',
    letterSpacing: '-0.25px',
    fontWeight: '400',
  },
  displayMedium: {
    fontSize: '45px',
    lineHeight: '52px',
    letterSpacing: '0px',
    fontWeight: '400',
  },
  displaySmall: {
    fontSize: '36px',
    lineHeight: '44px',
    letterSpacing: '0px',
    fontWeight: '400',
  },
  
  // Headline styles
  headlineLarge: {
    fontSize: '32px',
    lineHeight: '40px',
    letterSpacing: '0px',
    fontWeight: '400',
  },
  headlineMedium: {
    fontSize: '28px',
    lineHeight: '36px',
    letterSpacing: '0px',
    fontWeight: '400',
  },
  headlineSmall: {
    fontSize: '24px',
    lineHeight: '32px',
    letterSpacing: '0px',
    fontWeight: '400',
  },
  
  // Title styles
  titleLarge: {
    fontSize: '22px',
    lineHeight: '28px',
    letterSpacing: '0px',
    fontWeight: '400',
  },
  titleMedium: {
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    fontWeight: '500',
  },
  titleSmall: {
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.1px',
    fontWeight: '500',
  },
  
  // Label styles
  labelLarge: {
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.1px',
    fontWeight: '500',
  },
  labelMedium: {
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.5px',
    fontWeight: '500',
  },
  labelSmall: {
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0.5px',
    fontWeight: '500',
  },
  
  // Body styles
  bodyLarge: {
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.25px',
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
    fontWeight: '400',
  },
};

// Material Design 3 Elevation System
export const materialElevation = {
  level0: 'none',
  level1: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
  level2: '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
  level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)',
  level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.30)',
  level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.30)',
};

// Material Design 3 Shape System
export const materialShape = {
  corner: {
    none: '0px',
    extraSmall: '4px',
    small: '8px',
    medium: '12px',
    large: '16px',
    extraLarge: '28px',
    full: '9999px',
  },
};

// Material Design 3 Motion System
export const materialMotion = {
  duration: {
    short1: '50ms',
    short2: '100ms',
    short3: '150ms',
    short4: '200ms',
    medium1: '250ms',
    medium2: '300ms',
    medium3: '350ms',
    medium4: '400ms',
    long1: '450ms',
    long2: '500ms',
    long3: '550ms',
    long4: '600ms',
    extraLong1: '700ms',
    extraLong2: '800ms',
    extraLong3: '900ms',
    extraLong4: '1000ms',
  },
  easing: {
    linear: 'linear',
    standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    standardDecelerate: 'cubic-bezier(0.0, 0.0, 0, 1.0)',
    standardAccelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
    emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
  },
};

// Material Design 3 State Layer Opacities
export const materialStateLayer = {
  hover: 0.08,
  focus: 0.12,
  pressed: 0.12,
  dragged: 0.16,
  selected: 0.12,
  activated: 0.12,
  disabled: 0.12,
};

// Material Design 3 Component Tokens
export const materialComponents = {
  // Button specifications
  button: {
    filled: {
      containerHeight: '40px',
      containerShape: materialShape.corner.full,
      containerElevation: materialElevation.level0,
      labelTextFont: materialTypography.labelLarge,
      stateLayerOpacity: materialStateLayer,
    },
    outlined: {
      containerHeight: '40px',
      containerShape: materialShape.corner.full,
      outlineWidth: '1px',
      labelTextFont: materialTypography.labelLarge,
      stateLayerOpacity: materialStateLayer,
    },
    text: {
      containerHeight: '40px',
      containerShape: materialShape.corner.full,
      labelTextFont: materialTypography.labelLarge,
      stateLayerOpacity: materialStateLayer,
    },
    elevated: {
      containerHeight: '40px',
      containerShape: materialShape.corner.full,
      containerElevation: materialElevation.level1,
      labelTextFont: materialTypography.labelLarge,
      stateLayerOpacity: materialStateLayer,
    },
    tonal: {
      containerHeight: '40px',
      containerShape: materialShape.corner.full,
      containerElevation: materialElevation.level0,
      labelTextFont: materialTypography.labelLarge,
      stateLayerOpacity: materialStateLayer,
    },
  },
  
  // Card specifications
  card: {
    filled: {
      containerShape: materialShape.corner.medium,
      containerElevation: materialElevation.level0,
      stateLayerOpacity: materialStateLayer,
    },
    elevated: {
      containerShape: materialShape.corner.medium,
      containerElevation: materialElevation.level1,
      stateLayerOpacity: materialStateLayer,
    },
    outlined: {
      containerShape: materialShape.corner.medium,
      outlineWidth: '1px',
      stateLayerOpacity: materialStateLayer,
    },
  },
  
  // Text Field specifications
  textField: {
    filled: {
      containerShape: `${materialShape.corner.extraSmall} ${materialShape.corner.extraSmall} 0px 0px`,
      containerHeight: '56px',
      labelTextFont: materialTypography.bodyLarge,
      inputTextFont: materialTypography.bodyLarge,
      supportingTextFont: materialTypography.bodySmall,
    },
    outlined: {
      containerShape: materialShape.corner.extraSmall,
      containerHeight: '56px',
      outlineWidth: '1px',
      labelTextFont: materialTypography.bodyLarge,
      inputTextFont: materialTypography.bodyLarge,
      supportingTextFont: materialTypography.bodySmall,
    },
  },
  
  // FAB specifications
  fab: {
    primary: {
      containerHeight: '56px',
      containerWidth: '56px',
      containerShape: materialShape.corner.large,
      containerElevation: materialElevation.level3,
      stateLayerOpacity: materialStateLayer,
    },
    small: {
      containerHeight: '40px',
      containerWidth: '40px',
      containerShape: materialShape.corner.medium,
      containerElevation: materialElevation.level3,
      stateLayerOpacity: materialStateLayer,
    },
    large: {
      containerHeight: '96px',
      containerWidth: '96px',
      containerShape: materialShape.corner.extraLarge,
      containerElevation: materialElevation.level3,
      stateLayerOpacity: materialStateLayer,
    },
    extended: {
      containerHeight: '56px',
      containerShape: materialShape.corner.large,
      containerElevation: materialElevation.level3,
      labelTextFont: materialTypography.labelLarge,
      stateLayerOpacity: materialStateLayer,
    },
  },
};

// Color scheme generation for light and dark modes
export const generateColorScheme = (isDark: boolean) => {
  if (isDark) {
    return {
      primary: materialColors.primary[80],
      onPrimary: materialColors.primary[20],
      primaryContainer: materialColors.primary[30],
      onPrimaryContainer: materialColors.primary[90],
      
      secondary: materialColors.secondary[80],
      onSecondary: materialColors.secondary[20],
      secondaryContainer: materialColors.secondary[30],
      onSecondaryContainer: materialColors.secondary[90],
      
      tertiary: materialColors.tertiary[80],
      onTertiary: materialColors.tertiary[20],
      tertiaryContainer: materialColors.tertiary[30],
      onTertiaryContainer: materialColors.tertiary[90],
      
      error: materialColors.error[80],
      onError: materialColors.error[20],
      errorContainer: materialColors.error[30],
      onErrorContainer: materialColors.error[90],
      
      background: materialColors.neutral[10],
      onBackground: materialColors.neutral[90],
      
      surface: materialColors.neutral[10],
      onSurface: materialColors.neutral[90],
      surfaceVariant: materialColors.neutralVariant[30],
      onSurfaceVariant: materialColors.neutralVariant[80],
      
      outline: materialColors.neutralVariant[60],
      outlineVariant: materialColors.neutralVariant[30],
      
      inverseSurface: materialColors.neutral[90],
      inverseOnSurface: materialColors.neutral[20],
      inversePrimary: materialColors.primary[40],
      
      surfaceDim: materialColors.neutral[6],
      surfaceBright: materialColors.neutral[24],
      surfaceContainerLowest: materialColors.neutral[4],
      surfaceContainerLow: materialColors.neutral[10],
      surfaceContainer: materialColors.neutral[12],
      surfaceContainerHigh: materialColors.neutral[17],
      surfaceContainerHighest: materialColors.neutral[22],
    };
  } else {
    return {
      primary: materialColors.primary[40],
      onPrimary: materialColors.primary[100],
      primaryContainer: materialColors.primary[90],
      onPrimaryContainer: materialColors.primary[10],
      
      secondary: materialColors.secondary[40],
      onSecondary: materialColors.secondary[100],
      secondaryContainer: materialColors.secondary[90],
      onSecondaryContainer: materialColors.secondary[10],
      
      tertiary: materialColors.tertiary[40],
      onTertiary: materialColors.tertiary[100],
      tertiaryContainer: materialColors.tertiary[90],
      onTertiaryContainer: materialColors.tertiary[10],
      
      error: materialColors.error[40],
      onError: materialColors.error[100],
      errorContainer: materialColors.error[90],
      onErrorContainer: materialColors.error[10],
      
      background: materialColors.neutral[99],
      onBackground: materialColors.neutral[10],
      
      surface: materialColors.neutral[99],
      onSurface: materialColors.neutral[10],
      surfaceVariant: materialColors.neutralVariant[90],
      onSurfaceVariant: materialColors.neutralVariant[30],
      
      outline: materialColors.neutralVariant[50],
      outlineVariant: materialColors.neutralVariant[80],
      
      inverseSurface: materialColors.neutral[20],
      inverseOnSurface: materialColors.neutral[95],
      inversePrimary: materialColors.primary[80],
      
      surfaceDim: materialColors.neutral[87],
      surfaceBright: materialColors.neutral[98],
      surfaceContainerLowest: materialColors.neutral[100],
      surfaceContainerLow: materialColors.neutral[96],
      surfaceContainer: materialColors.neutral[94],
      surfaceContainerHigh: materialColors.neutral[92],
      surfaceContainerHighest: materialColors.neutral[90],
    };
  }
};

// Utility functions
export const getColorToken = (token: string, isDark: boolean) => {
  const scheme = generateColorScheme(isDark);
  return scheme[token as keyof typeof scheme] || token;
};

export const getTypographyStyle = (style: keyof typeof materialTypography) => {
  return materialTypography[style];
};

export const getElevation = (level: keyof typeof materialElevation) => {
  return materialElevation[level];
};

export const getShape = (corner: keyof typeof materialShape.corner) => {
  return materialShape.corner[corner];
};

export const getMotion = (duration: keyof typeof materialMotion.duration, easing: keyof typeof materialMotion.easing) => {
  return `${materialMotion.duration[duration]} ${materialMotion.easing[easing]}`;
};

export default {
  colors: materialColors,
  typography: materialTypography,
  elevation: materialElevation,
  shape: materialShape,
  motion: materialMotion,
  stateLayer: materialStateLayer,
  components: materialComponents,
  generateColorScheme,
  getColorToken,
  getTypographyStyle,
  getElevation,
  getShape,
  getMotion,
};