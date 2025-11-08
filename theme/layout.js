// Curio Spacing and Layout System - Based on Brand Guidelines

// Base spacing unit (8px grid system)
const BASE_UNIT = 8;

export const SPACING = {
  // Base units
  xs: BASE_UNIT * 0.5,    // 4px
  sm: BASE_UNIT,          // 8px
  md: BASE_UNIT * 2,      // 16px
  lg: BASE_UNIT * 3,      // 24px
  xl: BASE_UNIT * 4,      // 32px
  xxl: BASE_UNIT * 6,     // 48px
  
  // Semantic spacing
  cardPadding: BASE_UNIT * 2,      // 16px - consistent card padding
  sectionPadding: BASE_UNIT * 3,   // 24px - section spacing
  screenPadding: BASE_UNIT * 2,    // 16px - screen edge padding
  buttonPadding: BASE_UNIT * 1.5,  // 12px vertical, 24px horizontal
  
  // Component-specific
  navBarHeight: 80,
  tabBarHeight: 60,
  headerHeight: 64,
  buttonHeight: 48,
  inputHeight: 48,
  cardMinHeight: 120,
};

// Border Radius (Rounded corners as per brand guide)
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,   // Standard card radius
  lg: 16,   // Large card radius
  xl: 24,   // Extra large radius
  full: 999, // Fully rounded (pills, avatars)
  
  // Component-specific
  button: 12,
  card: 12,
  input: 8,
  badge: 16,
  avatar: 999,
  mascot: 999, // Curio mascot is circular
};

// Shadows (Subtle shadows as per brand guide)
export const SHADOWS = {
  // Card shadows
  card: {
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2, // Android
  },
  
  // Button shadows
  button: {
    shadowColor: 'rgba(74, 144, 226, 0.25)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  
  // Navigation shadow
  nav: {
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1, // Android
  },
  
  // Floating elements
  floating: {
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4, // Android
  },
};

// Layout breakpoints and dimensions
export const LAYOUT = {
  // Screen breakpoints
  breakpoints: {
    sm: 375,  // Small phones
    md: 768,  // Tablets
    lg: 1024, // Desktop
  },
  
  // Container widths
  container: {
    sm: '100%',
    md: 720,
    lg: 960,
    xl: 1200,
  },
  
  // Component dimensions
  avatar: {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  },
  
  icon: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  
  // Curio mascot sizes
  mascot: {
    sm: 40,   // Small inline mascot
    md: 60,   // Standard size
    lg: 80,   // Large display
    xl: 120,  // Hero/splash screen
  },
};

export default { SPACING, RADIUS, SHADOWS, LAYOUT };