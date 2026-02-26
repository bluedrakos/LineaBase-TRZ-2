import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/Components/ui/select";
import * as Icons from "lucide-react";
import { Button } from "@/Components/ui/button";
import IconPicker from "./IconPicker";
import DialogBase from "@/Components/General/DialogBase";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import CargandoDialog from "@/Components/General/CargandoDialog";

// Estado inicial del formulario
const defaultForm = {
    mod_nombre: "",
    mod_slug: "",
    mod_icono: "",
    mod_orden: 1,
    mod_activo: true,
    gme_id: "",
    tmo_id: "",
};

export default function DialogCrearModulo({
    open,
    onOpenChange,
    moduloEdit = null,
    tipoModulo = [],
    grupoMenu = [],
    allowedTypeByGroup = {},
    acciones = [],
    siguienteOrdenPorTipo = {},
    readOnly = false,
}) {
    const [loading, setLoading] = useState(false);
    const [openAccionesMovil, setOpenAccionesMovil] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [accionesSeleccionadas, setAccionesSeleccionadas] = useState([]);

    const esEdicion = Boolean(moduloEdit);

    // Genera slug a partir del nombre
    const generarSlug = (texto) =>
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // IDs de tipo permitidos según el grupo seleccionado
    const allowedTypeIds = useMemo(() => {
        if (!form.gme_id) return [];
        return allowedTypeByGroup?.[String(form.gme_id)] ?? [];
    }, [form.gme_id, allowedTypeByGroup]);

    // Tipos filtrados según el grupo
    const tiposFiltrados = useMemo(() => {
        if (!form.gme_id) return [];
        return tipoModulo.filter((tipo) => allowedTypeIds.includes(Number(tipo.tmo_id)));
    }, [form.gme_id, tipoModulo, allowedTypeIds]);

    // Cargar datos al editar
    useEffect(() => {
        if (!moduloEdit) {
            setForm(defaultForm);
            setAccionesSeleccionadas([]);
            return;
        }

        setForm({
            mod_nombre: moduloEdit.mod_nombre ?? "",
            mod_slug: moduloEdit.mod_slug ?? "",
            mod_icono: moduloEdit.mod_icono ?? "",
            mod_orden: moduloEdit.mod_orden ?? 1,
            mod_activo: Boolean(moduloEdit.mod_activo),
            gme_id: moduloEdit.gme_id?.toString() ?? "",
            tmo_id: moduloEdit.tmo_id?.toString() ?? "",
        });
        setAccionesSeleccionadas(
            Array.isArray(moduloEdit.modulo_acciones)
                ? moduloEdit.modulo_acciones.map((a) => a.acc_id)
                : []
        );
    }, [moduloEdit]);

    // Auto-sugerir orden al crear
    useEffect(() => {
        if (esEdicion || !form.tmo_id) return;
        const ordenSugerido = siguienteOrdenPorTipo[form.tmo_id];
        if (!ordenSugerido) return;
        setForm((prev) => ({ ...prev, mod_orden: ordenSugerido }));
    }, [esEdicion, form.tmo_id, siguienteOrdenPorTipo]);

    // Resetear tipo si no pertenece al grupo seleccionado
    useEffect(() => {
        if (!form.gme_id || !form.tmo_id) return;
        const isAllowed = tiposFiltrados.some((tipo) => String(tipo.tmo_id) === String(form.tmo_id));
        if (!isAllowed) {
            setForm((prev) => ({ ...prev, tmo_id: "" }));
        }
    }, [form.gme_id, form.tmo_id, tiposFiltrados]);

    const toggleAccion = (id) => {
        if (readOnly) return;
        setAccionesSeleccionadas((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleClose = () => {
        if (!esEdicion) {
            setForm(defaultForm);
            setAccionesSeleccionadas([]);
        }
        onOpenChange(false);
    };

    const handleSubmit = () => {
        setLoading(true);
        const payload = {
            ...form,
            acciones: accionesSeleccionadas,
        };

        if (esEdicion) {
            router.put(route("admin.modulos.update", moduloEdit.mod_id), payload, {
                onSuccess: () => {
                    toast.success("Módulo actualizado correctamente");
                    setLoading(false);
                    handleClose();
                },
                onError: (errors) => {
                    console.error(errors);
                    setLoading(false);
                    toast.error("Ocurrió un error al actualizar el módulo.");
                },
            });
            return;
        }

        router.post(route("admin.modulos.store"), payload, {
            onSuccess: () => {
                toast.success("Módulo creado correctamente");
                setLoading(false);
                handleClose();
            },
            onError: (errors) => {
                console.error(errors);
                setLoading(false);
                toast.error("Ocurrió un error al crear el módulo.");
            },
        });
    };

    const title = readOnly ? "Ver Módulo" : (esEdicion ? "Editar Módulo" : "Crear Módulo");
    const description = readOnly
        ? "Ver datos del módulo."
        : (esEdicion ? "Modifica los datos del módulo seleccionado." : "Define los datos del nuevo módulo.");

    return (
        <DialogBase
            open={open}
            onOpenChange={handleClose}
            title={title}
            description={description}
            className="sm:max-w-4xl"
            readOnly={readOnly}
        >
            <CargandoDialog show={loading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">

                {/* Columna izquierda: datos del módulo */}
                <div className="lg:col-span-1 border rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-4">Datos del módulo</h3>

                    <div className="space-y-4">

                        {/* Nombre */}
                        <div>
                            <Label>Nombre del módulo</Label>
                            <Input
                                value={form.mod_nombre}
                                readOnly={readOnly}
                                onChange={(e) => {
                                    if (readOnly) return;
                                    const value = e.target.value;
                                    updateField("mod_nombre", value);
                                    updateField("mod_slug", generarSlug(value));
                                }}
                            />
                            {form.mod_nombre && (
                                <p className="text-sm text-gray-400 mt-1">
                                    enlace: {generarSlug(form.mod_nombre)}
                                </p>
                            )}
                        </div>

                        {/* Ícono */}
                        <div className="w-full max-w-md">
                            <Label>Ícono del módulo</Label>
                            <IconPicker
                                value={form.mod_icono}
                                onChange={(icon) => { if (!readOnly) updateField("mod_icono", icon) }}
                                readOnly={readOnly}
                            />
                        </div>

                        {/* Grupo del menú */}
                        <div>
                            <Label>Grupo</Label>
                            <Select
                                className="w-full"
                                value={form.gme_id}
                                onValueChange={(v) => { if (!readOnly) updateField("gme_id", v) }}
                                disabled={readOnly}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione un grupo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {grupoMenu.map((grupo) => (
                                        <SelectItem key={grupo.gme_id} value={String(grupo.gme_id)}>
                                            {grupo.gme_nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tipo de módulo (filtrado por grupo) */}
                        <div>
                            <Label>Tipo de módulo</Label>
                            <Select
                                className="w-full"
                                value={form.tmo_id}
                                onValueChange={(v) => { if (!readOnly) updateField("tmo_id", v) }}
                                disabled={readOnly || !form.gme_id || tiposFiltrados.length === 0}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            form.gme_id
                                                ? "Seleccione un tipo"
                                                : "Seleccione primero un grupo"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {tiposFiltrados.map((tipo) => (
                                        <SelectItem key={tipo.tmo_id} value={String(tipo.tmo_id)}>
                                            <div className="flex items-center gap-2">
                                                {Icons[tipo.tmo_icono]
                                                    ? React.createElement(Icons[tipo.tmo_icono], {
                                                        className: "h-4 w-4 text-gray-600",
                                                    })
                                                    : <Icons.HelpCircle className="h-4 w-4 text-gray-600" />
                                                }
                                                <span>{tipo.tmo_nombre}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Orden */}
                        <div>
                            <Label>Orden</Label>
                            <Input
                                type="number"
                                value={form.mod_orden}
                                readOnly={readOnly}
                                onChange={(e) => { if (!readOnly) updateField("mod_orden", e.target.value) }}
                            />
                        </div>

                    </div>
                </div>

                {/* Columna derecha: acciones */}
                <div className="lg:col-span-2 border rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-4">Acciones del módulo</h3>

                    <p className="text-sm text-gray-600 mb-3">
                        Seleccione las acciones que tendrá este módulo:
                    </p>

                    {!readOnly && (
                        <button
                            className="sm:hidden w-full bg-[#004064] text-white py-2 rounded-lg mb-4"
                            onClick={() => setOpenAccionesMovil(true)}
                        >
                            Seleccionar acciones
                        </button>
                    )}

                    <div className="space-y-3">
                        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {acciones.map((accion) => {
                                const Icono = Icons[accion.acc_icono] || Icons.HelpCircle;
                                const isActive = accionesSeleccionadas.includes(accion.acc_id);

                                return (
                                    <button
                                        key={accion.acc_id}
                                        onClick={() => toggleAccion(accion.acc_id)}
                                        disabled={readOnly}
                                        className={`flex flex-col items-center justify-center gap-2 
                                                        border rounded-lg p-2 transition select-none
                                                        ${isActive
                                                    ? "bg-blue-50 border-[#004064] text-[#004064] shadow-sm"
                                                    : "bg-white hover:bg-gray-50"}
                                                    ${readOnly ? "opacity-80 cursor-default" : ""}
                                                    `}
                                    >
                                        <Icono className="h-6 w-6" />
                                        <span className="text-sm font-medium">
                                            {accion.acc_nombre}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>

            {/* Dialog móvil para acciones */}
            <Dialog open={openAccionesMovil} onOpenChange={setOpenAccionesMovil}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Seleccionar acciones</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-3 py-4">
                        {acciones.map((accion) => {
                            const Icono = Icons[accion.acc_icono] || Icons.HelpCircle;
                            const isActive = accionesSeleccionadas.includes(accion.acc_id);

                            return (
                                <button
                                    key={accion.acc_id}
                                    onClick={() => { if (!readOnly) toggleAccion(accion.acc_id) }}
                                    className={`
                            flex flex-col items-center justify-center gap-1 
                            border rounded-lg p-2 transition select-none
                            ${isActive
                                            ? "bg-blue-50 border-[#004064] text-[#004064]"
                                            : "bg-white hover:bg-gray-50"
                                        }
                        `}
                                >
                                    <Icono className="h-6 w-6" />
                                    <span className="text-xs">{accion.acc_nombre}</span>
                                </button>
                            );
                        })}
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setOpenAccionesMovil(false)}>Listo</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DialogFooter>
                <Button variant="ghost" onClick={handleClose}>
                    {readOnly ? "Cerrar" : "Cancelar"}
                </Button>
                {!readOnly && (
                    <Button variant="default" onClick={handleSubmit}>
                        {esEdicion ? "Guardar cambios" : "Crear módulo"}
                    </Button>
                )}
            </DialogFooter>
        </DialogBase>
    );
}
