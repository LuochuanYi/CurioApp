import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { CURIO_THEME, COMPONENT_STYLES, TEXT_STYLES } from '../theme';

export const CurioButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false, 
  loading = false,
  icon,
  style,
  textStyle,
  ...props 
}) => {
  const getButtonStyle = () => {
    const baseStyle = variant === 'primary' 
      ? COMPONENT_STYLES.primaryButton 
      : COMPONENT_STYLES.secondaryButton;
    
    const sizeStyle = size === 'small' 
      ? { paddingVertical: CURIO_THEME.spacing.sm, paddingHorizontal: CURIO_THEME.spacing.md }
      : {};
    
    const disabledStyle = disabled 
      ? { backgroundColor: CURIO_THEME.colors.lightGray, borderColor: CURIO_THEME.colors.lightGray }
      : {};
    
    return [baseStyle, sizeStyle, disabledStyle, style];
  };

  const getTextStyle = () => {
    const baseTextStyle = variant === 'primary' 
      ? TEXT_STYLES.buttonPrimary 
      : TEXT_STYLES.buttonSecondary;
    
    const sizeTextStyle = size === 'small' 
      ? CURIO_THEME.typography.buttonSmall 
      : {};
    
    const disabledTextStyle = disabled 
      ? { color: CURIO_THEME.colors.textLight }
      : {};
    
    return [baseTextStyle, sizeTextStyle, disabledTextStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? CURIO_THEME.colors.textInverse : CURIO_THEME.colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default CurioButton;