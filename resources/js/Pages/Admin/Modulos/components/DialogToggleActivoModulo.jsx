import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { useState } from "react";
import DialogBase from "@/Components/General/DialogBase";
import CargandoDialog from "@/Components/General/CargandoDialog";

export default function DialogToggleActivoModulo({
    open,
    onOpenChange,
    modulo,
    onSuccess
}) {

    const [loading, setLoading] = useState(false);

    const handleToggle = () => {
        setLoading(true);

        if (!modulo) return;

        router.patch(
            route("admin.modulos.toggleActivo", modulo.mod_id),
            {},
            {
                onSuccess: () => {
                    toast.success(
                        modulo.mod_activo
                            ? "Módulo desactivado correctamente"
                            : "Módulo activado correctamente"
                    );

                    onSuccess?.();
                    setLoading(false);
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error(
                        modulo.mod_activo
                            ? "Error al desactivar módulo"
                            : "Error al activar módulo"
                    );
                    setLoading(false);
                }
            }
        );
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
            description={
                `Esta acción ${modulo?.mod_activo ? "desactivará" : "activará"
                } el módulo en el sistema. ¿Estás seguro?`
            }
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
                    {modulo?.mod_activo ? "Desactivar" : "Activar"}
                </Button>
            </div>
        </DialogBase>
    );
}
