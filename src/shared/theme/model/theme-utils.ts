import { useColorScheme as useNativeColorScheme } from 'react-native';

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

export function useIconColor(variant: ColorVariant = 'primary'): string {
  const colorScheme = useNativeColorScheme();
  const mode = colorScheme ?? 'light';
  return colorMap[mode][variant];
}

export function useThemeColors() {
  const colorScheme = useNativeColorScheme();
  const mode = colorScheme ?? 'light';
  return colorMap[mode];
}

export function getThemeColor(
  variant: ColorVariant,
  mode: 'light' | 'dark' = 'light',
): string {
  return colorMap[mode][variant];
}

export const themeClasses = {
  background: {
    primary: 'bg-background-0 dark:bg-background-0',
    secondary: 'bg-background-50 dark:bg-background-50',
    elevated: 'bg-background-0 dark:bg-background-100',
    muted: 'bg-background-muted dark:bg-background-muted',
  },
  text: {
    primary: 'text-typography-900 dark:text-typography-900',
    secondary: 'text-typography-600 dark:text-typography-600',
    muted: 'text-typography-400 dark:text-typography-400',
    brand: 'text-brand-500 dark:text-brand-500',
    error: 'text-error-500 dark:text-error-500',
  },
  border: {
    default: 'border-outline-300 dark:border-outline-300',
    muted: 'border-outline-200 dark:border-outline-200',
    brand: 'border-brand-500 dark:border-brand-500',
  },
  button: {
    brand: 'bg-brand-500 dark:bg-brand-500 active:bg-brand-600 dark:active:bg-brand-600',
    accent:
      'bg-accent-500 dark:bg-accent-500 active:bg-accent-600 dark:active:bg-accent-600',
    error: 'bg-error-500 dark:bg-error-500 active:bg-error-600 dark:active:bg-error-600',
    secondary:
      'bg-background-50 dark:bg-background-50 active:bg-background-100 dark:active:bg-background-100',
  },
};
