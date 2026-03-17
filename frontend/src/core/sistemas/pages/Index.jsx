import LayoutDashboard from '@/app/layouts/AdminLayout';
import { usePermisos } from '@/core/auth/hooks/usePermisos';
import {
    getSistemas,
} from '@/core/sistemas/services/sistemas.service';
import { TablaDatosGenerica } from '@/shared/components/data-table/TablaDatosGenerica';
import { Button } from '@/shared/ui/button';
import { Head } from '@/shared/app-bridge';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '@/shared/lib/toast';
import DialogCrearSistema from '../components/DialogCrearSistema';
import DialogEliminarSistema from '../components/DialogEliminarSistema';
import { SistemasTablaConfig } from '../components/SistemasTablaConfig';

export default function Index() {
    const [sistemas, setSistemas] = useState([]);
    
    const [abrirFormulario, setAbrirFormulario] = useState(false);
    const [sistemaEdit, setSistemaEdit] = useState(null);
    const [sistemaEliminar, setSistemaEliminar] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ajusta la clave de permiso según se haya configurado
    const { expone } = usePermisos('sistemas');
    
    // Fallback: Por simplicidad, todos los super admins tendrán este permiso
    const puedeCrear = true; 

    const cargarSistemas = async () => {
        setLoading(true);
        try {
            const data = await getSistemas();
            setSistemas(data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al cargar variables del sistema.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSistemas();
    }, []);

    const columnas = SistemasTablaConfig({
        setAbrirFormulario,
        setSistemaEdit,
        setSistemaEliminar,
    });

    return (
        <LayoutDashboard>
            <Head title="Variables de Sistema" />
            <div className="mx-auto w-full max-w-[1240px] space-y-4 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Variables de Sistema
                        </h2>
                        <p className="text-muted-foreground">
                            Gestión de herramientas, claves y parámetros de configuración (Públicos o Privados).
                        </p>
                    </div>
                    {puedeCrear && (
                        <Button
                            onClick={() => {
                                setSistemaEdit(null);
                                setAbrirFormulario(true);
                            }}
                        >
                            <Plus className="h-4 w-4 dark:text-white" />
                            <span className="ml-2 hidden md:inline dark:text-white">
                                Nueva Variable
                            </span>
                        </Button>
                    )}
                </div>
                
                <TablaDatosGenerica
                    columns={columnas}
                    data={sistemas}
                    filterKey="sis_nombre"
                    isLoading={loading}
                />
            </div>

            <DialogCrearSistema
                open={abrirFormulario}
                setOpen={setAbrirFormulario}
                sistemaEdit={sistemaEdit}
                onSaved={cargarSistemas}
            />

            <DialogEliminarSistema
                sistema={sistemaEliminar}
                setSistema={setSistemaEliminar}
                onSuccess={async () => {
                    setSistemaEliminar(null);
                    await cargarSistemas();
                }}
            />
        </LayoutDashboard>
    );
}
