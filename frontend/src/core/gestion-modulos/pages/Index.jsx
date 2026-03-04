import LayoutDashboard from '@/app/layouts/AdminLayout';
import { Head } from '@/shared/app-bridge';

export default function Index() {
    return (
        <LayoutDashboard>
            <Head title="Gestión de Módulos" />
            <div className="mx-auto w-full max-w-[1240px] space-y-4 pt-4 md:px-8 md:pt-8 md:pb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Gestión de Módulos</h2>
                    <p className="text-muted-foreground">
                        Nuevo módulo generado automáticamente.
                    </p>
                </div>
            </div>
        </LayoutDashboard>
    );
}