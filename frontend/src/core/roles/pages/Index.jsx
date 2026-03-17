import LayoutDashboard from '@/app/layouts/AdminLayout';
import { usePermisos } from '@/core/auth/hooks/usePermisos';
import {
    fetchRoles,
    fetchRolesMeta,
} from '@/core/roles/services/roles.service';
import { TablaDatosGenerica } from '@/shared/components/data-table/TablaDatosGenerica';
import { Button } from '@/shared/ui/button';
import { Head } from '@/shared/app-bridge';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '@/shared/lib/toast';
import DialogCrearRol from './components/DialogCrearRol';
import DialogToggleActivoRol from './components/DialogToggleActivoRol';
import { RolTablaConfig } from './components/RolTablaConfig';

export default function Index() {
    const [roles, setRoles] = useState([]);
    const [modulos, setModulos] = useState([]);
    const [areas, setAreas] = useState([]);

    const [abrirCrearRol, setAbrirCrearRol] = useState(false);
    const [rolEdit, setRolEdit] = useState(null);
    const [mostrarDialogActivo, setMostrarDialogActivo] = useState(false);
    const [modoEdicion, setModoEdicion] = useState('todo');
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [soloLectura, setSoloLectura] = useState(false);
    const [loading, setLoading] = useState(true);

    const { puede } = usePermisos('gestion-de-permisos');

    const cargarRoles = async () => {
        setLoading(true);
        try {
            const [{ items }, meta] = await Promise.all([
                fetchRoles({ per_page: 200 }),
                fetchRolesMeta(),
            ]);
            setRoles(items);
            setModulos(meta.modulos || []);
            setAreas(meta.areas || []);
        } catch (error) {
            toast.error(error.message || 'No se pudo cargar roles y permisos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarRoles();
    }, []);

    const columnas = RolTablaConfig({
        setAbrirCrear: setAbrirCrearRol,
        setRolEdit,
        setRolSeleccionado,
        setMostrarDialogActivo,
        setModoEdicion,
        setSoloLectura,
    });

    return (
        <LayoutDashboard>
            <Head title="Gestión de Roles" />
            <div className="mx-auto w-full max-w-[1240px] space-y-4 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Gestión y asignación de Roles y permisos
                        </h2>
                        <p className="text-muted-foreground">
                            Información detallada sobre los roles y permisos que
                            pueden hacer en cada uno de los módulos.
                        </p>
                    </div>
                    {puede('crear') && (
                        <Button
                            onClick={() => {
                                setRolEdit(null);
                                setSoloLectura(false);
                                setAbrirCrearRol(true);
                                setModoEdicion('todo');
                            }}
                        >
                            <Plus className="h-4 w-4 dark:text-white" />
                            <span className="ml-2 hidden md:inline dark:text-white">
                                Crear Rol
                            </span>
                        </Button>
                    )}
                </div>
                <TablaDatosGenerica
                    columns={columnas}
                    data={roles}
                    filterKey="rol_nombre"
                    isLoading={loading}
                />
            </div>

            <DialogCrearRol
                open={abrirCrearRol}
                onOpenChange={(v) => {
                    setAbrirCrearRol(v);
                    if (!v) setSoloLectura(false);
                }}
                rolEdit={rolEdit}
                modoEdicion={modoEdicion}
                readOnly={soloLectura}
                modulos={modulos}
                areas={areas}
                onSaved={cargarRoles}
            />

            <DialogToggleActivoRol
                open={mostrarDialogActivo}
                onOpenChange={setMostrarDialogActivo}
                rol={rolSeleccionado}
                onSuccess={async () => {
                    setRolSeleccionado(null);
                    await cargarRoles();
                }}
            />
        </LayoutDashboard>
    );
}
