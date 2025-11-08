import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CURIO_THEME, COMPONENT_STYLES, TEXT_STYLES } from '../theme';

export const CurioCard = ({ 
  title, 
  subtitle,
  children,
  onPress,
  variant = 'default', // 'default', 'alert', 'highlight'
  style,
  titleStyle,
  subtitleStyle,
  ...props 
}) => {
  const getCardStyle = () => {
    let baseStyle = COMPONENT_STYLES.card;
    
    switch (variant) {
      case 'alert':
        baseStyle = COMPONENT_STYLES.alertCard;
        break;
      case 'highlight':
        baseStyle = {
          ...COMPONENT_STYLES.card,
          borderWidth: 2,
          borderColor: CURIO_THEME.colors.primary,
        };
        break;
      default:
        break;
    }
    
    return [baseStyle, style];
  };

  const CardContent = () => (
    <View style={getCardStyle()} {...props}>
      {title && (
        <Text style={[TEXT_STYLES.cardTitle, titleStyle]}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text style={[TEXT_STYLES.caption, { marginTop: CURIO_THEME.spacing.xs }, subtitleStyle]}>
          {subtitle}
        </Text>
      )}
      {children && (
        <View style={{ marginTop: title || subtitle ? CURIO_THEME.spacing.md : 0 }}>
          {children}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={title || 'Card'}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

export default CurioCard;