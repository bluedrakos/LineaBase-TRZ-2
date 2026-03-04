import LayoutDashboard from '@/app/layouts/AdminLayout';
import { Button } from '@/shared/ui/button';
import { Head, router } from '@/shared/app-bridge';

export default function ModuloPendiente({ modulo, pagina }) {
    return (
        <LayoutDashboard>
            <Head title="Módulo Pendiente" />
            <div className="mx-auto w-full max-w-4xl space-y-4 p-6 mt-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                    Módulo en construcción
                </h1>
                <p className="text-slate-500 text-[15px] dark:text-gray-400">
                    El módulo <strong className="font-bold text-slate-600 dark:text-gray-200">{modulo?.nombre}</strong> existe en la
                    base de datos, pero su página frontend aún no está implementada.
                </p>
                <div className="rounded-md border border-slate-200 p-4 text-[15px] space-y-1 dark:border-slate-800 dark:bg-slate-900/50">
                    <p className="dark:text-gray-300">
                        <strong className="font-bold text-slate-900 dark:text-gray-100">Slug:</strong> {modulo?.slug}
                    </p>
                    <p className="dark:text-gray-300">
                        <strong className="font-bold text-slate-900 dark:text-gray-100">Página solicitada:</strong> {pagina}
                    </p>
                    <p className="dark:text-gray-300">
                        <strong className="font-bold text-slate-900 dark:text-gray-100">Ruta:</strong> {modulo?.ruta}
                    </p>
                    <p className="pt-2 text-slate-600 dark:text-gray-400">
                        <span>Archivo esperado:</span>
                        <code className="ml-2 font-mono text-[14px] bg-transparent text-slate-700 dark:text-emerald-400">
                            frontend/src/modules/{modulo?.slug}/pages/{pagina}.jsx
                        </code>
                    </p>
                </div>
                <div className="pt-4">
                    <Button 
                        className="bg-[#004064] hover:bg-[#002f4a] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm h-10 px-4"
                        onClick={() => router.visit('/dashboard')}
                    >
                        Volver al inicio
                    </Button>
                </div>
            </div>
        </LayoutDashboard>
    );
}
