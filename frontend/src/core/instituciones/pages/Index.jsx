import LayoutDashboard from '@/app/layouts/AdminLayout';
import { usePermisos } from '@/core/auth/hooks/usePermisos';
import { fetchInstituciones } from '@/core/instituciones/services/instituciones.service';
import { TablaDatosGenerica } from '@/shared/components/data-table/TablaDatosGenerica';
import { Button } from '@/shared/ui/button';
import { Head } from '@/shared/app-bridge';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DialogCrearInstitucion from './Components/DialogCrearInstitucion';
import { InstitucionTablaConfig } from './Components/InstitucionTablaConfig';

export default function InstitucionesIndex() {
    const [instituciones, setInstituciones] = useState([]);
    const [abrirCrearInstitucion, setAbrirCrearInstitucion] = useState(false);
    const [abrirEditarInstitucion, setAbrirEditarInstitucion] = useState(null);
    const [soloLectura, setSoloLectura] = useState(false);
    const [loading, setLoading] = useState(true);
    const { puede } = usePermisos('instituciones');

    const columnas = InstitucionTablaConfig({
        setAbrirEditarInstitucion,
        setAbrirCrearInstitucion,
        setSoloLectura,
    });

    const cargarInstituciones = async () => {
        setLoading(true);
        try {
            const { items } = await fetchInstituciones({ per_page: 200 });
            setInstituciones(items);
        } catch (error) {
            toast.error(
                error.message || 'No se pudieron cargar las instituciones',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarInstituciones();
    }, []);

    return (
        <LayoutDashboard>
            <Head title="Instituciones" />

            <div className="mx-auto w-full max-w-[1240px] space-y-4 pt-4 md:px-8 md:pt-8 md:pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Gestión de Instituciones
                        </h2>
                        <p className="text-muted-foreground">
                            Registro y administración de instituciones del
                            sistema.
                        </p>
                    </div>

                    {puede('crear') && (
                        <Button
                            onClick={() => {
                                setAbrirEditarInstitucion(null);
                                setAbrirCrearInstitucion(true);
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
                    isLoading={loading}
                />
            </div>

            <DialogCrearInstitucion
                open={abrirCrearInstitucion}
                onOpenChange={(v) => {
                    setAbrirCrearInstitucion(v);
                    if (!v) setSoloLectura(false);
                }}
                institucionEdit={abrirEditarInstitucion}
                readOnly={soloLectura}
                onSaved={cargarInstituciones}
            />
        </LayoutDashboard>
    );
}
