import { toggleRolActivo } from '@/core/roles/services/roles.service';
import { useAuth } from '@/shared/contexts/AuthContext';
import CargandoDialog from '@/shared/components/dialogs/CargandoDialog';
import DialogBase from '@/shared/components/dialogs/DialogBase';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import { toast } from '@/shared/lib/toast';

export default function DialogToggleActivoRol({
    open,
    onOpenChange,
    rol,
    onSuccess,
}) {
    const { refreshAuth } = useAuth();
    const [loading, setLoading] = useState(false);

    if (!rol) return null;

    const handleToggle = async () => {
        setLoading(true);

        try {
            await toggleRolActivo(rol.rol_id);
            toast.success(
                rol.rol_activo
                    ? 'Rol desactivado correctamente'
                    : 'Rol activado correctamente',
            );
            await refreshAuth();
            onOpenChange(false);
            await onSuccess?.();
        } catch (error) {
            toast.error(
                error.message ||
                    (rol.rol_activo
                        ? 'Error al desactivar el rol'
                        : 'Error al activar el rol'),
            );
        } finally {
            setLoading(false);
        }
    };

    const titulo = rol.rol_activo
        ? `¿Desactivar el rol "${rol.rol_nombre}"?`
        : `¿Activar el rol "${rol.rol_nombre}"?`;

    const descripcion = rol.rol_activo
        ? 'Esta acción desactivará el rol en el sistema. ¿Estás seguro?'
        : 'Esta acción activará el rol en el sistema. ¿Estás seguro?';

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
                    variant="default"
                    onClick={() => onOpenChange(false)}
                    className="bg-[#b91c1c] text-white hover:bg-red-700"
                >
                    Cancelar
                </Button>

                <Button variant="default" onClick={handleToggle}>
                    {rol.rol_activo ? 'Desactivar' : 'Activar'}
                </Button>
            </div>
        </DialogBase>
    );
}
