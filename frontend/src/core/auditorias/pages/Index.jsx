import LayoutDashboard from '@/app/layouts/AdminLayout';
import { fetchAuditorias } from '@/core/auditorias/services/auditorias.service';
import { TablaDatosGenerica } from '@/shared/components/data-table/TablaDatosGenerica';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Head, usePage } from '@/shared/app-bridge';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AuditoriaTablaConfig } from './components/AuditoriaTablaConfig';

export default function Index() {
    const { auditorias: auditoriasIniciales = [] } = usePage().props;
    const [auditorias, setAuditorias] = useState(auditoriasIniciales);
    const [open, setOpen] = useState(false);
    const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);

    const verAuditoria = (auditorias) => {
        setAuditoriaSeleccionada(auditorias);
        setOpen(true);
    };

    const columnas = AuditoriaTablaConfig({
        onVer: verAuditoria,
    });

    useEffect(() => {
        const cargarAuditorias = async () => {
            setLoading(true);
            try {
                const { items } = await fetchAuditorias({ per_page: 300 });
                setAuditorias(items);
            } catch (error) {
                toast.error(
                    error.message || 'No se pudieron cargar las auditorías',
                );
            } finally {
                setLoading(false);
            }
        };

        cargarAuditorias();
    }, []);

    return (
        <LayoutDashboard>
            <Head title="Auditorías del sistema" />

            <div className="mx-auto w-full max-w-310 space-y-4 p-8">
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
                    isLoading={loading}
                />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalle de auditoría</DialogTitle>
                    </DialogHeader>

                    {auditoriaSeleccionada ? (
                        (() => {
                            const datos = auditoriaSeleccionada.aud_datos
                                ? JSON.parse(auditoriaSeleccionada.aud_datos)
                                : null;

                            const esBeforeAfter =
                                datos &&
                                typeof datos === 'object' &&
                                datos.before &&
                                datos.after;

                            const formatValue = (val) => {
                                if (val === true) return 'Sí';
                                if (val === false) return 'No';
                                if (val === null) return '—';
                                return String(val);
                            };
                            if (esBeforeAfter) {
                                const beforeAcciones =
                                    datos.before.acciones || {};
                                const afterAcciones =
                                    datos.after.acciones || {};
                                const beforeIds = Object.keys(beforeAcciones);
                                const afterIds = Object.keys(afterAcciones);
                                const agregadas = afterIds.filter(
                                    (id) => !beforeIds.includes(id),
                                );
                                const eliminadas = beforeIds.filter(
                                    (id) => !afterIds.includes(id),
                                );
                                const cambiosModulo = [];

                                if (datos.before.modulo && datos.after.modulo) {
                                    Object.keys(datos.before.modulo).forEach(
                                        (campo) => {
                                            if (
                                                datos.before.modulo[campo] !==
                                                datos.after.modulo[campo]
                                            ) {
                                                cambiosModulo.push({
                                                    campo,
                                                    before: datos.before.modulo[
                                                        campo
                                                    ],
                                                    after: datos.after.modulo[
                                                        campo
                                                    ],
                                                });
                                            }
                                        },
                                    );
                                }
                                return (
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <strong>Acción:</strong>{' '}
                                            {auditoriaSeleccionada.aud_accion}
                                        </div>

                                        <div>
                                            <strong>Descripción:</strong>{' '}
                                            {auditoriaSeleccionada.aud_descripcion ||
                                                '—'}
                                        </div>

                                        <div>
                                            <strong>ID afectado:</strong>{' '}
                                            {auditoriaSeleccionada.aud_id_afectado ||
                                                '—'}
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-semibold text-[#16a34a]">
                                                Acciones agregadas
                                            </h4>

                                            {agregadas.length === 0 ? (
                                                <span className="text-gray-400">
                                                    —
                                                </span>
                                            ) : (
                                                <ul className="space-y-1">
                                                    {agregadas.map((id) => (
                                                        <li
                                                            key={id}
                                                            className="flex items-center gap-2 text-[#16a34a]"
                                                        >
                                                            <span>+</span>
                                                            <span>
                                                                {
                                                                    afterAcciones[
                                                                        id
                                                                    ]
                                                                }
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-semibold text-[#b91c1c]">
                                                Acciones eliminadas
                                            </h4>

                                            {eliminadas.length === 0 ? (
                                                <span className="text-gray-400">
                                                    —
                                                </span>
                                            ) : (
                                                <ul className="space-y-1">
                                                    {eliminadas.map((id) => (
                                                        <li
                                                            key={id}
                                                            className="flex items-center gap-2 text-[#b91c1c]"
                                                        >
                                                            <span>−</span>
                                                            <span>
                                                                {
                                                                    beforeAcciones[
                                                                        id
                                                                    ]
                                                                }
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="mb-2 font-semibold">
                                                Campos modificados
                                            </h4>

                                            {cambiosModulo.length === 0 ? (
                                                <span className="text-gray-400">
                                                    —
                                                </span>
                                            ) : (
                                                <ul className="space-y-2">
                                                    {cambiosModulo.map(
                                                        ({
                                                            campo,
                                                            before,
                                                            after,
                                                        }) => (
                                                            <li key={campo}>
                                                                <div className="font-medium capitalize">
                                                                    {campo
                                                                        .replace(
                                                                            'mod_',
                                                                            '',
                                                                        )
                                                                        .replace(
                                                                            '_',
                                                                            ' ',
                                                                        )}
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[#b91c1c] line-through">
                                                                        {formatValue(
                                                                            before,
                                                                        )}
                                                                    </span>
                                                                    <span className="text-gray-400">
                                                                        →
                                                                    </span>
                                                                    <span className="font-semibold text-[#16a34a]">
                                                                        {formatValue(
                                                                            after,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <strong>Acción:</strong>{' '}
                                        {auditoriaSeleccionada.aud_accion}
                                    </div>

                                    <div>
                                        <strong>Descripción:</strong>{' '}
                                        {auditoriaSeleccionada.aud_descripcion ||
                                            '—'}
                                    </div>

                                    <div>
                                        <strong>ID afectado:</strong>{' '}
                                        {auditoriaSeleccionada.aud_id_afectado ||
                                            '—'}
                                    </div>

                                    <div>
                                        <h4 className="mb-2 font-semibold">
                                            Datos registrados
                                        </h4>

                                        <ul className="space-y-1">
                                            {Object.entries(datos || {}).map(
                                                ([key, value]) => (
                                                    <li
                                                        key={key}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="font-medium capitalize">
                                                            {key
                                                                .replace(
                                                                    'usu_',
                                                                    '',
                                                                )
                                                                .replace(
                                                                    '_',
                                                                    ' ',
                                                                )}
                                                            :
                                                        </span>
                                                        <span>
                                                            {formatValue(value)}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <span className="text-gray-400">Sin información</span>
                    )}
                </DialogContent>
            </Dialog>
        </LayoutDashboard>
    );
}
