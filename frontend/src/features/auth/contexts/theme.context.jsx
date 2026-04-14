import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
	const [isDark, setIsDark] = useState(() => {
		if (typeof window === 'undefined') return false;

		// Check localStorage first
		const stored = localStorage.getItem('theme-preference');
		if (stored) {
			return stored === 'dark';
		}

		// Check system preference
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const root = document.documentElement;
		if (isDark) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}

		localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
	}, [isDark]);

	const toggleTheme = () => {
		setIsDark((prev) => !prev);
	};

	const value = {
		isDark,
		toggleTheme,
	};

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
}
