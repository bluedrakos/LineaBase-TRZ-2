import { useEffect, useMemo, useState } from 'react';
import { toast } from '@/shared/lib/toast';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import IconPicker from './IconPicker';
import {
    createTipoModulo,
    updateTipoModulo,
} from '../../services/tipo-modulo.service';

const defaultForm = {
    tmo_nombre: '',
    tmo_icono: 'Settings',
};

const generarSlug = (texto) =>
    texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export default function DialogTipoModuloSimple({
    open,
    onOpenChange,
    tipoEdit = null,
    onSuccessCb,
}) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(defaultForm);

    const esEdicion = Boolean(tipoEdit);

    useEffect(() => {
        if (!open) return;
        if (tipoEdit) {
            setForm({
                tmo_nombre: tipoEdit.tmo_nombre ?? '',
                tmo_icono: tipoEdit.tmo_icono ?? 'Settings',
            });
            return;
        }
        setForm(defaultForm);
    }, [open, tipoEdit]);

    const slugPreview = useMemo(
        () => generarSlug(form.tmo_nombre),
        [form.tmo_nombre],
    );

    const getErrorMessage = (errors, fallback) => {
        if (!errors || typeof errors !== 'object') return fallback;
        if (typeof errors.error === 'string' && errors.error.trim())
            return errors.error;

        const messages = Object.values(errors)
            .flatMap((value) => (Array.isArray(value) ? value : [value]))
            .filter(
                (value) => typeof value === 'string' && value.trim().length > 0,
            );

        if (messages.length === 0) return fallback;
        if (messages.length === 1) return messages[0];
        return messages.slice(0, 3).join(' | ');
    };

    const handleSubmit = async () => {
        if (!form.tmo_nombre.trim()) {
            toast.error('Debe ingresar el nombre del tipo de módulo.');
            return;
        }

        setLoading(true);

        const payload = {
            tmo_nombre: form.tmo_nombre.trim(),
            tmo_icono: form.tmo_icono || null,
        };

        try {
            if (esEdicion) {
                await updateTipoModulo(tipoEdit.tmo_id, payload);
                toast.success('Tipo de módulo actualizado correctamente');
            } else {
                await createTipoModulo(payload);
                toast.success('Tipo de módulo creado correctamente');
            }
            if (onSuccessCb) onSuccessCb();
            onOpenChange(false);
        } catch (error) {
            const errBody = error?.response?.data?.errors || error?.response?.data || error;
            toast.error(
                getErrorMessage(
                    errBody,
                    'No se pudo guardar el tipo de módulo.',
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {esEdicion
                            ? 'Editar tipo de módulo'
                            : 'Crear tipo de módulo'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Nombre</Label>
                        <Input
                            value={form.tmo_nombre}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    tmo_nombre: e.target.value,
                                }))
                            }
                            placeholder="Ej: Operacion avanzada"
                        />
                        {slugPreview && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                slug: {slugPreview}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Icono</Label>
                        <IconPicker
                            value={form.tmo_icono}
                            onChange={(icon) =>
                                setForm((prev) => ({
                                    ...prev,
                                    tmo_icono: icon,
                                }))
                            }
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#004064] text-white hover:bg-[#002f4a]"
                    >
                        {loading
                            ? 'Guardando...'
                            : esEdicion
                              ? 'Guardar cambios'
                              : 'Crear tipo'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
