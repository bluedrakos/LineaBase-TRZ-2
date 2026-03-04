export function getComponentFromUrl(path) {
    const p = path.toLowerCase();
    
    // Rutas raíz o dashboard base
    if (p === '/' || p === '/dashboard' || p === '/dashboard/') {
        return 'Panel/Dashboard';
    }

    if (p.includes('login') || p === '/login') return 'Auth/Login';
    if (p.includes('reset-password')) return 'Auth/ResetPassword';

    // Casos especiales de Core
    if (p.includes('usuarios')) {
        if (/\/\d+(\/.*)?$/.test(p)) return 'Usuarios/Show';
        return 'Usuarios/Index';
    }
    if (p.includes('gestion-de-permisos') || p.includes('roles')) return 'Roles/Index';
    if (p.includes('modulos') || p.includes('gestion-de-modulos')) return 'Modulos/Index';
    if (p.includes('instituciones')) return 'Instituciones/Index';
    if (p.includes('auditorias')) return 'Auditorias/Index';
    if (p.includes('perfiles') || p.includes('profile')) return 'Perfiles/Edit';

    // Ruteo dinámico para módulos
    const segments = path.split('/').filter(Boolean);
    if (segments[0] === 'dashboard' && segments[1]) {
        const moduleName = segments[1];
        
        // Caso especial para el Panel principal
        if (moduleName === 'panel') return 'Panel/Dashboard';

        // Normalizamos el nombre del componente (Monedas -> Monedas/Index)
        const componentName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
        return `${componentName}/Index`;
    }

    return 'Dashboard/Dashboard';
}
