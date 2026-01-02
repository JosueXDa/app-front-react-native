import { useColorScheme as useNativeColorScheme } from 'react-native';

/**
 * Color variants for consistent icon and UI element coloring
 */
export type ColorVariant = 
  | 'primary' 
  | 'secondary' 
  | 'muted' 
  | 'brand' 
  | 'accent'
  | 'error'
  | 'success'
  | 'warning'
  | 'info';

/**
 * Color mappings for light and dark modes
 * These use RGB format to work with Gluestack's CSS variable system
 */
const colorMap = {
  light: {
    primary: 'rgb(var(--color-typography-900))',
    secondary: 'rgb(var(--color-typography-600))',
    muted: 'rgb(var(--color-typography-400))',
    brand: 'rgb(var(--color-brand-500))',
    accent: 'rgb(var(--color-accent-500))',
    error: 'rgb(var(--color-error-500))',
    success: 'rgb(var(--color-success-500))',
    warning: 'rgb(var(--color-warning-500))',
    info: 'rgb(var(--color-info-500))',
  },
  dark: {
    primary: 'rgb(var(--color-typography-900))',
    secondary: 'rgb(var(--color-typography-600))',
    muted: 'rgb(var(--color-typography-400))',
    brand: 'rgb(var(--color-brand-500))',
    accent: 'rgb(var(--color-accent-500))',
    error: 'rgb(var(--color-error-500))',
    success: 'rgb(var(--color-success-500))',
    warning: 'rgb(var(--color-warning-500))',
    info: 'rgb(var(--color-info-500))',
  },
};

/**
 * Hook to get the appropriate icon color based on the current theme
 * 
 * @param variant - The color variant to use
 * @returns The color string in RGB format
 * 
 * @example
 * ```tsx
 * const iconColor = useIconColor('brand');
 * <Icon color={iconColor} />
 * ```
 */
export function useIconColor(variant: ColorVariant = 'primary'): string {
  const colorScheme = useNativeColorScheme();
  const mode = colorScheme ?? 'light';
  return colorMap[mode][variant];
}

/**
 * Hook to get all theme colors for the current mode
 * Useful when you need multiple colors or want to access the full palette
 * 
 * @returns Object containing all color variants for the current theme
 * 
 * @example
 * ```tsx
 * const colors = useThemeColors();
 * <Icon color={colors.brand} />
 * <Text style={{ color: colors.secondary }}>Text</Text>
 * ```
 */
export function useThemeColors() {
  const colorScheme = useNativeColorScheme();
  const mode = colorScheme ?? 'light';
  return colorMap[mode];
}

/**
 * Utility to get a specific color without using a hook (for non-component contexts)
 * 
 * @param variant - The color variant to get
 * @param mode - The theme mode ('light' or 'dark')
 * @returns The color string in RGB format
 */
export function getThemeColor(variant: ColorVariant, mode: 'light' | 'dark' = 'light'): string {
  return colorMap[mode][variant];
}

/**
 * Tailwind class name mappings for common UI patterns
 * These use the Gluestack token system
 */
export const themeClasses = {
  // Background colors
  background: {
    primary: 'bg-background-0 dark:bg-background-0',
    secondary: 'bg-background-50 dark:bg-background-50',
    elevated: 'bg-background-0 dark:bg-background-100',
    muted: 'bg-background-muted dark:bg-background-muted',
  },
  
  // Text colors
  text: {
    primary: 'text-typography-900 dark:text-typography-900',
    secondary: 'text-typography-600 dark:text-typography-600',
    muted: 'text-typography-400 dark:text-typography-400',
    brand: 'text-brand-500 dark:text-brand-500',
    error: 'text-error-500 dark:text-error-500',
  },
  
  // Border colors
  border: {
    default: 'border-outline-300 dark:border-outline-300',
    muted: 'border-outline-200 dark:border-outline-200',
    brand: 'border-brand-500 dark:border-brand-500',
  },
  
  // Button variants
  button: {
    brand: 'bg-brand-500 dark:bg-brand-500 active:bg-brand-600 dark:active:bg-brand-600',
    accent: 'bg-accent-500 dark:bg-accent-500 active:bg-accent-600 dark:active:bg-accent-600',
    error: 'bg-error-500 dark:bg-error-500 active:bg-error-600 dark:active:bg-error-600',
    secondary: 'bg-background-50 dark:bg-background-50 active:bg-background-100 dark:active:bg-background-100',
  },
};
