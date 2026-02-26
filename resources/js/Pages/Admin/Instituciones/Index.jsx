import { Head, usePage } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/Components/ui/button'
import LayoutDashboard from '@/Layouts/AdminLayout'
import { TablaDatosGenerica } from '@/Components/General/Tabla/TablaDatosGenerica'
import { InstitucionTablaConfig } from './Components/InstitucionTablaConfig'
import { usePermisos } from "@/hooks/usePermisos"
import DialogCrearInstitucion from './Components/DialogCrearInstitucion'

export default function InstitucionesIndex() {
    const { instituciones } = usePage().props

    const [abrirCrearInstitucion, setAbrirCrearInstitucion] = useState(false)
    const [abrirEditarInstitucion, setAbrirEditarInstitucion] = useState(null)
    const [soloLectura, setSoloLectura] = useState(false)

    const { puede } = usePermisos("instituciones")

    const columnas = InstitucionTablaConfig({
        setAbrirEditarInstitucion,
        setAbrirCrearInstitucion,
        setSoloLectura: setSoloLectura,
    })

    return (
        <LayoutDashboard>
            <Head title="Instituciones" />

            <div className="max-w-[1240px] mx-auto w-full space-y-4 pt-4 md:px-8 md:pt-8 md:pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Gestión de Instituciones
                        </h2>
                        <p className="text-muted-foreground">
                            Registro y administración de instituciones del sistema.
                        </p>
                    </div>

                    {puede("crear") && (
                        <Button
                            onClick={() => {
                                setAbrirEditarInstitucion(null)
                                setAbrirCrearInstitucion(true)
                            }}
                        >
                            <Plus className="h-4 w-4 dark:text-white" />
                            <span className="ml-2 hidden md:inline dark:text-white">
                                Crear Institución
                            </span>
                        </Button>
                    )}
                </div>

                <TablaDatosGenerica
                    columns={columnas}
                    data={instituciones}
                    filterKey="ins_nombre"
                />
            </div>

            <DialogCrearInstitucion
                open={abrirCrearInstitucion}
                onOpenChange={(v) => { setAbrirCrearInstitucion(v); if (!v) setSoloLectura(false); }}
                institucionEdit={abrirEditarInstitucion}
                readOnly={soloLectura}
            />
        </LayoutDashboard>
    )
}
