import { ColorVariant, useIconColor } from '@/lib/theme-utils';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';

export interface ThemedIconProps {
  /**
   * The Lucide icon component to render
   */
  Icon: LucideIcon;
  
  /**
   * Color variant to apply to the icon
   * @default 'primary'
   */
  variant?: ColorVariant;
  
  /**
   * Size of the icon in pixels
   * @default 24
   */
  size?: number;
  
  /**
   * Stroke width of the icon
   * @default 2
   */
  strokeWidth?: number;
  
  /**
   * Custom color to override the variant
   * Use this sparingly - prefer using variants for consistency
   */
  color?: string;
  
  /**
   * Additional props to pass to the icon component
   */
  [key: string]: any;
}

/**
 * A themed icon component that automatically uses the correct color
 * based on the current theme and specified variant.
 * 
 * @example
 * ```tsx
 * // Using default variant (primary)
 * <ThemedIcon Icon={Home} size={24} />
 * 
 * // Using brand variant
 * <ThemedIcon Icon={MessageCircle} variant="brand" size={20} />
 * 
 * // Using custom color (not recommended)
 * <ThemedIcon Icon={Settings} color="#ff0000" />
 * ```
 */
export function ThemedIcon({ 
  Icon, 
  variant = 'primary', 
  size = 24,
  strokeWidth = 2,
  color,
  ...props 
}: ThemedIconProps) {
  const themeColor = useIconColor(variant);
  const finalColor = color || themeColor;
  
  return (
    <Icon 
      color={finalColor} 
      size={size}
      strokeWidth={strokeWidth}
      {...props} 
    />
  );
}
