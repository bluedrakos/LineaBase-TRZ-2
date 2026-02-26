import LayoutDashboard from "@/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";
import { TablaDatosGenerica } from "@/Components/General/Tabla/TablaDatosGenerica";
import * as Icons from "lucide-react";
import { AuditoriaTablaConfig } from "./components/AuditoriaTablaConfig";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { ScrollArea } from "radix-ui";

export default function Index() {
    const { auditorias } = usePage().props;
    console.log(auditorias);
    const [open, setOpen] = useState(false);
    const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState(null);
    const verAuditoria = (auditorias) => {
        setAuditoriaSeleccionada(auditorias);
        setOpen(true);
    };

    const columnas = AuditoriaTablaConfig({
        onVer: verAuditoria,
    });

    return (
        <LayoutDashboard>
            <Head title="Auditorías del sistema" />

            <div className="max-w-[1240px] mx-auto w-full space-y-4 p-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Auditorías del sistema
                    </h2>
                    <p className="text-muted-foreground">
                        Registro de acciones realizadas por los usuarios.
                    </p>
                </div>

                <TablaDatosGenerica
                    columns={columnas}
                    data={auditorias}
                    filterKey="aud_accion"
                />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalle de auditoría</DialogTitle>
                    </DialogHeader>

                    {auditoriaSeleccionada ? (() => {

                        const datos = auditoriaSeleccionada.aud_datos
                            ? JSON.parse(auditoriaSeleccionada.aud_datos)
                            : null;

                        const esBeforeAfter =
                            datos &&
                            typeof datos === "object" &&
                            datos.before &&
                            datos.after;

                        const formatValue = (val) => {
                            if (val === true) return "Sí";
                            if (val === false) return "No";
                            if (val === null) return "—";
                            return String(val);
                        };
                        if (esBeforeAfter) {
                            const beforeAcciones = datos.before.acciones || {};
                            const afterAcciones = datos.after.acciones || {};
                            const beforeIds = Object.keys(beforeAcciones);
                            const afterIds = Object.keys(afterAcciones);
                            const agregadas = afterIds.filter(id => !beforeIds.includes(id));
                            const eliminadas = beforeIds.filter(id => !afterIds.includes(id));
                            const cambiosModulo = [];

                            if (datos.before.modulo && datos.after.modulo) {
                                Object.keys(datos.before.modulo).forEach((campo) => {
                                    if (datos.before.modulo[campo] !== datos.after.modulo[campo]) {
                                        cambiosModulo.push({
                                            campo,
                                            before: datos.before.modulo[campo],
                                            after: datos.after.modulo[campo],
                                        });
                                    }
                                });
                            }
                            return (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <strong>Acción:</strong> {auditoriaSeleccionada.aud_accion}
                                    </div>

                                    <div>
                                        <strong>Descripción:</strong>{" "}
                                        {auditoriaSeleccionada.aud_descripcion || "—"}
                                    </div>

                                    <div>
                                        <strong>ID afectado:</strong>{" "}
                                        {auditoriaSeleccionada.aud_id_afectado || "—"}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#16a34a] mb-1">
                                            Acciones agregadas
                                        </h4>

                                        {agregadas.length === 0 ? (
                                            <span className="text-gray-400">—</span>
                                        ) : (
                                            <ul className="space-y-1">
                                                {agregadas.map(id => (
                                                    <li key={id} className="text-[#16a34a] flex items-center gap-2">
                                                        <span>+</span>
                                                        <span>{afterAcciones[id]}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#b91c1c] mb-1">
                                            Acciones eliminadas
                                        </h4>

                                        {eliminadas.length === 0 ? (
                                            <span className="text-gray-400">—</span>
                                        ) : (
                                            <ul className="space-y-1">
                                                {eliminadas.map(id => (
                                                    <li key={id} className="text-[#b91c1c] flex items-center gap-2">
                                                        <span>−</span>
                                                        <span>{beforeAcciones[id]}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            Campos modificados
                                        </h4>

                                        {cambiosModulo.length === 0 ? (
                                            <span className="text-gray-400">—</span>
                                        ) : (
                                            <ul className="space-y-2">
                                                {cambiosModulo.map(({ campo, before, after }) => (
                                                    <li key={campo}>
                                                        <div className="font-medium capitalize">
                                                            {campo.replace('mod_', '').replace('_', ' ')}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[#b91c1c] line-through">
                                                                {formatValue(before)}
                                                            </span>
                                                            <span className="text-gray-400">→</span>
                                                            <span className="text-[#16a34a] font-semibold">
                                                                {formatValue(after)}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div className="space-y-3 text-sm">
                                <div>
                                    <strong>Acción:</strong> {auditoriaSeleccionada.aud_accion}
                                </div>

                                <div>
                                    <strong>Descripción:</strong>{" "}
                                    {auditoriaSeleccionada.aud_descripcion || "—"}
                                </div>

                                <div>
                                    <strong>ID afectado:</strong>{" "}
                                    {auditoriaSeleccionada.aud_id_afectado || "—"}
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">
                                        Datos registrados
                                    </h4>

                                    <ul className="space-y-1">
                                        {Object.entries(datos || {}).map(([key, value]) => (
                                            <li key={key} className="flex items-center gap-2">
                                                <span className="font-medium capitalize">
                                                    {key.replace('usu_', '').replace('_', ' ')}:
                                                </span>
                                                <span>{formatValue(value)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );

                    })() : (
                        <span className="text-gray-400">Sin información</span>
                    )}
                </DialogContent>
            </Dialog>
        </LayoutDashboard>
    );
}
