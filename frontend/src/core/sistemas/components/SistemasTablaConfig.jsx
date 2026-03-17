import { GenerarColumnas } from '@/shared/components/data-table/GenerarColumnas';
import { usePermisos } from '@/core/auth/hooks/usePermisos';
import { Pencil, Trash2, Globe, Lock } from 'lucide-react';

export function SistemasTablaConfig({
    setAbrirFormulario,
    setSistemaEdit,
    setSistemaEliminar,
}) {
    const { tienePermiso, iconoDe } = usePermisos('sistemas');

    const permisosAcciones = (sistema) => {
        const acciones = [];

        acciones.push({
            label: 'Editar',
            icon: iconoDe('editar') || <Pencil className="h-4 w-4" />,
            variant: 'secondary',
            onClick: (item) => {
                setSistemaEdit(item);
                setAbrirFormulario(true);
            },
        });

        acciones.push({
            label: 'Eliminar',
            icon: iconoDe('eliminar') || <Trash2 className="h-4 w-4" />,
            variant: 'danger',
            onClick: (item) => {
                setSistemaEliminar(item);
            },
        });

        return acciones;
    };

    const extra = [
        {
            accessorKey: 'sis_nombre',
            header: 'Nombre',
        },
        {
            accessorKey: 'sis_tipo',
            header: 'Tipo',
            enableColumnFilter: true,
            meta: {
                label: 'Tipo',
                variant: 'multiSelect',
                options: [
                    { label: 'Público', value: 'Publico', icon: Globe },
                    { label: 'Privado', value: 'Privado', icon: Lock },
                ],
            },
            cell: ({ getValue }) => {
                const tipo = getValue();
                const esPublico = tipo === 'Publico';
                return (
                    <div className="flex items-center gap-2 font-medium">
                        {esPublico ? (
                            <>
                                <Globe className="h-4 w-4 text-blue-600" />
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Público
                                </span>
                            </>
                        ) : (
                            <>
                                <Lock className="h-4 w-4 text-purple-600" />
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    Privado
                                </span>
                            </>
                        )}
                    </div>
                );
            }
        },
        {
            accessorKey: 'sis_descripcion',
            header: 'Descripción',
        },
        {
            accessorKey: 'sis_valor',
            header: 'Valor',
            cell: ({ getValue }) => {
                const valor = getValue();
                return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border border-border">{valor}</code>;
            }
        },
    ];

    return GenerarColumnas({
        extra,
        permisosAcciones,
    });
}
