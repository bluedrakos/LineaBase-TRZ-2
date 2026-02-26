import { TablaDatosGenerica } from '@/Components/General/Tabla/TablaDatosGenerica';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { usePermisos } from '@/hooks/usePermisos';
import LayoutDashboard from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RolTablaConfig } from './components/RolTablaConfig';
import DialogCrearRol from "./components/DialogCrearRol";
import DialogToggleActivoRol from './components/DialogToggleActivoRol';
export default function Index() {

    const { modulos, roles, permisos, permisosPorRol } = usePage().props;
    const [abrirCrearRol, setAbrirCrearRol] = useState(false);
    const [rolEdit, setRolEdit] = useState(null);
    const [mostrarDialogActivo, setMostrarDialogActivo] = useState(false);
    const [modoEdicion, setModoEdicion] = useState("todo");
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [soloLectura, setSoloLectura] = useState(false);

    const { puede } = usePermisos("gestion-de-permisos");

    const columnas = RolTablaConfig({
        setAbrirCrear: setAbrirCrearRol,
        setRolEdit: setRolEdit,
        setRolSeleccionado,
        setMostrarDialogActivo,
        setModoEdicion,
        setSoloLectura: setSoloLectura,

    });

    return (
        <LayoutDashboard>
            <Head title="Detalles del Usuario" />
            <div className="max-w-[1240px] mx-auto w-full space-y-4 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Gestión y asignación de Roles y permisos
                        </h2>
                        <p className="text-muted-foreground">
                            Información detallada sobre los roles y permisos que pueden hacer en cada uno de los módulos.
                        </p>
                    </div>
                    {puede("crear") && (
                        <Button
                            onClick={() => {
                                setRolEdit(null);
                                setSoloLectura(false);
                                setAbrirCrearRol(true);
                                setModoEdicion("todo");
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
                />
            </div>


            <DialogCrearRol
                open={abrirCrearRol}
                onOpenChange={(v) => { setAbrirCrearRol(v); if (!v) setSoloLectura(false); }}
                rolEdit={rolEdit}
                modoEdicion={modoEdicion}
                readOnly={soloLectura}
            />

            <DialogToggleActivoRol
                open={mostrarDialogActivo}
                onOpenChange={setMostrarDialogActivo}
                rol={rolSeleccionado}
                onSuccess={() => setRolSeleccionado(null)}
            />
        </LayoutDashboard>
    );
}
