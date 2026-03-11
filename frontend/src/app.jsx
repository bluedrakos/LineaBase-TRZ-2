import './css/app.css';
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './app/providers/theme-provider';
import { AuthProvider } from './shared/contexts/AuthContext';
import { AppRouter } from './app/router';

function initApp() {
    const el = document.getElementById('app');
    if (!el) {
        console.error('No se encontró el elemento #app');
        return;
    }

    const path = window.location.pathname;

    // Validación de sesión básica
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    const isAuthRoute = path.startsWith('/login') || 
                        path.startsWith('/password') || 
                        path.startsWith('/reset-password') || 
                        path === '/';
    
    // Si no hay token y no es una ruta pública, obligamos a login
    if (!user && !isAuthRoute) {
        window.location.href = '/login';
        return;
    }

    // Usamos el nuevo sistema de enrutamiento limpio
    createRoot(el).render(
        <ThemeProvider>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </ThemeProvider>
    );
}

initApp();
