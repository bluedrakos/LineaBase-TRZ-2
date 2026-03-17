import {
    createModulo,
    updateModulo,
} from '@/core/modulos/services/modulos.service';
import { useAuth } from '@/shared/contexts/AuthContext';
import CargandoDialog from '@/shared/components/dialogs/CargandoDialog';
import DialogBase from '@/shared/components/dialogs/DialogBase';
import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import * as Icons from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from '@/shared/lib/toast';
import IconPicker from './IconPicker';
import DialogTipoModuloSimple from './DialogTipoModuloSimple';

// Estado inicial del formulario
const defaultForm = {
    mod_nombre: '',
    mod_slug: '',
    mod_icono: '',
    mod_orden: 1,
    mod_activo: true,
    gme_id: '',
    tmo_id: '',
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
    onSaved,
}) {
    const [loading, setLoading] = useState(false);
    const [openAccionesMovil, setOpenAccionesMovil] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [accionesSeleccionadas, setAccionesSeleccionadas] = useState([]);
    const [openTipoModuloDialog, setOpenTipoModuloDialog] = useState(false);
    const [tipoModuloEdit, setTipoModuloEdit] = useState(null);

    const { refreshAuth } = useAuth();

    const esEdicion = Boolean(moduloEdit);

    // Genera slug a partir del nombre
    const generarSlug = (texto) =>
        texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

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
        return tipoModulo.filter((tipo) =>
            allowedTypeIds.includes(Number(tipo.tmo_id)),
        );
    }, [form.gme_id, tipoModulo, allowedTypeIds]);

    // Cargar datos al editar
    useEffect(() => {
        if (!moduloEdit) {
            setForm(defaultForm);
            setAccionesSeleccionadas([]);
            return;
        }

        setForm({
            mod_nombre: moduloEdit.mod_nombre ?? '',
            mod_slug: moduloEdit.mod_slug ?? '',
            mod_icono: moduloEdit.mod_icono ?? '',
            mod_orden: moduloEdit.mod_orden ?? 1,
            mod_activo: Boolean(moduloEdit.mod_activo),
            gme_id: moduloEdit.gme_id?.toString() ?? '',
            tmo_id: moduloEdit.tmo_id?.toString() ?? 'none',
        });
        setAccionesSeleccionadas(
            Array.isArray(moduloEdit.modulo_acciones)
                ? moduloEdit.modulo_acciones.map((a) => a.acc_id)
                : [],
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
        if (!form.gme_id || !form.tmo_id || form.tmo_id === 'none') return;
        const isAllowed = tiposFiltrados.some(
            (tipo) => String(tipo.tmo_id) === String(form.tmo_id),
        );
        if (!isAllowed) {
            setForm((prev) => ({ ...prev, tmo_id: 'none' }));
        }
    }, [form.gme_id, form.tmo_id, tiposFiltrados]);

    const toggleAccion = (id) => {
        if (readOnly) return;
        setAccionesSeleccionadas((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const handleClose = () => {
        if (!esEdicion) {
            setForm(defaultForm);
            setAccionesSeleccionadas([]);
        }
        onOpenChange(false);
    };

    const handleCreateTipoModulo = () => {
        setTipoModuloEdit(null);
        setOpenTipoModuloDialog(true);
    };

    const handleEditTipoModulo = () => {
        if (!form.tmo_id) {
            toast.error('Seleccione primero un tipo de módulo para editar.');
            return;
        }

        const seleccionado = tipoModulo.find(
            (tipo) => String(tipo.tmo_id) === String(form.tmo_id)
        );
        if (!seleccionado) {
            toast.error('No se encontró el tipo de módulo seleccionado.');
            return;
        }

        setTipoModuloEdit(seleccionado);
        setOpenTipoModuloDialog(true);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            ...form,
            mod_orden: Number(form.mod_orden),
            gme_id: Number(form.gme_id),
            tmo_id: form.tmo_id && form.tmo_id !== 'none' ? Number(form.tmo_id) : null,
            acciones: accionesSeleccionadas,
        };

        try {
            if (esEdicion) {
                await updateModulo(moduloEdit.mod_id, payload);
                toast.success('Módulo actualizado correctamente');
            } else {
                await createModulo(payload);
                toast.success('Módulo creado correctamente');
            }
            if (onSaved) await onSaved();
            await refreshAuth();
            handleClose();
        } catch (error) {
            const errores = Object.values(error.errors || {}).flat();
            toast.error(errores[0] || 'Ocurrió un error al guardar el módulo.');
        } finally {
            setLoading(false);
        }
    };

    const title = readOnly
        ? 'Ver Módulo'
        : esEdicion
          ? 'Editar Módulo'
          : 'Crear Módulo';
    const description = readOnly
        ? 'Ver datos del módulo.'
        : esEdicion
          ? 'Modifica los datos del módulo seleccionado.'
          : 'Define los datos del nuevo módulo.';

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

            <div className="grid grid-cols-1 gap-6 py-4 lg:grid-cols-3">
                {/* Columna izquierda: datos del módulo */}
                <div className="rounded-lg border p-5 lg:col-span-1">

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
                                    updateField('mod_nombre', value);
                                    // Solo autogeneramos el slug si es un modulo nuevo
                                    if (!esEdicion) {
                                        updateField('mod_slug', generarSlug(value));
                                    }
                                }}
                            />
                            {form.mod_nombre && (
                                <p className="mt-1 text-sm text-gray-400">
                                    enlace: {generarSlug(form.mod_nombre)}
                                </p>
                            )}
                        </div>

                        {/* Ícono */}
                        <div className="w-full max-w-md">
                            <Label>Ícono del módulo</Label>
                            <IconPicker
                                value={form.mod_icono}
                                onChange={(icon) => {
                                    if (!readOnly)
                                        updateField('mod_icono', icon);
                                }}
                                readOnly={readOnly}
                            />
                        </div>

                        {/* Grupo del menú */}
                        <div>
                            <Label>Grupo</Label>
                            <Select
                                className="w-full"
                                value={form.gme_id}
                                onValueChange={(v) => {
                                    if (!readOnly) updateField('gme_id', v);
                                }}
                                disabled={readOnly}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione un grupo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {grupoMenu.map((grupo) => (
                                        <SelectItem
                                            key={grupo.gme_id}
                                            value={String(grupo.gme_id)}
                                        >
                                            {grupo.gme_nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tipo de módulo (filtrado por grupo) */}
                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <Label>Tipo de módulo</Label>
                                {!readOnly && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                            title="Editar tipo de módulo"
                                            onClick={handleEditTipoModulo}
                                            disabled={!form.tmo_id || form.tmo_id === 'none'}
                                        >
                                            <Icons.SquarePen className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                            title="Crear tipo de módulo"
                                            onClick={handleCreateTipoModulo}
                                        >
                                            <Icons.Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <Select
                                className="w-full"
                                value={form.tmo_id}
                                onValueChange={(v) => {
                                    if (!readOnly) updateField('tmo_id', v);
                                }}
                                disabled={
                                    readOnly ||
                                    !form.gme_id ||
                                    tiposFiltrados.length === 0
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            form.gme_id
                                                ? 'Seleccione un tipo o déjelo suelto'
                                                : 'Seleccione primero un grupo'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Icons.FolderMinus className="h-4 w-4" />
                                            <span>Sin tipo de módulo</span>
                                        </div>
                                    </SelectItem>
                                    {tiposFiltrados.map((tipo) => (
                                        <SelectItem
                                            key={tipo.tmo_id}
                                            value={String(tipo.tmo_id)}
                                        >
                                            <div className="flex items-center gap-2">
                                                {Icons[tipo.tmo_icono] ? (
                                                    React.createElement(
                                                        Icons[tipo.tmo_icono],
                                                        {
                                                            className:
                                                                'h-4 w-4 text-gray-600',
                                                        },
                                                    )
                                                ) : (
                                                    <Icons.HelpCircle className="h-4 w-4 text-gray-600" />
                                                )}
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
                                onChange={(e) => {
                                    if (!readOnly)
                                        updateField(
                                            'mod_orden',
                                            e.target.value,
                                        );
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Columna derecha: acciones */}
                <div className="rounded-lg border p-5 lg:col-span-2">

                    <p className="mb-3 text-sm text-gray-600">
                        Seleccione las acciones que tendrá este módulo:
                    </p>

                    {!readOnly && (
                        <button
                            className="mb-4 w-full rounded-lg bg-[#004064] py-2 text-white sm:hidden"
                            onClick={() => setOpenAccionesMovil(true)}
                        >
                            Seleccionar acciones
                        </button>
                    )}

                    <div className="space-y-3">
                        <div className="hidden grid-cols-2 gap-3 sm:grid sm:grid-cols-5">
                            {acciones.map((accion) => {
                                const Icono =
                                    Icons[accion.acc_icono] || Icons.HelpCircle;
                                const isActive = accionesSeleccionadas.includes(
                                    accion.acc_id,
                                );

                                return (
                                    <button
                                        key={accion.acc_id}
                                        onClick={() =>
                                            toggleAccion(accion.acc_id)
                                        }
                                        disabled={readOnly}
                                        className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-2 transition select-none ${
                                            isActive
                                                ? 'border-[#004064] bg-blue-50 text-[#004064] shadow-sm'
                                                : 'bg-white hover:bg-gray-50'
                                        } ${readOnly ? 'cursor-default opacity-80' : ''} `}
                                    >
                                        <Icono className="h-6 w-6" />
                                        <span className="text-sm font-medium">
                                            {accion.acc_nombre}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        
                        {!readOnly && (
                            <div className="mt-4 flex flex-col gap-2 rounded-md bg-muted/50 p-3 pt-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Selección rápida
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        type="button"
                                        className="h-7 text-xs"
                                        onClick={() => {
                                            setAccionesSeleccionadas(acciones.map(a => a.acc_id));
                                        }}
                                    >
                                        Marcar Todos
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        type="button"
                                        className="h-7 text-xs"
                                        onClick={() => {
                                            setAccionesSeleccionadas([]);
                                        }}
                                    >
                                        Desmarcar Todos
                                    </Button>
                                    <div className="w-px h-7 bg-border mx-1"></div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        type="button"
                                        className="h-7 text-xs"
                                        onClick={() => {
                                            const crudSlugs = ['listar', 'crear', 'ver', 'editar', 'eliminar'];
                                            const crudIds = acciones
                                                .filter(a => crudSlugs.includes(a.acc_slug || a.acc_nombre.toLowerCase()))
                                                .map(a => a.acc_id);
                                            
                                            setAccionesSeleccionadas((prev) => {
                                                const nuevas = new Set([...prev, ...crudIds]);
                                                return Array.from(nuevas);
                                            });
                                        }}
                                    >
                                        Seleccionar C.R.U.D.
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dialog móvil para acciones */}
            <Dialog
                open={openAccionesMovil}
                onOpenChange={setOpenAccionesMovil}
            >
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Seleccionar acciones</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-3 py-4">
                        {acciones.map((accion) => {
                            const Icono =
                                Icons[accion.acc_icono] || Icons.HelpCircle;
                            const isActive = accionesSeleccionadas.includes(
                                accion.acc_id,
                            );

                            return (
                                <button
                                    key={accion.acc_id}
                                    onClick={() => {
                                        if (!readOnly)
                                            toggleAccion(accion.acc_id);
                                    }}
                                    className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2 transition select-none ${
                                        isActive
                                            ? 'border-[#004064] bg-blue-50 text-[#004064]'
                                            : 'bg-white hover:bg-gray-50'
                                    } `}
                                >
                                    <Icono className="h-6 w-6" />
                                    <span className="text-xs">
                                        {accion.acc_nombre}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setOpenAccionesMovil(false)}>
                            Listo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DialogTipoModuloSimple
                open={openTipoModuloDialog}
                onOpenChange={setOpenTipoModuloDialog}
                tipoEdit={tipoModuloEdit}
                onSuccessCb={onSaved}
            />

            <DialogFooter>
                <Button variant="ghost" onClick={handleClose}>
                    {readOnly ? 'Cerrar' : 'Cancelar'}
                </Button>
                {!readOnly && (
                    <Button variant="default" onClick={handleSubmit}>
                        {esEdicion ? 'Guardar cambios' : 'Crear módulo'}
                    </Button>
                )}
            </DialogFooter>
        </DialogBase>
    );
}
