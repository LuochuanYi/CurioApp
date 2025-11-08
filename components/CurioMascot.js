import React from 'react';
import { View, Text } from 'react-native';
import { CURIO_THEME, COMPONENT_STYLES, TEXT_STYLES } from '../theme';

export const CurioMascot = ({ 
  size = 'medium', // 'small', 'medium', 'large', 'hero'
  animated = false,
  style,
  ...props 
}) => {
  const getSizeStyle = () => {
    const sizes = {
      small: CURIO_THEME.layout.mascot.sm,
      medium: CURIO_THEME.layout.mascot.md,
      large: CURIO_THEME.layout.mascot.lg,
      hero: CURIO_THEME.layout.mascot.xl,
    };
    
    const dimension = sizes[size];
    
    return {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
    };
  };

  return (
    <View 
      style={[
        COMPONENT_STYLES.mascotContainer,
        getSizeStyle(),
        style
      ]} 
      {...props}
    >
      {/* Curio's Eyes */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: size === 'small' ? 2 : 4,
      }}>
        <View style={{
          width: size === 'small' ? 6 : size === 'hero' ? 16 : 10,
          height: size === 'small' ? 6 : size === 'hero' ? 16 : 10,
          borderRadius: 20,
          backgroundColor: CURIO_THEME.colors.mascotEyes,
          marginHorizontal: size === 'small' ? 3 : 5,
        }} />
        <View style={{
          width: size === 'small' ? 6 : size === 'hero' ? 16 : 10,
          height: size === 'small' ? 6 : size === 'hero' ? 16 : 10,
          borderRadius: 20,
          backgroundColor: CURIO_THEME.colors.mascotEyes,
          marginHorizontal: size === 'small' ? 3 : 5,
        }} />
      </View>
      
      {/* Signal Waves (Antenna) */}
      <View style={{
        position: 'absolute',
        top: size === 'small' ? -2 : -4,
        left: size === 'small' ? 8 : size === 'hero' ? 25 : 15,
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}>
        <View style={{
          width: size === 'small' ? 2 : 3,
          height: size === 'small' ? 4 : 6,
          backgroundColor: CURIO_THEME.colors.mascotAccent,
          borderRadius: 1,
          marginRight: 1,
        }} />
        <View style={{
          width: size === 'small' ? 2 : 3,
          height: size === 'small' ? 6 : 8,
          backgroundColor: CURIO_THEME.colors.mascotAccent,
          borderRadius: 1,
        }} />
      </View>
      
      {/* More signal waves on the right */}
      <View style={{
        position: 'absolute',
        top: size === 'small' ? -2 : -4,
        right: size === 'small' ? 8 : size === 'hero' ? 25 : 15,
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}>
        <View style={{
          width: size === 'small' ? 2 : 3,
          height: size === 'small' ? 6 : 8,
          backgroundColor: CURIO_THEME.colors.mascotAccent,
          borderRadius: 1,
          marginRight: 1,
        }} />
        <View style={{
          width: size === 'small' ? 2 : 3,
          height: size === 'small' ? 4 : 6,
          backgroundColor: CURIO_THEME.colors.mascotAccent,
          borderRadius: 1,
        }} />
      </View>
      
      {/* Yellow sun/dot accent */}
      <View style={{
        position: 'absolute',
        top: size === 'small' ? 5 : size === 'hero' ? 15 : 10,
        right: size === 'small' ? -8 : size === 'hero' ? -15 : -12,
        width: size === 'small' ? 12 : size === 'hero' ? 24 : 16,
        height: size === 'small' ? 12 : size === 'hero' ? 24 : 16,
        borderRadius: 20,
        backgroundColor: CURIO_THEME.colors.goldenYellow,
      }} />
    </View>
  );
};

export default CurioMascot;