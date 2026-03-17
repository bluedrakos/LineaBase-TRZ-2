import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { resolveInertiaPage } from './page-resolver';
import { getComponentFromUrl } from './dynamic-mapper';

function DynamicPageLoader() {
    const location = useLocation();
    const [Component, setComponent] = useState(null);
    const [pageProps, setPageProps] = useState({});

    useEffect(() => {
        let isMounted = true;
        const pageName = getComponentFromUrl(location.pathname);
        
        async function load() {
            try {
                const ResolvedComponent = await resolveInertiaPage(pageName);
                if (isMounted) {
                    setComponent(() => ResolvedComponent);
                    setPageProps({});
                }
            } catch (err) {
                 try {
                     const FallbackComponent = await resolveInertiaPage('Errores/ModuloPendiente');
                     if (isMounted) {
                        const segments = location.pathname.split('/').filter(Boolean);
                        const slug = segments.length > 1 ? segments[1] : segments[0] || 'desconocido';
                        const nombreLimpio = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                        setPageProps({
                            modulo: { nombre: nombreLimpio, slug, ruta: location.pathname },
                            pagina: pageName.split('/').pop() || 'Index'
                        });
                        setComponent(() => FallbackComponent);
                     }
                 } catch (fallbackErr) {
                     console.error("No se pudo cargar el componente base ni el fallback.", fallbackErr);
                 }
            }
        }
        
        load();
        return () => { isMounted = false; };
    }, [location.pathname]);

    if (!Component) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004064]"></div>
            </div>
        );
    }

    // Inyectamos estado global (al igual que hacía el simulador)
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
    const sidebar = JSON.parse(localStorage.getItem('sidebar') || sessionStorage.getItem('sidebar') || '[]');
    const permisos = JSON.parse(localStorage.getItem('permisos') || sessionStorage.getItem('permisos') || '{}');

    return (
        <Component 
            auth={{ user, sidebar }} 
            permisos={permisos} 
            errors={{}} 
            {...pageProps}
        />
    );
}

const browserRouter = createBrowserRouter([
    {
        path: '*',
        element: <DynamicPageLoader />
    }
]);

import { Toaster } from 'sonner';

export function AppRouter() {
    return (
        <HelmetProvider>
            <Toaster position="top-right" />
            <RouterProvider router={browserRouter} />
        </HelmetProvider>
    );
}
