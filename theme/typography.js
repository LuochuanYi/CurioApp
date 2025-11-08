// Curio Typography System - Based on Official Style Guide

export const FONTS = {
  // Font Families (Rounded, modern sans-serif as per brand guide)
  primary: 'System', // Will use platform-specific rounded fonts
  body: 'System',
  caption: 'System',
  
  // Platform-specific font stacks
  ios: {
    primary: 'SF Pro Rounded',
    body: 'SF Pro Text',
    caption: 'SF Pro Text',
  },
  android: {
    primary: 'Roboto',
    body: 'Roboto',
    caption: 'Roboto',
  },
  web: {
    primary: '"Inter", "Nunito", "Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
    body: '"Inter", "Lato", -apple-system, BlinkMacSystemFont, sans-serif',
    caption: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  }
};

// Typography Hierarchy (as defined in style guide)
export const TYPOGRAPHY = {
  // Headers - Bold, rounded sans-serif
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  
  // Card Titles - Medium weight for section headers
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    letterSpacing: 0,
  },
  
  // Body Text - Clean sans-serif for readability
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  
  // Captions/Labels - Smaller, lighter weight for secondary info
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  
  // Button Text
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  
  // Navigation
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.1,
  },
};

export default TYPOGRAPHY;