import axios from 'axios';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';

// 1. Link (envuelve el RouterLink original de react-router-dom)
export const Link = forwardRef(({ href, as, children, ...props }, ref) => {
    const { logout: logoutContext } = useAuth();
    // Si la ruta es a un link externo o method distinto de GET (como logout) usamos form/a normales
    if (props.method && props.method !== 'get') {
        const handleClick = async (e) => {
            e.preventDefault();
            if (props.method === 'post' && href === '/logout') {
                await axios.post('/api/v1/auth/logout');
                logoutContext();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('sidebar');
                localStorage.removeItem('permisos');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('sidebar');
                sessionStorage.removeItem('permisos');
                window.location.href = '/login';
            }
        };
        return (
            <button type="button" onClick={handleClick} className={props.className} ref={ref}>
                {children}
            </button>
        );
    }

    return (
        <RouterLink to={href} ref={ref} {...props}>
            {children}
        </RouterLink>
    );
});
Link.displayName = 'Link';

// 2. Head (usa Helmet para cambiar title)
export function Head({ title }) {
    return (
        <Helmet>
            <title>{title ? `${title} - SICMO` : 'SICMO'}</title>
        </Helmet>
    );
}

// 3. usePage (reemplaza uso de datos globales como auth auth)
export function usePage() {
    const { user, sidebar, permisos } = useAuth();
    
    return {
        props: {
            auth: { user, sidebar },
            permisos,
            errors: {}, // fallback
        },
        url: window.location.pathname
    };
}

// 4. router (Global navigation API)
// Idealmente se debería usar useNavigate en componentes, pero proveemos esto como bridge temporal.
export const router = {
    visit: (url) => {
        // En un hook usaríamos useNavigate. 
        // Para compatibilidad global podemos cambiar window location o interceptar un router history.
        // Dado que somos una SPA limpia ahora, esto asume que en el fondo el usuario migrará a useNavigate.
        window.location.href = url; // fallback fuerte (o usa history API)
    }
};

// 5. useForm (Envuelve Axios para reemplazar Inertia Forms)
export function useForm(initialData = {}) {
    const [data, setDataState] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [wasSuccessful, setWasSuccessful] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const setData = useCallback((key, value) => {
        if (typeof key === 'function') {
            setDataState((prev) => key(prev));
            return;
        }
        if (typeof key === 'string') {
            setDataState((prev) => ({
                ...prev,
                [key]: typeof value === 'function' ? value(prev[key]) : value,
            }));
            return;
        }
        setDataState(key || {});
    }, []);

    const reset = useCallback((...fields) => {
        if (!fields.length) {
            setDataState(initialData);
            return;
        }
        setDataState((prev) => {
            const next = { ...prev };
            fields.forEach((field) => { next[field] = initialData[field] ?? ''; });
            return next;
        });
    }, [initialData]);

    const clearErrors = () => setErrors({});
    const setError = (field, message) => setErrors((prev) => ({ ...prev, [field]: message }));

    const submit = async (method, url, options = {}) => {
        setProcessing(true);
        setWasSuccessful(false);
        try {
            const response = await axios({ method, url, data });
            setErrors({});
            setWasSuccessful(true);
            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 2000);
            options.onSuccess?.(response.data);
        } catch (error) {
            const formErrors = error.response?.data?.errors || {};
            setErrors(formErrors);
            options.onError?.(formErrors);
        } finally {
            setProcessing(false);
            options.onFinish?.();
        }
    };

    return {
        data, setData, errors, processing, wasSuccessful, recentlySuccessful,
        reset, clearErrors, setError,
        post: (url, options) => submit('post', url, options),
        put: (url, options) => submit('put', url, options),
        patch: (url, options) => submit('patch', url, options),
        delete: (url, options) => submit('delete', url, options),
    };
}
