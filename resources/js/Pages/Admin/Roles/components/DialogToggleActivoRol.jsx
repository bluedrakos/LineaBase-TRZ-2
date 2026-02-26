import DialogBase from "@/Components/General/DialogBase";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import CargandoDialog from "@/Components/General/CargandoDialog";
import { useState } from "react";

export default function DialogToggleActivoRol({
    open,
    onOpenChange,
    rol,
    onSuccess
}) {
    const [loading, setLoading] = useState(false);

    if (!rol) return null;

    const handleToggle = () => {
        setLoading(true);

        router.patch(
            route("admin.rol.toggle", rol.rol_id),
            {},
            {
                onSuccess: () => {
                    toast.success(
                        rol.rol_activo
                            ? "Rol desactivado correctamente"
                            : "Rol activado correctamente"
                    );
                    setLoading(false);
                    onOpenChange(false);
                    onSuccess?.();
                },
                onError: () => {
                    toast.error(
                        rol.rol_activo
                            ? "Error al desactivar el rol"
                            : "Error al activar el rol"
                    );
                    setLoading(false);
                },
            }
        );
    };

    const titulo = rol.rol_activo
        ? `¿Desactivar el rol "${rol.rol_nombre}"?`
        : `¿Activar el rol "${rol.rol_nombre}"?`;

    const descripcion = rol.rol_activo
        ? "Esta acción desactivará el rol en el sistema. ¿Estás seguro?"
        : "Esta acción activará el rol en el sistema. ¿Estás seguro?";

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
                    {rol.rol_activo ? "Desactivar" : "Activar"}
                </Button>
            </div>
        </DialogBase>
    );
}
