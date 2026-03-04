import { toggleModuloActivo } from '@/core/modulos/services/modulos.service';
import CargandoDialog from '@/shared/components/dialogs/CargandoDialog';
import DialogBase from '@/shared/components/dialogs/DialogBase';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DialogToggleActivoModulo({
    open,
    onOpenChange,
    modulo,
    onSuccess,
}) {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        if (!modulo) {
            setLoading(false);
            return;
        }

        try {
            await toggleModuloActivo(modulo.mod_id);
            toast.success(
                modulo.mod_activo
                    ? 'Módulo desactivado correctamente'
                    : 'Módulo activado correctamente',
            );
            await onSuccess?.();
            onOpenChange(false);
        } catch (error) {
            toast.error(
                error.message ||
                    (modulo.mod_activo
                        ? 'Error al desactivar módulo'
                        : 'Error al activar módulo'),
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
                modulo?.mod_activo
                    ? `¿Deseas desactivar el módulo "${modulo?.mod_nombre}"?`
                    : `¿Deseas activar el módulo "${modulo?.mod_nombre}"?`
            }
            description={`Esta acción ${modulo?.mod_activo ? 'desactivará' : 'activará'} el módulo en el sistema. ¿Estás seguro?`}
            className="sm:max-w-md"
        >
            <CargandoDialog show={loading} />

            <div className="flex justify-end gap-2 pt-4">
                <Button
                    variant="default"
                    onClick={() => onOpenChange(false)}
                    className="bg-[#b91c1c] text-white hover:bg-[#d62020]"
                >
                    Cancelar
                </Button>

                <Button variant="default" onClick={handleToggle}>
                    {modulo?.mod_activo ? 'Desactivar' : 'Activar'}
                </Button>
            </div>
        </DialogBase>
    );
}
