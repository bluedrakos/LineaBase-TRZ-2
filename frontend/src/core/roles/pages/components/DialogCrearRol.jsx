import { createRol, updateRol } from '@/core/roles/services/roles.service';
import { useAuth } from '@/shared/contexts/AuthContext';
import CargandoDialog from '@/shared/components/dialogs/CargandoDialog';
import DialogBase from '@/shared/components/dialogs/DialogBase';
import { Button } from '@/shared/ui/button';
import { DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import { Spinner } from '@/shared/ui/spinner';
import { Textarea } from '@headlessui/react';
import * as Icons from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { toast } from '@/shared/lib/toast';

export default function DialogCrearRol({
    open,
    onOpenChange,
    rolEdit = null,
    modoEdicion = 'todo',
    readOnly = false,
    modulos = [],
    areas = [],
    onSaved,
}) {
    const [loading, setLoading] = useState(false);
    const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
    const [form, setForm] = useState({
        rol_nombre: '',
        rol_descripcion: '',
        rol_activo: true,
        area_id: '',
    });
    const [accionesSeleccionadas, setAccionesSeleccionadas] = useState([]);

    const moduloCompleto = (mod) =>
        mod.modulo_acciones.some((a) =>
            accionesSeleccionadas.includes(a.mac_id),
        );

    const toggleAccion = (id) => {
        if (readOnly) return;
        setAccionesSeleccionadas((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const seleccionarTodoModulo = (mod) => {
        if (readOnly) return;
        const idsModulo = mod.modulo_acciones.map(a => a.mac_id);
        const yaTieneTodos = idsModulo.every(id => accionesSeleccionadas.includes(id));
        
        if (yaTieneTodos) {
            setAccionesSeleccionadas(prev => prev.filter(id => !idsModulo.includes(id)));
        } else {
            setAccionesSeleccionadas(prev => {
                const sinDuplicados = new Set([...prev, ...idsModulo]);
                return Array.from(sinDuplicados);
            });
        }
    };

    const getConteoModulo = (mod) => {
        const total = mod.modulo_acciones.length;
        const seleccionados = mod.modulo_acciones.filter(a => accionesSeleccionadas.includes(a.mac_id)).length;
        return { seleccionados, total };
    };

    useEffect(() => {
        if (rolEdit) {
            setForm({
                rol_nombre: rolEdit.rol_nombre,
                rol_descripcion: rolEdit.rol_descripcion,
                rol_activo: Boolean(rolEdit.rol_activo),
                area_id: rolEdit.area_id ? String(rolEdit.area_id) : '',
            });
            const permisos = rolEdit?.permisos?.map((p) => p.mac_id) ?? [];
            setAccionesSeleccionadas(permisos);
            return;
        }

        setForm({
            rol_nombre: '',
            rol_descripcion: '',
            rol_activo: true,
            area_id: '',
        });
        setAccionesSeleccionadas([]);
    }, [rolEdit, open]);

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };
    const esEdicion = Boolean(rolEdit);

    const { refreshAuth } = useAuth();

    const handleClose = () => {
        if (!rolEdit) {
            setForm({
                rol_nombre: '',
                rol_descripcion: '',
                rol_activo: true,
                area_id: '',
            });
            setAccionesSeleccionadas([]);
        }
        onOpenChange(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            ...form,
            area_id: form.area_id === 'null' ? null : form.area_id || null,
            acciones: accionesSeleccionadas,
        };

        try {
            if (esEdicion) {
                await updateRol(rolEdit.rol_id, payload);
                toast.success('Rol actualizado correctamente');
            } else {
                await createRol(payload);
                toast.success('Rol creado correctamente');
            }
            if (onSaved) await onSaved();
            await refreshAuth();
            handleClose();
        } catch (error) {
            const errores = Object.values(error.errors || {}).flat();
            toast.error(errores[0] || 'Ocurrió un error al guardar el rol.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogBase
            open={open}
            onOpenChange={handleClose}
            title={esEdicion ? 'Editar Rol' : 'Crear Rol'}
            description={
                esEdicion
                    ? 'Modifica los datos del rol seleccionado.'
                    : 'Define los datos del nuevo rol.'
            }
            className={
                modoEdicion === 'datos'
                    ? 'sm:max-w-[550px]'
                    : modoEdicion === 'permisos'
                      ? 'sm:max-w-5xl'
                      : 'sm:max-w-6xl'
            }
        >
            <CargandoDialog show={loading} />

            <div
                className={
                    modoEdicion === 'datos'
                        ? 'py-4'
                        : modoEdicion === 'permisos'
                          ? 'flex justify-center py-6'
                          : 'grid grid-cols-1 gap-6 py-4 lg:grid-cols-3'
                }
            >
                {(modoEdicion === 'todo' || modoEdicion === 'datos') && (
                    <div className={modoEdicion === 'todo' ? 'rounded-lg border p-5 lg:col-span-1' : 'w-full'}>
                        <div className={`grid gap-4 ${modoEdicion === 'datos' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            <div className={modoEdicion === 'datos' ? 'col-span-1' : ''}>
                                <Label>Nombre del rol</Label>
                                <Input
                                    value={form.rol_nombre}
                                    readOnly={readOnly}
                                    onChange={(e) => {
                                        if (readOnly) return;
                                        updateField(
                                            'rol_nombre',
                                            e.target.value,
                                        );
                                    }}
                                />
                            </div>
                            <div className={modoEdicion === 'datos' ? 'col-span-1' : ''}>
                                <Label>
                                    Área asociada (Opcional)
                                </Label>
                                <Select
                                    value={form.area_id}
                                    onValueChange={(value) => {
                                        if (readOnly) return;
                                        updateField('area_id', value);
                                    }}
                                    disabled={readOnly}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccione área" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="null">
                                            Sin área (Ver todo)
                                        </SelectItem>
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
                            </div>
                            <div className="col-span-full">
                                <Label>Descripción del rol</Label>
                                <Textarea
                                    className="w-full rounded-md border p-2 shadow text-sm min-h-[80px]"
                                    value={form.rol_descripcion}
                                    readOnly={readOnly}
                                    onChange={(e) => {
                                        if (readOnly) return;
                                        updateField(
                                            'rol_descripcion',
                                            e.target.value,
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {(modoEdicion === 'todo' || modoEdicion === 'permisos') && (
                    <div
                        className={
                            modoEdicion === 'permisos'
                                ? 'mx-auto w-full max-w-5xl rounded-lg border p-5'
                                : 'rounded-lg border p-5 lg:col-span-2'
                        }
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={
                                    moduloSeleccionado
                                        ? moduloSeleccionado.mod_id
                                        : 'modulos'
                                }
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                                {!moduloSeleccionado && (
                                    <>
                                        <h3 className="mb-4 text-lg font-semibold text-[#004064]">
                                            Seleccione un módulo
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                                            {modulos.map((mod) => {
                                                const Icon =
                                                    Icons[mod.mod_icono] ??
                                                    Icons.Circle;
                                                const { seleccionados, total } = getConteoModulo(mod);
                                                const completo = seleccionados === total && total > 0;
                                                const parcial = seleccionados > 0 && !completo;

                                                return (
                                                    <button
                                                        key={mod.mod_id}
                                                        onClick={() =>
                                                            setModuloSeleccionado(
                                                                mod,
                                                            )
                                                        }
                                                        className={`cursor-pointer rounded-lg border p-4 text-center transition flex flex-col items-center gap-2 ${
                                                            completo 
                                                                ? 'border-green-600 bg-green-50' 
                                                                : parcial
                                                                    ? 'border-[#004064] bg-blue-50'
                                                                    : 'hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <Icon className="h-7 w-7" />
                                                        <span className="font-medium">
                                                            {mod.mod_nombre}
                                                        </span>
                                                        <div className="text-[10px] bg-white/50 px-2 rounded-full border">
                                                            {seleccionados} / {total}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {moduloSeleccionado && (
                                    <>
                                        <div className="mb-4 flex items-center justify-between border-b pb-4">
                                            <h3 className="text-lg font-semibold text-[#004064]">
                                                Permisos: {moduloSeleccionado.mod_nombre}
                                            </h3>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setModuloSeleccionado(null)}
                                                >
                                                    Volver
                                                </Button>
                                                {!readOnly && (
                                                    <Button
                                                        size="sm"
                                                        className="dark:text-white"
                                                        onClick={() => setModuloSeleccionado(null)}
                                                    >
                                                        Guardar módulo
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                                            {moduloSeleccionado.modulo_acciones.map(
                                                (accion) => {
                                                    const estaSeleccionada =
                                                        accionesSeleccionadas.includes(
                                                            accion.mac_id,
                                                        );
                                                    const Icon =
                                                        Icons[
                                                            accion.accion
                                                                .acc_icono
                                                        ] ?? Icons.Circle;

                                                    return (
                                                        <button
                                                            key={accion.mac_id}
                                                            type="button"
                                                            disabled={readOnly}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleAccion(accion.mac_id);
                                                            }}
                                                            className={`flex flex-col items-center gap-2 rounded-lg border p-3 select-none transition ${estaSeleccionada ? 'border-[#004064] bg-blue-50 text-[#004064] shadow' : 'bg-white hover:bg-gray-50'}`}
                                                        >
                                                            <Icon className="h-5 w-5" />
                                                            <span className="text-sm font-medium">{accion.accion.acc_nombre}</span>
                                                        </button>
                                                    );
                                                },
                                            )}
                                        </div>

                                        {!readOnly && (
                                            <div className="mt-8 flex flex-col gap-2 rounded-md bg-muted/50 p-4 pt-3 border">
                                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                                    Selección rápida para {moduloSeleccionado.mod_nombre}
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        type="button"
                                                        className="h-8 text-xs"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            seleccionarTodoModulo(moduloSeleccionado);
                                                        }}
                                                    >
                                                        {getConteoModulo(moduloSeleccionado).seleccionados === moduloSeleccionado.modulo_acciones.length
                                                            ? 'Desmarcar Todos'
                                                            : 'Marcar Todos'}
                                                    </Button>
                                                    
                                                    <div className="w-px h-8 bg-border mx-1"></div>
                                                    
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        type="button"
                                                        className="h-8 text-xs"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const crudSlugs = ['listar', 'crear', 'ver', 'editar', 'eliminar'];
                                                            const crudIds = moduloSeleccionado.modulo_acciones
                                                                .filter(a => crudSlugs.includes(a.accion.acc_slug || a.accion.acc_nombre.toLowerCase()))
                                                                .map(a => a.mac_id);
                                                            
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
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={handleClose}>
                    {readOnly ? 'Cerrar' : 'Cancelar'}
                </Button>
                {!readOnly && (
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="transition-all dark:text-white"
                    >
                        {loading ? (
                            <>
                                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : esEdicion ? (
                            'Guardar cambios'
                        ) : (
                            'Crear rol'
                        )}
                    </Button>
                )}
            </DialogFooter>
        </DialogBase>
    );
}
