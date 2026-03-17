import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Textarea } from '@/shared/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from '@/shared/lib/toast';
import { z } from 'zod';
import { createSistema, updateSistema } from '../services/sistemas.service';

const formSchema = z.object({
    sis_tipo: z.enum(['Publico', 'Privado']),
    sis_nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    sis_descripcion: z.string().optional(),
    sis_valor: z.string().min(1, 'El valor es requerido'),
});

export default function DialogCrearSistema({
    open,
    setOpen,
    sistemaEdit,
    onSaved,
}) {
    const [guardando, setGuardando] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sis_tipo: 'Privado',
            sis_nombre: '',
            sis_descripcion: '',
            sis_valor: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (sistemaEdit) {
                reset({
                    sis_tipo: sistemaEdit.sis_tipo || 'Privado',
                    sis_nombre: sistemaEdit.sis_nombre || '',
                    sis_descripcion: sistemaEdit.sis_descripcion || '',
                    sis_valor: sistemaEdit.sis_valor || '',
                });
            } else {
                reset({
                    sis_tipo: 'Privado',
                    sis_nombre: '',
                    sis_descripcion: '',
                    sis_valor: '',
                });
            }
        }
    }, [open, sistemaEdit, reset]);

    const handleSave = async (data) => {
        setGuardando(true);
        try {
            if (sistemaEdit) {
                await updateSistema(sistemaEdit.sis_id, data);
                toast.success('Variable actualizada correctamente.');
            } else {
                await createSistema(data);
                toast.success('Variable creada correctamente.');
            }
            setOpen(false);
            if (onSaved) onSaved();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al guardar la variable de sistema.');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(handleSave)}>
                    <DialogHeader>
                        <DialogTitle>
                            {sistemaEdit ? 'Editar Variable' : 'Nueva Variable'}
                        </DialogTitle>
                        <DialogDescription>
                            Las variables del sistema se utilizarán para almacenar parámetros y credenciales.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sis_tipo" className="text-right">
                                Tipo
                            </Label>
                            <div className="col-span-3">
                                <Controller
                                    name="sis_tipo"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Publico">Público</SelectItem>
                                                <SelectItem value="Privado">Privado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sis_nombre" className="text-right">
                                Nombre
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="sis_nombre"
                                    placeholder="ej. KEY_SERVICIO"
                                    {...register('sis_nombre')}
                                />
                                {errors.sis_nombre && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.sis_nombre.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sis_valor" className="text-right">
                                Valor
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="sis_valor"
                                    placeholder="Valor de la variable"
                                    {...register('sis_valor')}
                                />
                                {errors.sis_valor && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.sis_valor.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sis_descripcion" className="text-right">
                                Descripción
                            </Label>
                            <div className="col-span-3">
                                <Textarea
                                    id="sis_descripcion"
                                    placeholder="Breve detalle"
                                    {...register('sis_descripcion')}
                                />
                                {errors.sis_descripcion && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.sis_descripcion.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={guardando}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={guardando}>
                            {guardando ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
