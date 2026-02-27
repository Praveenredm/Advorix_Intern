import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

// Since the design system is dark-first, we default to dark and
// keep the toggle available for future light-mode support.
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        // Default to dark if no preference saved
        if (saved === 'light') return false;
        return true;
    });

    useEffect(() => {
        const root = document.documentElement;

        if (isDarkMode) {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }

        // Sync CSS variables for light mode override (future use)
        root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);
    const setDark  = () => setIsDarkMode(true);
    const setLight = () => setIsDarkMode(false);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setDark, setLight }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};