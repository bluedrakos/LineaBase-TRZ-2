import { Checkbox } from '@/shared/ui/checkbox';
import { CeldaAcciones } from './CeldaAcciones';

export function GenerarColumnas({ extra = [], permisosAcciones, conSeleccion = false }) {
    const columnas = [];

    if (conSeleccion) {
        columnas.push({
            id: 'seleccionar',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(valor) =>
                        table.toggleAllPageRowsSelected(!!valor)
                    }
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(valor) => row.toggleSelected(!!valor)}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        });
    }

    return [
        ...columnas,
        ...extra,
        {
            id: 'acciones',
            header: 'Acciones',
            enableHiding: false,
            cell: ({ row }) => (
                <CeldaAcciones
                    item={row.original}
                    acciones={
                        permisosAcciones ? permisosAcciones(row.original) : []
                    }
                />
            ),
        },
    ];
}
