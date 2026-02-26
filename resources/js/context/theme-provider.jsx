import { createContext, useEffect, useLayoutEffect, useState } from 'react';

const ThemeProviderContext = createContext(undefined);

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = 'vite-ui-theme',
}) {
    const [theme, setThemeState] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(storageKey) || defaultTheme;
        }
        return defaultTheme;
    });

    useLayoutEffect(() => {
        const root = document.documentElement;
        const systemPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;

        root.classList.remove('light', 'dark');

        const applied =
            theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

        root.classList.add(applied);
    }, [theme]);

    useEffect(() => {
        const root = document.documentElement;
        const favicon = document.querySelector("link[rel='icon']");
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const apply = (themeToApply) => {
            root.classList.remove('light', 'dark');
            root.classList.add(themeToApply);
            if (favicon) {
                favicon.href =
                    themeToApply === 'dark' ? '/logo-claro.png' : '/logo.png';
            }
        };

        const handleSystemChange = () => {
            if (theme === 'system') {
                const systemTheme = mediaQuery.matches ? 'dark' : 'light';
                apply(systemTheme);
            }
        };

        if (theme === 'system') {
            handleSystemChange();
            mediaQuery.addEventListener('change', handleSystemChange);
            return () =>
                mediaQuery.removeEventListener('change', handleSystemChange);
        } else {
            apply(theme);
        }
    }, [theme]);

    const setTheme = (newTheme) => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
    };

    return (
        <ThemeProviderContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export { ThemeProviderContext };
