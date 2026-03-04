import LayoutDashboard from '@/app/layouts/AdminLayout';
import { Button } from '@/shared/ui/button';
import { Head, router } from '@/shared/app-bridge';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import DialogCrearModulo from './components/DialogCrearModulo';

export default function Show({
    modulo,
    tipoModulo = [],
    grupoMenu = [],
    allowedTypeByGroup = {},
    acciones = [],
    siguienteOrdenPorTipo = {},
}) {
    const [open, setOpen] = React.useState(true);

    return (
        <LayoutDashboard>
            <Head title={`Ver módulo: ${modulo?.mod_nombre || ''}`} />

            <div className="space-y-4 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
                            Ver módulo
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Vista de solo lectura del módulo seleccionado.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => router.visit('/admin/modulos')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Button>
                </div>

                <DialogCrearModulo
                    open={open}
                    onOpenChange={setOpen}
                    moduloEdit={modulo}
                    tipoModulo={tipoModulo}
                    grupoMenu={grupoMenu}
                    allowedTypeByGroup={allowedTypeByGroup}
                    acciones={acciones}
                    siguienteOrdenPorTipo={siguienteOrdenPorTipo}
                    readOnly={true}
                />
            </div>
        </LayoutDashboard>
    );
}
