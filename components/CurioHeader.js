import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CurioMascot } from './CurioMascot';
import { CURIO_THEME, TEXT_STYLES } from '../theme';

export const CurioHeader = ({ 
  title, 
  subtitle, 
  showMascot = true,
  mascotSize = 'medium',
  centerAlign = false,
  onBackPress,
  style,
  titleStyle,
  subtitleStyle,
  ...props 
}) => {
  return (
    <View 
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: CURIO_THEME.spacing.lg,
          paddingHorizontal: CURIO_THEME.spacing.screenPadding,
          backgroundColor: CURIO_THEME.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: CURIO_THEME.colors.border,
        },
        style
      ]} 
      {...props}
    >
      {/* Back Button */}
      {onBackPress && (
        <TouchableOpacity 
          onPress={onBackPress}
          style={{
            marginRight: CURIO_THEME.spacing.md,
            padding: CURIO_THEME.spacing.sm,
            borderRadius: CURIO_THEME.radius.button,
            backgroundColor: CURIO_THEME.colors.surface,
            borderWidth: 1,
            borderColor: CURIO_THEME.colors.border,
            minWidth: 44,
            minHeight: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{
            fontSize: 20,
            color: CURIO_THEME.colors.primary,
            fontWeight: '600',
          }}>
            ←
          </Text>
        </TouchableOpacity>
      )}

      {/* Mascot */}
      {showMascot && (
        <View style={{
          marginRight: CURIO_THEME.spacing.md,
        }}>
          <CurioMascot size={mascotSize} />
        </View>
      )}
      
      {/* Title and Subtitle */}
      <View style={{ 
        flex: 1, 
        alignItems: centerAlign ? 'center' : 'flex-start',
        justifyContent: 'center'
      }}>
        {title && (
          <Text 
            style={[
              TEXT_STYLES.h3, 
              { textAlign: centerAlign ? 'center' : 'left' },
              titleStyle
            ]}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text 
            style={[
              TEXT_STYLES.bodySecondary, 
              { 
                marginTop: CURIO_THEME.spacing.xs,
                textAlign: centerAlign ? 'center' : 'left',
              },
              subtitleStyle
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

// Curio Brand Logo with wordmark
export const CurioLogo = ({ 
  showTagline = true, 
  size = 'medium',
  style,
  ...props 
}) => {
  const sizeConfig = {
    small: { mascot: 'small', title: TEXT_STYLES.h3, tagline: TEXT_STYLES.caption },
    medium: { mascot: 'medium', title: TEXT_STYLES.h2, tagline: TEXT_STYLES.body },
    large: { mascot: 'large', title: TEXT_STYLES.h1, tagline: TEXT_STYLES.cardTitle },
    hero: { mascot: 'hero', title: { ...TEXT_STYLES.h1, fontSize: 48 }, tagline: TEXT_STYLES.h3 },
  };

  const config = sizeConfig[size];

  return (
    <View 
      style={[
        {
          alignItems: 'center',
          paddingVertical: CURIO_THEME.spacing.lg,
        },
        style
      ]} 
      {...props}
    >
      <CurioMascot size={config.mascot} />
      
      <View style={{ marginTop: CURIO_THEME.spacing.md, alignItems: 'center' }}>
        <Text style={[config.title, { color: CURIO_THEME.colors.textPrimary }]}>
          Curio
        </Text>
        
        {showTagline && (
          <Text style={[
            config.tagline, 
            { 
              color: CURIO_THEME.colors.primary,
              marginTop: CURIO_THEME.spacing.xs,
              textAlign: 'center',
            }
          ]}>
            Weaving stories, nurturing minds.
          </Text>
        )}
      </View>
    </View>
  );
};

export default CurioHeader;