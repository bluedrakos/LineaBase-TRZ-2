import LayoutDashboard from '@/app/layouts/AdminLayout';
import { usePermisos } from '@/core/auth/hooks/usePermisos';
import {
    fetchModulos,
    fetchModulosMeta,
} from '@/core/modulos/services/modulos.service';
import { TablaDatosGenerica } from '@/shared/components/data-table/TablaDatosGenerica';
import { Button } from '@/shared/ui/button';
import { Head, usePage } from '@/shared/app-bridge';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '@/shared/lib/toast';
import DialogCrearModulo from './components/DialogCrearModulo';
import DialogToggleActivoModulo from './components/DialogToggleActivoModulo';
import { ModuloTablaConfig } from './components/ModuloTablaConfig';

export default function ModulosIndex() {
    const [modulos, setModulos] = useState([]);
    const [tipoModulo, setTipoModulo] = useState([]);
    const [grupoMenu, setGrupoMenu] = useState([]);
    const [allowedTypeByGroup, setAllowedTypeByGroup] = useState({});
    const [acciones, setAcciones] = useState([]);
    const [siguienteOrdenPorTipo, setSiguienteOrdenPorTipo] = useState({});

    const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
    const [mostrarDialogActivo, setMostrarDialogActivo] = useState(false);
    const [abrirCrearModulo, setAbrirCrearModulo] = useState(false);
    const [soloLectura, setSoloLectura] = useState(false);
    const [moduloEdit, setModuloEdit] = useState(null);
    const [loading, setLoading] = useState(true);
    const { refreshAuth } = useAuth();

    const { puede } = usePermisos('gestion-modulos');

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [{ items }, meta] = await Promise.all([
                fetchModulos({ per_page: 300 }),
                fetchModulosMeta(),
            ]);

            setModulos(items);
            setTipoModulo(meta.tipo_modulo || []);
            setGrupoMenu(meta.grupo_menu || []);
            setAllowedTypeByGroup(meta.allowed_type_by_group || {});
            setAcciones(meta.acciones || []);
            setSiguienteOrdenPorTipo(meta.siguiente_orden_por_tipo || {});
            await refreshAuth();
        } catch (error) {
            toast.error(
                error.message || 'No se pudo cargar la gestión de módulos',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const columnas = ModuloTablaConfig({
        setAbrirCrear: setAbrirCrearModulo,
        setModuloEdit,
        setMostrarDialogActivo,
        setModuloSeleccionado,
        setSoloLectura,
        onRefresh: cargarDatos,
    });

    return (
        <LayoutDashboard>
            <Head title="Gestión de Módulos" />

            <div className="mx-auto w-full max-w-[1240px] space-y-6 pt-4 md:px-8 md:pt-8 md:pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Gestión de Módulos
                        </h2>
                        <p className="text-muted-foreground">
                            Lista de módulos configurados en el sistema.
                        </p>
                    </div>

                    {puede('crear') && (
                        <Button
                            onClick={() => {
                                setModuloEdit(null);
                                setSoloLectura(false);
                                setAbrirCrearModulo(true);
                            }}
                        >
                            <Plus className="h-4 w-4 dark:text-white" />
                            <span className="ml-2 hidden md:inline dark:text-white">
                                Crear Módulo
                            </span>
                        </Button>
                    )}
                </div>
                <TablaDatosGenerica
                    columns={columnas}
                    data={modulos}
                    filterKey="mod_nombre"
                    isLoading={loading}
                />
            </div>

            <DialogCrearModulo
                open={abrirCrearModulo}
                onOpenChange={(v) => {
                    setAbrirCrearModulo(v);
                    if (!v) setSoloLectura(false);
                }}
                moduloEdit={moduloEdit}
                tipoModulo={tipoModulo}
                grupoMenu={grupoMenu}
                allowedTypeByGroup={allowedTypeByGroup}
                acciones={acciones}
                siguienteOrdenPorTipo={siguienteOrdenPorTipo}
                readOnly={soloLectura}
                onSaved={cargarDatos}
            />

            <DialogToggleActivoModulo
                open={mostrarDialogActivo}
                onOpenChange={setMostrarDialogActivo}
                modulo={moduloSeleccionado}
                onSuccess={async () => {
                    setModuloSeleccionado(null);
                    await cargarDatos();
                }}
            />
        </LayoutDashboard>
    );
}
