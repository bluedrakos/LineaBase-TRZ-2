import DialogBase from "@/Components/General/DialogBase";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { useState } from "react";
import CargandoDialog from "@/Components/General/CargandoDialog";

export default function DialogToggleEstado({
    open,
    onOpenChange,
    usuario,
    onSuccess,
}) {
    const [loading, setLoading] = useState(false);

    if (!usuario) return null;

    const estaHabilitado = usuario.usu_estado === "Habilitado";

    const titulo = estaHabilitado
        ? `¿Desea deshabilitar a ${usuario.usu_nombre} ${usuario.usu_apellidos}?`
        : `¿Desea habilitar a ${usuario.usu_nombre} ${usuario.usu_apellidos}?`;

    const descripcion = estaHabilitado
        ? "Esta acción deshabilitará al usuario del sistema. ¿Estás seguro?"
        : "Esta acción habilitará al usuario del sistema. ¿Estás seguro?";

    const textoBoton = estaHabilitado
        ? "Deshabilitar usuario"
        : "Habilitar usuario";

    const handleToggle = () => {
        setLoading(true);

        router.patch(
            route("admin.usuarios.toggleEstado", usuario.usu_id),
            {},
            {
                onSuccess: () => {
                    toast.success(
                        estaHabilitado
                            ? "Usuario deshabilitado correctamente"
                            : "Usuario habilitado correctamente"
                    );
                    setLoading(false);
                    onOpenChange(false);
                    onSuccess?.();
                },
                onError: () => {
                    toast.error(
                        estaHabilitado
                            ? "Error al deshabilitar usuario"
                            : "Error al habilitar usuario"
                    );
                    setLoading(false);
                    onOpenChange(false);
                },
            }
        );
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
