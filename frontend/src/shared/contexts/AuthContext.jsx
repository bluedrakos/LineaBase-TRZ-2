import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { meApi } from '@/core/auth/services/auth.service';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const [sidebar, setSidebar] = useState(() => {
        const stored = localStorage.getItem('sidebar') || sessionStorage.getItem('sidebar');
        return stored ? JSON.parse(stored) : [];
    });

    const [permisos, setPermisos] = useState(() => {
        const stored = localStorage.getItem('permisos') || sessionStorage.getItem('permisos');
        return stored ? JSON.parse(stored) : {};
    });

    const refreshAuth = useCallback(async () => {
        try {
            const data = await meApi();
            if (data) {
                if (data.user) setUser(data.user);
                if (data.sidebar) setSidebar(data.sidebar);
                if (data.permisos) setPermisos(data.permisos);
            }
        } catch (error) {
            console.error('Error refreshing auth data:', error);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setSidebar([]);
        setPermisos({});
        // El clearing de storage lo hace auth.service o app-bridge
    }, []);

    const value = {
        user,
        sidebar,
        permisos,
        refreshAuth,
        logout,
        setUser,
        setSidebar,
        setPermisos,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
