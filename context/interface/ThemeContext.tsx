export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextType {
	themeMode: ThemeMode;
	resolvedTheme: ResolvedTheme;
	setThemeMode: (mode: ThemeMode) => Promise<void>;
	toggleTheme: () => Promise<void>;
	isLoading: boolean;
}

export interface ThemeProviderProps {
	children: React.ReactNode;
}
