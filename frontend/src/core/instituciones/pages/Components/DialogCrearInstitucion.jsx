import {
    createInstitucion,
    updateInstitucion,
} from '@/core/instituciones/services/instituciones.service';
import DialogBase from '@/shared/components/dialogs/DialogBase';
import { formatearRut, limpiarRut } from '@/shared/schemas/usuario.schema.js';
import { Button } from '@/shared/ui/button';
import { DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function DialogCrearInstitucion({
    open,
    onOpenChange,
    institucionEdit = null,
    readOnly = false,
    onSaved,
}) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        ins_nombre: '',
        ins_rut: '',
        ins_rut_display: '',
        ins_sigla: '',
        ins_direccion: '',
        ins_telefono: '',
        ins_correo: '',
        ins_descripcion: '',
    });

    const esEdicion = Boolean(institucionEdit);

    useEffect(() => {
        if (institucionEdit) {
            setForm({
                ins_nombre: institucionEdit.ins_nombre ?? '',
                ins_rut: institucionEdit.ins_rut ?? '',
                ins_rut_display: formatearRut(institucionEdit.ins_rut ?? ''),
                ins_sigla: institucionEdit.ins_sigla ?? '',
                ins_direccion: institucionEdit.ins_direccion ?? '',
                ins_telefono: institucionEdit.ins_telefono ?? '',
                ins_correo: institucionEdit.ins_correo ?? '',
                ins_descripcion: institucionEdit.ins_descripcion ?? '',
            });
            return;
        }

        setForm({
            ins_nombre: '',
            ins_rut: '',
            ins_rut_display: '',
            ins_sigla: '',
            ins_direccion: '',
            ins_telefono: '',
            ins_correo: '',
            ins_descripcion: '',
        });
    }, [institucionEdit]);

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const payload = {
            ins_nombre: form.ins_nombre,
            ins_rut: form.ins_rut,
            ins_sigla: form.ins_sigla,
            ins_direccion: form.ins_direccion || null,
            ins_telefono: form.ins_telefono || null,
            ins_correo: form.ins_correo || null,
            ins_descripcion: form.ins_descripcion || null,
        };

        try {
            if (esEdicion) {
                await updateInstitucion(institucionEdit.ins_id, payload);
                toast.success('Institución actualizada correctamente');
            } else {
                await createInstitucion(payload);
                toast.success('Institución creada correctamente');
            }

            await onSaved?.();
            onOpenChange(false);
        } catch (error) {
            const errores = Object.values(error.errors || {}).flat();
            toast.error(
                errores[0] || 'Ocurrió un error al guardar la institución',
            );
        } finally {
            setLoading(false);
        }
    };

    const title = readOnly
        ? 'Ver institución'
        : esEdicion
          ? 'Editar institución'
          : 'Crear institución';
    const description = readOnly
        ? 'Ver datos de la institución.'
        : esEdicion
          ? 'Modifica los datos de la institución.'
          : 'Define los datos de la nueva institución.';

    return (
        <DialogBase
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            className="sm:max-w-lg"
            readOnly={readOnly}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label>Nombre</Label>
                        <Input
                            value={form.ins_nombre}
                            readOnly={readOnly}
                            onChange={(e) => {
                                if (!readOnly)
                                    updateField('ins_nombre', e.target.value);
                            }}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="ins_rut">RUT</Label>
                        <Input
                            id="ins_rut"
                            value={form.ins_rut_display || ''}
                            readOnly={readOnly}
                            onChange={(e) => {
                                if (readOnly) return;
                                let raw = e.target.value.replace(/\D/g, '');
                                if (raw.length > 9) raw = raw.slice(0, 9);
                                updateField('ins_rut', limpiarRut(raw));
                                updateField(
                                    'ins_rut_display',
                                    formatearRut(raw),
                                );
                            }}
                            placeholder="11.111.111-1"
                        />
                    </div>

                    <div>
                        <Label>Sigla</Label>
                        <Input
                            value={form.ins_sigla}
                            readOnly={readOnly}
                            onChange={(e) => {
                                if (!readOnly)
                                    updateField('ins_sigla', e.target.value);
                            }}
                            required
                        />
                    </div>

                    <div>
                        <Label>Teléfono</Label>
                        <Input
                            value={form.ins_telefono}
                            readOnly={readOnly}
                            onChange={(e) => {
                                if (!readOnly)
                                    updateField('ins_telefono', e.target.value);
                            }}
                        />
                    </div>

                    <div>
                        <Label>Correo</Label>
                        <Input
                            type="email"
                            value={form.ins_correo}
                            readOnly={readOnly}
                            onChange={(e) => {
                                if (!readOnly)
                                    updateField('ins_correo', e.target.value);
                            }}
                        />
                    </div>

                    <div>
                        <Label>Dirección</Label>
                        <Input
                            value={form.ins_direccion}
                            readOnly={readOnly}
                            onChange={(e) => {
                                if (!readOnly)
                                    updateField(
                                        'ins_direccion',
                                        e.target.value,
                                    );
                            }}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label>Descripción</Label>
                        <Textarea
                            value={form.ins_descripcion}
                            readOnly={readOnly}
                            onChange={(e) => {
                                if (!readOnly)
                                    updateField(
                                        'ins_descripcion',
                                        e.target.value,
                                    );
                            }}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {readOnly ? 'Cerrar' : 'Cancelar'}
                    </Button>

                    {!readOnly && (
                        <Button type="submit" disabled={loading}>
                            {loading
                                ? 'Guardando...'
                                : esEdicion
                                  ? 'Actualizar'
                                  : 'Crear'}
                        </Button>
                    )}
                </DialogFooter>
            </form>
        </DialogBase>
    );
}
