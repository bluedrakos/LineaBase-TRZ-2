import * as Icons from "lucide-react";
import { router } from "@inertiajs/react";
import { GenerarColumnas } from "@/Components/General/Tabla/GenerarColumnas";
import { usePermisos } from "@/hooks/usePermisos";
import { toast } from "sonner";

export function ModuloTablaConfig({
    setAbrirCrear,
    setModuloEdit,
    setModuloSeleccionado,
    setMostrarDialogActivo,
    setSoloLectura,
}) {
    
    const { puede, iconoDe } = usePermisos("gestion-modulos");

    
    const permisosAcciones = (modulo) => {
        const acciones = [];

        if (puede("ver")) {
            acciones.push({
                label: "Ver",
                icon: iconoDe("ver"),
                variant: "primary",
                onClick: (item) => {
                    setModuloEdit(item);
                    setSoloLectura?.(true);
                    setAbrirCrear(true);
                },
            });
        }

        if (puede("editar")) {
            acciones.push({
                label: "Editar",
                icon: iconoDe("editar"),
                variant: "secondary",
                onClick: (item) => {
                    setModuloEdit(item);
                    setSoloLectura?.(false);
                    setAbrirCrear(true);
                },
            });
        }

        acciones.push({ separador: true });

        if (puede('desactivar')) {
            acciones.push({
                label: modulo.mod_activo
                    ? 'Desactivar'
                    : 'Activar',
                icon: modulo.mod_activo ? iconoDe('desactivar') : iconoDe('activar'),
                variant: 'danger',
                onClick: (item) => {
                    setModuloSeleccionado(item);
                    setMostrarDialogActivo(true);
                },
            });
        }

        if (puede('eliminar')) {
            acciones.push({
                label: 'Eliminar',
                icon: iconoDe('eliminar'),
                variant: 'danger',
                onClick: (item) => {
                    router.delete(route('admin.modulos.destroy', item.mod_id), {
                        onSuccess: () => {
                            toast.success('Módulo eliminado correctamente');
                        },
                        onError: (errors) => {
                            toast.error(errors?.error || 'Ocurrió un error al eliminar el módulo.');
                            console.error('Errores de eliminación:', errors);
                        },
                    });
                },
            });
        }



        return acciones;
    };
    const extra = [

        {
            accessorKey: "mod_nombre",
            header: "Nombre",
            cell: ({ row }) => {
                const { mod_nombre, mod_icono } = row.original;

                const Icono = Icons[mod_icono] || Icons.HelpCircle;

                return (
                    <div className="flex items-center gap-2">
                        <Icono className="h-4 w-4 text-gray-600" />
                        <span>{mod_nombre}</span>
                    </div>
                );
            }
        },
        { accessorKey: "mod_slug", header: "Slug" },

        {
            id: "tipo_modulo",
            accessorKey: "tipo_modulo.tmo_nombre",
            header: "Tipo de módulo",
            meta: { filterVariant: 'select' },
            cell: ({ row }) => {
                const tipo = row.original.tipo_modulo;

                const Icono = Icons[tipo.tmo_icono] || Icons.HelpCircle;

                return (
                    <div className="flex items-center gap-2">
                        <Icono className="h-4 w-4 text-gray-600" />
                        <span>{tipo.tmo_nombre}</span>
                    </div>
                );
            }
        },

        { accessorKey: "mod_orden", header: "Orden" },

        {
            accessorKey: "mod_activo",
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
                return activo ? (
                    <span className="text-green-600 font-semibold">Activo</span>
                ) : (
                    <span className="text-red-600 font-semibold">Inactivo</span>
                );
            },
        },
    ];

    return GenerarColumnas({
        extra,
        permisosAcciones,
    });
}
