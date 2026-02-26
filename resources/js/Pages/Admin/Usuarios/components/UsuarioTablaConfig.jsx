import * as Icons from 'lucide-react';
import { router } from '@inertiajs/react';
import { GenerarColumnas } from '@/Components/General/Tabla/GenerarColumnas';
import { CheckCircle, UserCheck, UserLock, XCircle } from 'lucide-react';
import { usePermisos } from "@/hooks/usePermisos";
import { truncate } from '@/lib/utils';
export function UsuarioTablaConfig({
    setAbrirEditarUsuario,
    setAbrirCrearUsuario,
    setUserToDelete,
    setShowConfirmDeleteModal,
    setUserToHabilitar,
    setabrirEstadoUsuario,
}) {

    const { puede, iconoDe } = usePermisos("gestion-usuarios");
    const permisosAcciones = (usuario) => {
        const acciones = [];
        
        if (puede('ver')) {
            acciones.push({
                label: 'Ver',
                icon: iconoDe('ver'),
                variant: 'primary',
                onClick: (item) =>
                    router.visit(route('admin.usuarios.show', item.usu_id)),
            });
        }
        if (puede('editar')) {
            acciones.push({
                label: 'Editar',
                icon: iconoDe('editar'),
                variant: 'secondary',
                onClick: (item) => {
                    setAbrirEditarUsuario(item);
                    setAbrirCrearUsuario(true);
                },
            });
        }

        acciones.push({ separador: true });

        if (puede('desactivar')) {
            acciones.push({
                label: usuario.usu_activo
                    ? 'Desactivar'
                    : 'Activar',
                icon: usuario.usu_activo ? iconoDe('desactivar') : iconoDe('activar'),
                variant: 'danger',
                onClick: (item) => {
                    setUserToDelete(item);
                    setShowConfirmDeleteModal(true);
                },
            });
        }
        if (puede('habilitar')) {
            acciones.push({
                label:
                    usuario.usu_estado === 'Habilitado'
                        ? 'Deshabilitar'
                        : 'Habilitar',
                icon: usuario.usu_estado == 'Habilitado' ? iconoDe('deshabilitar') : iconoDe('habilitar'),
                variant: 'danger',
                onClick: (item) => {
                    setUserToHabilitar(item);
                    setabrirEstadoUsuario(true);
                },
            });
        }

        return acciones;
    };

    const extra = [
        { accessorKey: 'usu_nombre', header: 'Nombre' },
        { accessorKey: 'usu_apellidos', header: 'Apellidos' },
        { accessorKey: 'usu_correo', header: 'Correo' },
        { 
            accessorKey: 'usu_cargo', 
            header: 'Cargo',
            cell: ({ getValue }) => truncate(getValue(), 20)
        },
        { accessorKey: 'usu_tipo', header: 'Tipo' },
        {
            accessorKey: 'usu_estado',
            header: 'Estado',
            enableColumnFilter: true,
            cell: ({ getValue }) => {
                const estado = getValue();
                return (
                    <div className="flex items-center gap-2 font-medium">
                        {estado === 'Habilitado' ? (
                            <>
                                <UserCheck className="h-4 w-4 text-green-700" />
                                <span className="text-green-700 dark:text-green-400">
                                    Habilitado
                                </span>
                            </>
                        ) : (
                            <>
                                <UserLock className="h-4 w-4 text-red-600" />
                                <span className="text-red-600 dark:text-red-400">
                                    Bloqueado
                                </span>
                            </>
                        )}
                    </div>
                );
            },
            meta: {
                label: 'Estado',
                variant: 'multiSelect',
                options: [
                    {
                        label: 'Habilitado',
                        value: 'Habilitado',
                        icon: UserCheck,
                    },
                    {
                        label: 'Bloqueado',
                        value: 'Bloqueado',
                        icon: UserLock,
                    },
                ],
            },
        },
        {
            accessorKey: 'usu_activo',
            header: 'Activo',
            meta: { 
                filterVariant: 'select',
                options: [
                    { label: 'Activo', value: true },
                    { label: 'Inactivo', value: false },
                ]
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
