import { usePermisos } from '@/core/auth/hooks/usePermisos';
import { GenerarColumnas } from '@/shared/components/data-table/GenerarColumnas';
import { truncate } from '@/shared/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

export function RolTablaConfig({
    setAbrirCrear,
    setRolEdit,
    setRolSeleccionado,
    setMostrarDialogActivo,
    setModoEdicion,
    setSoloLectura,
}) {
    const { puede, iconoDe } = usePermisos('gestion-de-permisos');

    const permisosAcciones = (rol) => {
        const acciones = [];

        if (puede('ver')) {
            acciones.push({
                label: 'Ver',
                icon: iconoDe('ver'),
                variant: 'primary',
                onClick: (item) => {
                    setRolEdit(item);
                    setModoEdicion('todo');
                    setSoloLectura?.(true);
                    setAbrirCrear(true);
                },
            });
        }

        if (puede('editar')) {
            acciones.push({
                label: 'Editar Perfil',
                icon: iconoDe('editar'),
                variant: 'secondary',
                onClick: (item) => {
                    setRolEdit(item);
                    setSoloLectura?.(false);
                    setAbrirCrear(true);
                    setModoEdicion('datos');
                },
            });
        }
        if (puede('editar')) {
            acciones.push({
                label: 'Editar Permisos',
                icon: iconoDe('editar'),
                variant: 'secondary',
                onClick: (item) => {
                    setRolEdit(item);
                    setSoloLectura?.(false);
                    setAbrirCrear(true);
                    setModoEdicion('permisos');
                },
            });
        }

        acciones.push({ separador: true });

        if (puede('activar')) {
            acciones.push({
                label: rol.rol_activo ? 'Desactivar' : 'Activar',
                icon: iconoDe(rol.rol_activo ? 'activar' : 'activar'),
                variant: rol.rol_activo ? 'danger' : 'success',
                onClick: () => {
                    setRolSeleccionado(rol);
                    setMostrarDialogActivo(true);
                },
            });
        }


        return acciones;
    };
    const extra = [
        {
            accessorKey: 'rol_nombre',
            header: 'Nombre',
        },
        {
            accessorKey: 'rol_descripcion',
            header: 'Descripcion',
            cell: ({ getValue }) => truncate(getValue(), 20),
        },

        {
            accessorKey: 'rol_activo',
            header: 'Activo',
            meta: {
                filterVariant: 'select',
                options: [
                    { label: 'Activo', value: true },
                    { label: 'Inactivo', value: false },
                ],
            },
            cell: ({ getValue }) => {
                const activo = getValue();
                return (
                    <div className="flex items-center gap-1 font-medium">
                        {activo ? (
                            <>
                                <CheckCircle className="h-4 w-4 text-green-800 dark:text-green-400" />
                                <span className="text-green-800 dark:text-green-400">
                                    Activo
                                </span>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-4 w-4 text-red-400" />
                                <span className="text-red-400">Inactivo</span>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    return GenerarColumnas({
        extra,
        permisosAcciones,
    });
}
