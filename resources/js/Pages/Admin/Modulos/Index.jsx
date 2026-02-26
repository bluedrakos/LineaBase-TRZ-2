import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import LayoutDashboard from "@/Layouts/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";
import { TablaDatosGenerica } from "@/Components/General/Tabla/TablaDatosGenerica";
import { toast } from "sonner";
import { usePermisos } from "@/hooks/usePermisos";
import { ModuloTablaConfig } from "./components/ModuloTablaConfig";

import DialogToggleActivoModulo from "./components/DialogToggleActivoModulo";
import DialogCrearModulo from "./components/DialogCrearModulo";

export default function ModulosIndex() {
    const { modulos, permisos, tipoModulo, grupoMenu, allowedTypeByGroup, acciones, siguienteOrdenPorTipo } = usePage().props;

    const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
    const [mostrarDialogActivo, setMostrarDialogActivo] = useState(false);

    const [abrirCrearModulo, setAbrirCrearModulo] = useState(false);
    const [soloLectura, setSoloLectura] = useState(false);
    const [moduloEdit, setModuloEdit] = useState(null);
    const [moduloToDelete, setModuloToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [moduloToToggle, setModuloToToggle] = useState(null);
    const [showToggleModal, setShowToggleModal] = useState(false);

    const { puede } = usePermisos("gestion-modulos");

    const columnas = ModuloTablaConfig({
        setAbrirCrear: setAbrirCrearModulo,
        setModuloEdit: setModuloEdit,
        setMostrarDialogActivo,
        setModuloSeleccionado,
        setModuloToDelete,
        setShowDeleteModal,
        setModuloToToggle,
        setShowToggleModal,
        setSoloLectura: setSoloLectura,
    });

    return (
        <LayoutDashboard>
            <Head title="Gestión de Módulos" />

            <div className="max-w-[1240px] mx-auto w-full space-y-6 pt-4 md:px-8 md:pt-8 md:pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Gestión de Módulos
                        </h2>
                        <p className="text-muted-foreground">
                            Lista de módulos configurados en el sistema.
                        </p>
                    </div>

                    {puede("crear") && (
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
                />
            </div>

            <DialogCrearModulo
                open={abrirCrearModulo}
                onOpenChange={(v) => { setAbrirCrearModulo(v); if (!v) setSoloLectura(false); }}
                moduloEdit={moduloEdit}
                tipoModulo={tipoModulo}
                grupoMenu={grupoMenu}
                allowedTypeByGroup={allowedTypeByGroup}
                acciones={acciones}
                siguienteOrdenPorTipo={siguienteOrdenPorTipo}
                readOnly={soloLectura}
            />

            <DialogToggleActivoModulo
                open={mostrarDialogActivo}
                onOpenChange={setMostrarDialogActivo}
                modulo={moduloSeleccionado}
                onSuccess={() => setModuloSeleccionado(null)}
            />

            {/* <DialogDeleteModulo
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
                modulo={moduloToDelete}
                onSuccess={() => setModuloToDelete(null)}
            /> */}
        </LayoutDashboard>
    );
}
