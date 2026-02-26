import * as Icons from "lucide-react";
import { GenerarColumnas } from "@/Components/General/Tabla/GenerarColumnas";
import { usePermisos } from "@/hooks/usePermisos";
import { router } from "@inertiajs/react";
import { truncate } from "@/lib/utils";

export function AuditoriaTablaConfig({ onVer }) {

    const { puede, iconoDe } = usePermisos("auditorias");


    const permisosAcciones = (item) => {
        const acciones = [];

        if (puede("ver")) {
            acciones.push({
                label: "Ver data",
                icon: iconoDe("ver"),
                variant: "primary",
                onClick: () => onVer(item),
            });
        }


        // if (puede('eliminar')) {
        //     acciones.push({
        //         label: 'Eliminar',
        //         icon: iconoDe('eliminar'),
        //         variant: 'danger',
        //         onClick: (item) => {
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
            accessorKey: "aud_metodo",
            header: "Método",
            meta: { filterVariant: 'select' },
            cell: ({ getValue }) => {
                const metodo = getValue();

                const colores = {
                    GET: "text-blue-600",
                    POST: "text-green-600",
                    PUT: "text-yellow-600",
                    PATCH: "text-orange-600",
                    DELETE: "text-red-600",
                };

                const Icono = {
                    GET: Icons.Search,
                    POST: Icons.PlusCircle,
                    PUT: Icons.Pencil,
                    PATCH: Icons.Edit3,
                    DELETE: Icons.Trash2,
                }[metodo] ?? Icons.HelpCircle;

                return (
                    <div className="flex items-center gap-2">
                        <Icono className={`h-4 w-4 ${colores[metodo] || "text-gray-500"}`} />
                        <span>{metodo}</span>
                    </div>
                );
            }
        },

        {
            id: "usuario",
            accessorKey: "usuario.usu_nombre",
            header: "Usuario",
            meta: { filterVariant: 'select' },
            cell: ({ row }) => {
                const user = row.original.usuario;

                if (!user) {
                    return <span className="text-gray-400 italic">Desconocido</span>;
                }

                return (
                    <span>{user.usu_nombre} {user.usu_apellidos}</span>
                );
            }
        },
        {
            accessorKey: "aud_ip",
            header: "Dirección IP",
        },

        {
            accessorKey: "aud_accion",
            header: "Acción realizada",
            meta: { filterVariant: 'select' },
        },

        {
            accessorKey: "aud_descripcion",
            header: "Descripción",
            cell: ({ getValue }) => {
                const val = getValue();
                return val
                    ? <span>{truncate(val, 20)}</span>
                    : <span className="text-gray-400 italic">—</span>;
            }
        },

        {
            accessorKey: "aud_id_afectado",
            header: "ID afectado",
            cell: ({ getValue }) => {
                const val = getValue();
                return val
                    ? <span>{val}</span>
                    : <span className="text-gray-400 italic">—</span>;
            }
        },

        {
            accessorKey: "created_at",
            header: "Fecha",
            cell: ({ getValue }) => {
                const fecha = new Date(getValue());
                return fecha.toLocaleString("es-CL", {
                    dateStyle: "short",
                    timeStyle: "short",
                });
            }
        },
    ];

    return GenerarColumnas({
        extra,
        permisosAcciones,
    });
}
