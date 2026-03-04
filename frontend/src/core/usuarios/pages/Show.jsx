import LayoutDashboard from '@/app/layouts/AdminLayout';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Head, router } from '@/shared/app-bridge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserDetailView from './components/UserDetailView';
import { fetchUsuarioById } from '../services/usuarios.service';

export default function Show({ usuario: initialUsuario }) {
    const [usuario, setUsuario] = useState(initialUsuario);
    const [loading, setLoading] = useState(!initialUsuario);

    useEffect(() => {
        if (!initialUsuario) {
            const pathname = window.location.pathname;
            const id = pathname.split('/').pop();
            if (id && !isNaN(id)) {
                loadUsuario(id);
            }
        }
    }, [initialUsuario]);

    const loadUsuario = async (id) => {
        try {
            setLoading(true);
            const data = await fetchUsuarioById(id);
            setUsuario(data);
        } catch (error) {
            console.error("Error al cargar usuario:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LayoutDashboard>
            <Head title="Detalles del Usuario" />
            <div className="space-y-4 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
                            Detalles del Usuario
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Información detallada del usuario seleccionado.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.visit('/dashboard/gestion-usuarios')
                        }
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Button>
                </div>

                <Card className="border-border bg-background border shadow-sm">
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="w-full space-y-8 pt-2 animate-in fade-in duration-500">
                                {/* Simulación de las Tabs (General / Sesiones) */}
                                <div className="flex gap-2 mb-6 border-b pb-4">
                                    <div className="h-9 w-40 bg-slate-100/80 rounded-md relative overflow-hidden border border-slate-100">
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 to-transparent"></div>
                                    </div>
                                    <div className="h-9 w-48 bg-slate-100/80 rounded-md relative overflow-hidden border border-slate-100">
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 to-transparent"></div>
                                    </div>
                                </div>

                                {/* Simulación de las secciones (Personal, Laboral, Cuenta) */}
                                {[1, 2, 3].map((sectionIndex) => (
                                    <div key={sectionIndex} className="space-y-4">
                                        <div className="h-7 w-48 bg-slate-100 rounded relative overflow-hidden border-b pb-2 mb-4">
                                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 to-transparent"></div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {/* Simulacro de cada "campo" con su icono */}
                                            {[1, 2, 3, 4, 5].slice(0, sectionIndex === 1 ? 4 : sectionIndex === 2 ? 5 : 6).map((itemIndex) => (
                                                <div key={itemIndex} className="flex items-start gap-3">
                                                    <div className="h-5 w-5 rounded bg-slate-100 relative overflow-hidden shrink-0 mt-1">
                                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 to-transparent"></div>
                                                    </div>
                                                    <div className="space-y-2 w-full">
                                                        <div className="h-3 w-28 bg-slate-50 rounded relative overflow-hidden">
                                                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 to-transparent"></div>
                                                        </div>
                                                        <div className="h-4 w-3/4 bg-slate-100 rounded relative overflow-hidden">
                                                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 to-transparent"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : usuario ? (
                            <UserDetailView usuario={usuario} />
                        ) : (
                            <div className="py-20 text-center text-muted-foreground">
                                No se encontró la información del usuario.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </LayoutDashboard>
    );
}
