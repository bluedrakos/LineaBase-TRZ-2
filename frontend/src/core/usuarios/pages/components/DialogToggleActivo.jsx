import { toggleUsuarioActivo } from '@/core/usuarios/services/usuarios.service';
import CargandoDialog from '@/shared/components/dialogs/CargandoDialog';
import DialogBase from '@/shared/components/dialogs/DialogBase';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DialogToggleActivo({
    open,
    onOpenChange,
    usuario,
    onSuccess,
}) {
    const [loading, setLoading] = useState(false);
    if (!usuario) return null;

    const handleToggle = async () => {
        setLoading(true);
        try {
            await toggleUsuarioActivo(usuario.usu_id);
            toast.success(
                usuario.usu_activo
                    ? 'Usuario desactivado correctamente'
                    : 'Usuario activado correctamente',
            );
            onOpenChange(false);
            await onSuccess?.();
        } catch (error) {
            toast.error(
                error.message ||
                    (usuario.usu_activo
                        ? 'Error al desactivar usuario'
                        : 'Error al activar usuario'),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogBase
            open={open}
            onOpenChange={onOpenChange}
            title={
                usuario.usu_activo
                    ? `¿Desea desactivar a ${usuario.usu_nombre} ${usuario.usu_apellidos}?`
                    : `¿Desea activar a ${usuario.usu_nombre} ${usuario.usu_apellidos}?`
            }
            description={`Esta acción ${usuario.usu_activo ? 'desactivará' : 'activará'} al usuario del sistema. ¿Estás seguro?`}
            className="sm:max-w-md"
        >
            <CargandoDialog show={loading} />

            <div className="flex justify-end gap-2 pt-4">
                <Button
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="bg-red-600 text-white hover:bg-red-700 hover:text-white"
                >
                    Cancelar
                </Button>

                <Button variant="default" onClick={handleToggle}>
                    {usuario.usu_activo
                        ? 'Desactivar usuario'
                        : 'Activar usuario'}
                </Button>
            </div>
        </DialogBase>
    );
}
