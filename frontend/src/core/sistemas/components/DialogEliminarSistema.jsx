import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { useState } from 'react';
import { toast } from '@/shared/lib/toast';
import { deleteSistema } from '../services/sistemas.service';

export default function DialogEliminarSistema({
    sistema,
    setSistema,
    onSuccess,
}) {
    const [eliminando, setEliminando] = useState(false);

    const handleEliminar = async () => {
        if (!sistema) return;
        setEliminando(true);
        try {
            await deleteSistema(sistema.sis_id);
            toast.success('Variable de sistema eliminada exitosamente.');
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al eliminar la variable.');
        } finally {
            setEliminando(false);
        }
    };

    return (
        <Dialog open={!!sistema} onOpenChange={(open) => !open && setSistema(null)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Eliminar Variable</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro que deseas eliminar la variable{' '}
                        <strong className="text-foreground">{sistema?.sis_nombre}</strong>? Esta
                        acción no se puede deshacer y puede afectar el comportamiento del sistema.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setSistema(null)}
                        disabled={eliminando}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleEliminar}
                        disabled={eliminando}
                    >
                        {eliminando ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
