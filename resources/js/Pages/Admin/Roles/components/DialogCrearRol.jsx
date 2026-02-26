import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import React, { useEffect, useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import DialogBase from "@/Components/General/DialogBase";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { Textarea } from "@headlessui/react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Spinner } from "@/Components/ui/spinner";
import CargandoDialog from "@/Components/General/CargandoDialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";


export default function DialogCrearRol({
    open,
    onOpenChange,
    rolEdit = null,
    modoEdicion = "todo",
    readOnly = false,
}) {
    const [loading, setLoading] = useState(false);
    const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
    const { modulos, permisosPorRol, areas = [] } = usePage().props;
    const [form, setForm] = useState({
        rol_nombre: "",
        rol_descripcion: "",
        rol_activo: true,
        area_id: "",
    });

    const [accionesSeleccionadas, setAccionesSeleccionadas] = useState([]);
    const moduloCompleto = (mod) =>
        mod.modulo_acciones.some(a => accionesSeleccionadas.includes(a.mac_id));

    const toggleAccion = (id) => {
        if (readOnly) return;
        setAccionesSeleccionadas((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };
    useEffect(() => {
        if (rolEdit) {
            setForm({
                rol_nombre: rolEdit.rol_nombre,
                rol_descripcion: rolEdit.rol_descripcion,
                rol_activo: Boolean(rolEdit.rol_activo),
                area_id: rolEdit.area_id ? String(rolEdit.area_id) : "",
            });

            const permisos = rolEdit?.permisos?.map(p => p.mac_id) ?? [];
            setAccionesSeleccionadas(permisos);
        } else {
            setForm({
                rol_nombre: "",
                rol_descripcion: "",
                rol_activo: true,
                area_id: "",
            });

            setAccionesSeleccionadas([]);
        }
    }, [rolEdit]);
    console.log("Acciones seleccionadas:", accionesSeleccionadas);
    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };
    const esEdicion = Boolean(rolEdit);

    const handleClose = () => {
        if (!rolEdit) {
            setForm({
                rol_nombre: "",
                rol_descripcion: "",
                rol_activo: true,
                area_id: "",
            });

            setAccionesSeleccionadas([]);
        }
        onOpenChange(false);
    };

    const handleSubmit = () => {
        setLoading(true);

        const datafinal = {
            ...form,
            acciones: accionesSeleccionadas,
        };

        const finish = () => {
            setLoading(false);
            handleClose();
        };

        if (esEdicion) {
            router.put(
                route("admin.rol.update", rolEdit.rol_id),
                datafinal,
                {
                    onSuccess: () => {
                        toast.success("Rol actualizado correctamente");
                        finish();
                    },
                    onError: () => {
                        toast.error("Ocurrió un error al actualizar el rol.");
                        setLoading(false);
                    }
                }
            );
        } else {
            router.post(
                route("admin.rol.store"),
                datafinal,
                {
                    onSuccess: () => {
                        toast.success("Rol creado correctamente");
                        finish();
                    },
                    onError: () => {
                        toast.error("Ocurrió un error al crear el rol.");
                        setLoading(false);
                    }
                }
            );
        }
    };
    return (


            <DialogBase open={open}
                onOpenChange={handleClose}
                title={esEdicion ? "Editar Rol" : "Crear Rol"}
                description={esEdicion ? "Modifica los datos del rol seleccionado." : "Define los datos del nuevo rol."}
                className={
                    modoEdicion === "datos"
                        ? "sm:max-w-96"
                        : modoEdicion === "permisos"
                            ? "sm:max-w-5xl"
                            : "sm:max-w-6xl"
                }>


                <CargandoDialog show={loading}></CargandoDialog>

                <div
                    className={
                        (modoEdicion === "datos" || modoEdicion === "permisos")
                            ? "flex justify-center py-6"
                            : "grid grid-cols-1 lg:grid-cols-3 gap-6 py-4"
                    }
                >
                    {(modoEdicion === "todo" || modoEdicion === "datos") && (
                        <div className="lg:col-span-1 border rounded-lg p-5">
                            <h3 className="text-lg font-semibold mb-4">Datos del rol</h3>
                            {/* Coluna izquierda */}
                            <div className="space-y-4">
                                <div>
                                    <Label>Nombre del rol</Label>
                                    <Input
                                        className=""
                                        value={form.rol_nombre}
                                        readOnly={readOnly}
                                        onChange={(e) => {
                                            if (readOnly) return;
                                            const value = e.target.value;
                                            updateField("rol_nombre", value);
                                        }}
                                    />

                                </div>
                                <div>
                                    <Label>Descripción del rol</Label>
                                    <Textarea
                                        className="w-full border shadow rounded-md p-2"
                                        value={form.rol_descripcion}
                                        readOnly={readOnly}
                                        onChange={(e) => {
                                            if (readOnly) return;
                                            const value = e.target.value;
                                            updateField("rol_descripcion", value);
                                        }}
                                    />

                                </div>
                                <div>
                                    <Label>Área asociada (Gestión de Sensores)</Label>
                                    <Select
                                        value={form.area_id}
                                        onValueChange={(value) => {
                                            if (readOnly) return;
                                            updateField("area_id", value);
                                        }}
                                        disabled={readOnly}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sin área asignada (Ver todo)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="null">Sin área asignada (Ver todo)</SelectItem>
                                            {areas.map((area) => (
                                                <SelectItem
                                                    key={area.area_id}
                                                    value={String(area.area_id)}
                                                >
                                                    {area.area_nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        Si selecciona un área, este rol sólo podrá ver/gestionar sensores de dicha área.
                                    </p>
                                </div>
                            </div>
                        </div>

                    )}
                    {/* Columna derecha */}
                    {(modoEdicion === "todo" || modoEdicion === "permisos") && (
                        <div
                            className={
                                modoEdicion === "permisos"
                                    ? "w-full max-w-5xl mx-auto border rounded-lg p-5"
                                    : "lg:col-span-2 border rounded-lg p-5"
                            }
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={moduloSeleccionado ? moduloSeleccionado.mod_id : "modulos"}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                >
                                    {!moduloSeleccionado && (
                                        <>
                                            <h3 className="text-lg font-semibold mb-4">Seleccione un módulo</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {modulos.map(mod => {
                                                    const Icon = Icons[mod.mod_icono] ?? Icons.Circle;
                                                    const completo = moduloCompleto(mod);
                                                    return (
                                                        <button
                                                            key={mod.mod_id}
                                                            onClick={() => setModuloSeleccionado(mod)}
                                                            className={`
                                                            p-4 border rounded-lg flex flex-col items-center text-center gap-2
                                                            transition cursor-pointer
                                                            ${completo ? "bg-green-50 border-green-600" : "hover:bg-gray-50"}
                                                        `}
                                                        >
                                                            <Icon className="w-7 h-7" />
                                                            <span className="font-medium">{mod.mod_nombre}</span>

                                                            {completo && (
                                                                <span className="text-green-700 text-sm"> Configurado</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-3">
                                                Puede dejar módulos sin permisos. Sólo configure los necesarios.
                                            </p>
                                        </>
                                    )}

                                    {moduloSeleccionado && (
                                        <>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold">
                                                    Permisos para: {moduloSeleccionado.mod_nombre}
                                                </h3>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setModuloSeleccionado(null)}
                                                    >
                                                        Volver
                                                    </Button>
                                                    {!readOnly && (
                                                        <Button onClick={() => setModuloSeleccionado(null)}>
                                                            Guardar módulo
                                                        </Button>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                                {moduloSeleccionado.modulo_acciones.map(accion => {
                                                    const estaSeleccionada = accionesSeleccionadas.includes(accion.mac_id);
                                                    const Icon = Icons[accion.accion.acc_icono] ?? Icons.Circle;

                                                    return (

                                                        <button
                                                            key={accion.mac_id}
                                                            onClick={() => toggleAccion(accion.mac_id)}
                                                            className={`
                                                                p-3 border rounded-lg transition flex flex-col items-center text-center gap-2
                                                                ${estaSeleccionada
                                                                    ? "bg-blue-50 border-[#004064] text-[#004064] shadow"
                                                                    : "hover:bg-gray-50"}
                                                            `}
                                                        >
                                                            <Icon className="w-5 h-5" />
                                                            {accion.accion.acc_nombre}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}

                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={handleClose}>
                        {readOnly ? "Cerrar" : "Cancelar"}
                    </Button>
                    {!readOnly && (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="transition-all"
                        >
                            {loading ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                esEdicion ? "Guardar cambios" : "Crear rol"
                            )}
                        </Button>
                    )}
                </DialogFooter>


            </DialogBase>


    );


}
