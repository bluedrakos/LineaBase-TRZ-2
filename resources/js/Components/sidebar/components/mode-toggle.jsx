import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const toggle = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('light');
        else setTheme('dark'); // fallback por defecto
    };

    return (
        <button
            onClick={toggle}
            className="hover:bg-muted rounded-md p-2 transition"
            title="Cambiar tema"
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    );
}
