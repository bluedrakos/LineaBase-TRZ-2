import {
    formatearRut,
    limpiarRut,
} from '@/Schemas/usuario.schema.js';
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import DialogBase from "@/Components/General/DialogBase";
import { DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";

export default function DialogCrearInstitucion({
    open,
    onOpenChange,
    institucionEdit = null,
    readOnly = false,
}) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        ins_nombre: "",
        ins_rut: "",
        ins_rut_display: "",
        ins_sigla: "",
        ins_direccion: "",
        ins_telefono: "",
        ins_correo: "",
        ins_descripcion: "",
    });

    const esEdicion = Boolean(institucionEdit);

    useEffect(() => {
        if (institucionEdit) {
            setForm({
                ins_nombre: institucionEdit.ins_nombre ?? "",
                ins_rut: institucionEdit.ins_rut ?? "",
                ins_sigla: institucionEdit.ins_sigla ?? "",
                ins_direccion: institucionEdit.ins_direccion ?? "",
                ins_telefono: institucionEdit.ins_telefono ?? "",
                ins_correo: institucionEdit.ins_correo ?? "",
                ins_descripcion: institucionEdit.ins_descripcion ?? "",
            });
        } else {
            setForm({
                ins_nombre: "",
                ins_rut: "",
                ins_sigla: "",
                ins_direccion: "",
                ins_telefono: "",
                ins_correo: "",
                ins_descripcion: "",
            });
        }
    }, [institucionEdit]);

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const routeName = esEdicion
            ? route("admin.institucion.update", institucionEdit.ins_id)
            : route("admin.institucion.store");

        const method = esEdicion ? "put" : "post";

        router[method](routeName, form, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    esEdicion
                        ? "Institución actualizada correctamente"
                        : "Institución creada correctamente"
                );
                onOpenChange(false);
            },
            onError: () => {
                toast.error("Ocurrió un error al guardar la institución");
            },
            onFinish: () => setLoading(false),
        });
    };

    const title = readOnly ? "Ver institución" : (esEdicion ? "Editar institución" : "Crear institución");
    const description = readOnly ? "Ver datos de la institución." : (esEdicion ? "Modifica los datos de la institución." : "Define los datos de la nueva institución.");

    return (
        <DialogBase open={open} onOpenChange={onOpenChange} title={title} description={description} className="sm:max-w-lg" readOnly={readOnly}>
            <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Nombre</Label>
                            <Input
                                value={form.ins_nombre}
                                readOnly={readOnly}
                                onChange={(e) => { if (!readOnly) updateField("ins_nombre", e.target.value) }}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="ins_rut">RUT</Label>
                            <Input
                                id="ins_rut"
                                value={form.ins_rut_display || ""}
                                readOnly={readOnly}
                                onChange={(e) => {
                                    if (readOnly) return;
                                    let raw = e.target.value.replace(/\D/g, "");

                                    if (raw.length > 9) {
                                        raw = raw.slice(0, 9);
                                    }

                                    updateField("ins_rut", limpiarRut(raw));
                                    updateField("ins_rut_display", formatearRut(raw));
                                }}
                                placeholder="11.111.111-1"
                            />
                        </div>

                        <div>
                            <Label>Sigla</Label>
                            <Input
                                value={form.ins_sigla}
                                readOnly={readOnly}
                                onChange={(e) => { if (!readOnly) updateField("ins_sigla", e.target.value) }}
                                required
                            />
                        </div>

                        <div>
                            <Label>Teléfono</Label>
                            <Input
                                value={form.ins_telefono}
                                readOnly={readOnly}
                                onChange={(e) => { if (!readOnly) updateField("ins_telefono", e.target.value) }}
                            />
                        </div>

                        <div>
                            <Label>Correo</Label>
                            <Input
                                type="email"
                                value={form.ins_correo}
                                readOnly={readOnly}
                                onChange={(e) => { if (!readOnly) updateField("ins_correo", e.target.value) }}
                            />
                        </div>

                        <div>
                            <Label>Dirección</Label>
                            <Input
                                value={form.ins_direccion}
                                readOnly={readOnly}
                                onChange={(e) => { if (!readOnly) updateField("ins_direccion", e.target.value) }}
                            />
                        </div>

                        {/* Campo largo → ocupa 2 columnas */}
                        <div className="md:col-span-2">
                            <Label>Descripción</Label>
                            <Textarea
                                value={form.ins_descripcion}
                                readOnly={readOnly}
                                onChange={(e) => { if (!readOnly) updateField("ins_descripcion", e.target.value) }}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {readOnly ? "Cerrar" : "Cancelar"}
                        </Button>

                        {!readOnly && (
                            <Button type="submit" disabled={loading}>
                                {loading
                                    ? "Guardando..."
                                    : esEdicion
                                        ? "Actualizar"
                                        : "Crear"}
                            </Button>
                        )}
                    </DialogFooter>
                </form>

        </DialogBase>
    );
}
