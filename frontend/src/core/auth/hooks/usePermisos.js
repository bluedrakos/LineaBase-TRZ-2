import { getStoredPermisos } from '@/core/auth/services/auth.service';
import { usePage } from '@/shared/app-bridge';
import * as Icons from 'lucide-react';

export function usePermisos(modulo) {
    const { permisos: permisosInertia = {} } = usePage().props;
    const permisos =
        Object.keys(permisosInertia).length > 0
            ? permisosInertia
            : getStoredPermisos();

    const puede = (accion) => {
        return permisos?.[modulo]?.some((p) => p.accion === accion);
    };

    const iconoDe = (accion) => {
        const permiso = permisos?.[modulo]?.find((p) => p.accion === accion);
        return Icons[permiso?.icono] ?? Icons.HelpCircle;
    };

    return { puede, iconoDe };
}
