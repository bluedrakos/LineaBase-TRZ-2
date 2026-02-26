import { router } from '@inertiajs/react'
import { GenerarColumnas } from '@/Components/General/Tabla/GenerarColumnas'
import { usePermisos } from "@/hooks/usePermisos"
import { truncate } from '@/lib/utils'
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Info
} from 'lucide-react'

export function InstitucionTablaConfig({
    setAbrirEditarInstitucion,
    setAbrirCrearInstitucion,
    setSoloLectura,
}) {

    const { puede, iconoDe } = usePermisos("instituciones")

    const permisosAcciones = (institucion) => {
        const acciones = []

        if (puede('ver')) {
            acciones.push({
                label: 'Ver',
                icon: iconoDe('ver'),
                variant: 'primary',
                onClick: (item) => {
                    setAbrirEditarInstitucion(item);
                    setSoloLectura?.(true);
                    setAbrirCrearInstitucion(true);
                },
            })
        }

        if (puede('editar')) {
            acciones.push({
                label: 'Editar',
                icon: iconoDe('editar'),
                variant: 'secondary',
                onClick: (item) => {
                    setAbrirEditarInstitucion(item)
                    setAbrirCrearInstitucion(true)
                },
            })
        }

        return acciones
    }

    const extra = [
        {
            accessorKey: 'ins_nombre',
            header: 'Nombre',
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2 font-medium">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'ins_sigla',
            header: 'Sigla',
        },
        {
            accessorKey: 'ins_rut',
            header: 'RUT',
        },
        {
            accessorKey: 'ins_correo',
            header: 'Correo',
            cell: ({ getValue }) =>
                getValue() ? (
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {getValue()}
                    </div>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
        {
            accessorKey: 'ins_telefono',
            header: 'Teléfono',
            cell: ({ getValue }) =>
                getValue() ? (
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {getValue()}
                    </div>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
        {
            accessorKey: 'ins_direccion',
            header: 'Dirección',
            cell: ({ getValue }) =>
                getValue() ? (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {truncate(getValue(), 20)}
                    </div>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
        {
            accessorKey: 'ins_descripcion',
            header: 'Descripción',
            cell: ({ getValue }) =>
                getValue() ? (
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        {truncate(getValue(), 20)}
                    </div>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
    ]

    return GenerarColumnas({
        extra,
        permisosAcciones,
    })
}
