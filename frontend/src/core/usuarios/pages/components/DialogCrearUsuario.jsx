import DialogBase from '@/shared/components/dialogs/DialogBase';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';
import { useState } from 'react';
import FormularioUsuario from './FormularioUsuario';

export default function DialogCrearUsuario({
    open,
    onOpenChange,
    roles = [],
    usuarioEdit,
    instituciones = [],
    onSaved,
}) {
    const handleClose = () => {
        onOpenChange(false);
    };
    const [loading, setLoading] = useState(false);
    return (
        <DialogBase
            open={open}
            onOpenChange={onOpenChange}
            title={usuarioEdit ? 'Editar Usuario' : 'Crear Usuario'}
            description="Completa el formulario"
            className="sm:max-w-5xl"
        >
            <FormularioUsuario
                roles={roles}
                instituciones={instituciones}
                onSuccess={handleClose}
                usuarioEdit={usuarioEdit}
                setLoading={setLoading}
                onSaved={onSaved}
            />

            <div className="mt-6 flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    form="form-crear-usuario"
                    variant="default"
                >
                    Guardar
                </Button>
            </div>
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-[2px]">
                    <Spinner className="h-8 w-8 animate-spin text-[#004064]" />
                </div>
            )}
        </DialogBase>
    );
}
