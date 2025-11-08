// Curio Design System - Complete Theme Export
import COLORS, { COLOR_USAGE } from './colors';
import TYPOGRAPHY, { FONTS } from './typography';
import { SPACING, RADIUS, SHADOWS, LAYOUT } from './layout';

// Complete Curio theme based on official brand guidelines
export const CURIO_THEME = {
  colors: COLORS,
  colorUsage: COLOR_USAGE,
  typography: TYPOGRAPHY,
  fonts: FONTS,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  layout: LAYOUT,
};

// Curio component style presets
export const COMPONENT_STYLES = {
  // Primary button (Sky Blue filled)
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.button,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.button,
  },
  
  // Secondary button (Navy outlined)
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.deepNavy,
    borderRadius: RADIUS.button,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  
  // Standard card
  card: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.card,
    padding: SPACING.cardPadding,
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.xs,
    ...SHADOWS.card,
  },
  
  // Alert card (Orange accent)
  alertCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.card,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accentOrange,
    padding: SPACING.cardPadding,
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.xs,
    ...SHADOWS.card,
  },
  
  // Screen container
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.screenPadding,
  },
  
  // Section header
  sectionHeader: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.screenPadding,
  },
  
  // Navigation tab
  navigationTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  
  // Mascot container
  mascotContainer: {
    width: LAYOUT.mascot.md,
    height: LAYOUT.mascot.md,
    borderRadius: RADIUS.mascot,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.floating,
  },
};

// Text style presets with colors
export const TEXT_STYLES = {
  h1: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
    fontFamily: FONTS.primary,
  },
  h2: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    fontFamily: FONTS.primary,
  },
  h3: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontFamily: FONTS.primary,
  },
  cardTitle: {
    ...TYPOGRAPHY.cardTitle,
    color: COLORS.textPrimary,
    fontFamily: FONTS.primary,
  },
  body: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontFamily: FONTS.body,
  },
  bodySecondary: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
  },
  caption: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: FONTS.caption,
  },
  buttonPrimary: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
    fontFamily: FONTS.primary,
  },
  buttonSecondary: {
    ...TYPOGRAPHY.button,
    color: COLORS.deepNavy,
    fontFamily: FONTS.primary,
  },
};

export default CURIO_THEME;