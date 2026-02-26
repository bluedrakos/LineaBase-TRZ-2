import DialogBase from "@/Components/General/DialogBase";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import CargandoDialog from "@/Components/General/CargandoDialog";
import { useState } from "react";

export default function DialogToggleActivo({
    open,
    onOpenChange,
    usuario,
    onSuccess,
}) {

    const [loading, setLoading] = useState(false);

    if (!usuario) return null;

    const handleToggle = () => {
        setLoading(true);

        router.patch(
            route("admin.usuarios.toggleStatus", usuario.usu_id),
            {},
            {
                onSuccess: () => {
                    toast.success(
                        usuario.usu_activo
                            ? "Usuario desactivado correctamente"
                            : "Usuario activado correctamente"
                    );
                    setLoading(false);
                    onOpenChange(false);
                    onSuccess?.();
                },
                onError: () => {
                    toast.error(
                        usuario.usu_activo
                            ? "Error al desactivar usuario"
                            : "Error al activar usuario"
                    );
                    setLoading(false);
                },
            }
        );
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
            description={`Esta acción ${usuario.usu_activo ? "desactivará" : "activará"
                } al usuario del sistema. ¿Estás seguro?`}
            className="sm:max-w-md"
        >
            {/* Overlay de carga */}
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
                    {usuario.usu_activo ? "Desactivar usuario" : "Activar usuario"}
                </Button>
            </div>
        </DialogBase>
    );
}
