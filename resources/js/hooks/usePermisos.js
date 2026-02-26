import { usePage } from "@inertiajs/react";
import * as Icons from "lucide-react";

export function usePermisos(modulo) {
    const { permisos } = usePage().props;

    const puede = (accion) => {
        return permisos[modulo]?.some(p => p.accion === accion);
    };

    const iconoDe = (accion) => {
        const permiso = permisos[modulo]?.find(p => p.accion === accion);
        return Icons[permiso.icono] ?? Icons.HelpCircle;
    };

    return { puede, iconoDe };
}