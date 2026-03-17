import { toggleUsuarioEstado } from '@/core/usuarios/services/usuarios.service';
import CargandoDialog from '@/shared/components/dialogs/CargandoDialog';
import DialogBase from '@/shared/components/dialogs/DialogBase';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import { toast } from '@/shared/lib/toast';
import { HttpStatus, ResponseManager } from '@/shared/lib/ResponseManager';

export default function DialogToggleEstado({
    open,
    onOpenChange,
    usuario,
    onSuccess,
}) {
    const [loading, setLoading] = useState(false);
    if (!usuario) return null;

    const estaHabilitado = usuario.usu_estado === 'Habilitado';
    const titulo = estaHabilitado
        ? `¿Desea deshabilitar a ${usuario.usu_nombre} ${usuario.usu_apellidos}?`
        : `¿Desea habilitar a ${usuario.usu_nombre} ${usuario.usu_apellidos}?`;
    const descripcion = estaHabilitado
        ? 'Esta acción deshabilitará al usuario del sistema. ¿Estás seguro?'
        : 'Esta acción habilitará al usuario del sistema. ¿Estás seguro?';
    const textoBoton = estaHabilitado
        ? 'Deshabilitar usuario'
        : 'Habilitar usuario';

    const handleToggle = async () => {
        setLoading(true);
        try {
            await toggleUsuarioEstado(usuario.usu_id);
            toast.success(ResponseManager.getMessage(HttpStatus.OK));
            onOpenChange(false);
            await onSuccess?.();
        } catch (error) {
            toast.error(
                error.message || ResponseManager.getMessage(error),
            );
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogBase
            open={open}
            onOpenChange={onOpenChange}
            title={titulo}
            description={descripcion}
            className="sm:max-w-md"
        >
            <CargandoDialog show={loading} />

            <div className="flex justify-end gap-2 pt-4">
                <Button
                    className="bg-red-600 text-white hover:bg-red-700 hover:text-white"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                >
                    Cancelar
                </Button>

                <Button variant="default" onClick={handleToggle}>
                    {textoBoton}
                </Button>
            </div>
        </DialogBase>
    );
}
