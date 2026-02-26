import * as Icons from "lucide-react";
import { router } from "@inertiajs/react";
import { GenerarColumnas } from "@/Components/General/Tabla/GenerarColumnas";
import { usePermisos } from "@/hooks/usePermisos";
import { CheckCircle, UserCheck, UserLock, XCircle } from 'lucide-react';
import { truncate } from "@/lib/utils";

export function RolTablaConfig({
    setAbrirCrear,
    setRolEdit,
    setRolSeleccionado,
    setMostrarDialogActivo,
    setModoEdicion,
    setSoloLectura,
}) {

    const { puede, iconoDe } = usePermisos("gestion-de-permisos");


    const permisosAcciones = (rol) => {
        const acciones = [];

        if (puede("ver")) {
            acciones.push({
                label: "Ver",
                icon: iconoDe("ver"),
                variant: "primary",
                onClick: (item) => {
                    setRolEdit(item);
                    setModoEdicion("todo");
                    setSoloLectura?.(true);
                    setAbrirCrear(true);
                },
            });
        }

        if (puede("editar")) {
            acciones.push({
                label: "Editar Perfil",
                icon: iconoDe("editar"),
                variant: "secondary",
                onClick: (item) => {
                    setRolEdit(item);
                    setSoloLectura?.(false);
                    setAbrirCrear(true);
                    setModoEdicion("datos");
                },
            });
        }
        if (puede("editar")) {
            acciones.push({
                label: "Editar Permisos",
                icon: iconoDe("editar"),
                variant: "secondary",
                onClick: (item) => {
                    setRolEdit(item);
                    setSoloLectura?.(false);
                    setAbrirCrear(true);
                    setModoEdicion("permisos");
                },
            });
        }

        acciones.push({ separador: true });

        if (puede("activar")) {
            acciones.push({
                label: rol.rol_activo ? "Desactivar" : "Activar",
                icon: iconoDe(rol.rol_activo ? "activar" : "activar"),
                variant: rol.rol_activo ? "danger" : "success",
                onClick: () => {
                    setRolSeleccionado(rol);
                    setMostrarDialogActivo(true);
                },
            });
        }


        // if (puede('eliminar')) {
        //     acciones.push({
        //         label: 'Eliminar',
        //         icon: iconoDe('eliminar'),
        //         variant: 'danger',
        //         onClick: (item) => {
        //             console.log("Eliminar módulo:", item);
        //             router.delete(route('admin.modulos.destroy', item.mod_id), {
        //                 onSuccess: () => {
        //                     toast.success('Módulo eliminado correctamente');
        //                 },
        //                 onError: (errors) => {
        //                     toast.error(errors?.error || 'Ocurrió un error al eliminar el módulo.');
        //                     console.error('Errores de eliminación:', errors);
        //                 },
        //             });
        //         },
        //     });
        // }



        return acciones;
    };
    const extra = [

        {
            accessorKey: "rol_nombre",
            header: "Nombre",
        },
        { 
            accessorKey: "rol_descripcion", 
            header: "Descripcion",
            cell: ({ getValue }) => truncate(getValue(), 20)
        },

        {
            accessorKey: "rol_activo",
            header: "Activo",
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
