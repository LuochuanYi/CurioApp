// Curio Brand Colors - Based on Official Style Guide
export const COLORS = {
  // Primary Brand Colors
  skyBlue: '#4A90E2',      // Trust, calm, family-friendly (Primary)
  goldenYellow: '#FFD700',  // Playfulness, creativity
  deepNavy: '#2C3E50',     // Stability, tech confidence
  accentOrange: '#FF9500', // Energy, alerts, highlights
  
  // Extended Palette
  softMint: '#A8D0F0',     // Background balance
  lightGray: '#F8F9FA',    // Background/card backgrounds
  
  // Semantic Colors
  primary: '#4A90E2',      // Sky Blue - main brand color
  secondary: '#FFD700',    // Golden Yellow - playful actions
  accent: '#FF9500',       // Orange - alerts and highlights
  background: '#FFFFFF',   // Pure white for cards and main backgrounds
  surface: '#F8F9FA',      // Light gray for subtle backgrounds
  
  // Text Colors
  textPrimary: '#2C3E50',  // Deep Navy for main text
  textSecondary: '#6B7280', // Muted gray for secondary text
  textLight: '#9CA3AF',    // Light gray for captions
  textInverse: '#FFFFFF',  // White text for dark backgrounds
  
  // State Colors
  success: '#10B981',      // Green for success states
  warning: '#FF9500',      // Orange for warnings (brand accent)
  error: '#EF4444',        // Red for errors
  info: '#4A90E2',         // Sky Blue for info (brand primary)
  
  // Transparency Variants
  overlay: 'rgba(44, 62, 80, 0.1)',        // Navy with 10% opacity
  cardShadow: 'rgba(0, 0, 0, 0.08)',       // Subtle shadow
  buttonShadow: 'rgba(74, 144, 226, 0.25)', // Blue button shadow
  
  // Mascot Colors (for Curio the Bot)
  mascotBody: '#4A90E2',   // Sky Blue body
  mascotEyes: '#FF9500',   // Orange eyes
  mascotAccent: '#FFD700', // Golden Yellow highlights
};

// Color usage guidelines based on style guide
export const COLOR_USAGE = {
  // Navigation
  homeActive: COLORS.skyBlue,      // Blue for Home/Monitor
  engageActive: COLORS.goldenYellow, // Yellow for Engage
  personalizeActive: COLORS.deepNavy, // Navy for Personalize
  
  // Buttons
  primaryButton: COLORS.skyBlue,
  secondaryButton: 'transparent',
  secondaryButtonBorder: COLORS.deepNavy,
  disabledButton: COLORS.lightGray,
  
  // Cards
  cardBackground: COLORS.background,
  cardBorder: COLORS.lightGray,
  alertCard: COLORS.accentOrange,
  
  // Interactive Elements
  activeState: COLORS.skyBlue,
  hoverState: COLORS.softMint,
  pressedState: COLORS.deepNavy,
};

export default COLORS;