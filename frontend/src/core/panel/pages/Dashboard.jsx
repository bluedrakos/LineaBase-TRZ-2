import LayoutDashboard from '@/app/layouts/AdminLayout';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Head } from '@/shared/app-bridge';
import {
    BarChart3,
    Bell,
    Building2,
    Calendar as CalendarIcon,
    Download,
    FileText,
    Layers,
    PieChart,
    ShieldAlert,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ActivityChart } from './components/ActivityChart';
import { MetricCard } from './components/MetricCard';
import { RecentActivity } from './components/RecentActivity';
import { StatusChart } from './components/StatusChart';

function DashboardSkeleton() {
    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2 mb-6">
                <div className="h-8 w-40 bg-slate-100/80 dark:bg-slate-800 animate-pulse rounded-lg border border-slate-100 dark:border-slate-800"></div>
                <div className="flex space-x-2">
                    <div className="h-9 w-48 bg-slate-100/80 dark:bg-slate-800 animate-pulse rounded-lg hidden sm:block border border-slate-100 dark:border-slate-800"></div>
                    <div className="h-9 w-28 bg-slate-100/80 dark:bg-slate-800 animate-pulse rounded-lg border border-slate-100 dark:border-slate-800"></div>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="flex space-x-2 border-b dark:border-slate-800 pb-2">
                    <div className="h-8 w-24 bg-slate-100/80 dark:bg-slate-800 animate-pulse rounded-md"></div>
                    <div className="h-8 w-24 bg-slate-50 dark:bg-slate-800 animate-pulse rounded-md"></div>
                    <div className="h-8 w-24 bg-slate-50 dark:bg-slate-800 animate-pulse rounded-md"></div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-[135px] rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 dark:via-slate-800/50 to-transparent"></div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                <div className="h-4 w-4 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div>
                            </div>
                            <div className="h-8 w-16 bg-slate-100 dark:bg-slate-800 rounded mb-2 animate-pulse"></div>
                            <div className="h-3 w-32 bg-slate-50 dark:bg-slate-800/80 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="h-[380px] rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm col-span-4 p-6 relative overflow-hidden">
                         <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 dark:via-slate-800/50 to-transparent"></div>
                         <div className="h-5 w-40 bg-slate-100 dark:bg-slate-800 rounded mb-6 animate-pulse"></div>
                         <div className="space-y-3">
                             {[1,2,3,4,5,6].map(j => <div key={j} className="h-8 w-full bg-slate-50 dark:bg-slate-800/80 rounded animate-pulse"></div>)}
                         </div>
                    </div>
                    <div className="h-[380px] rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm col-span-3 p-6 relative overflow-hidden">
                         <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 dark:via-slate-800/50 to-transparent"></div>
                         <div className="h-5 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-6 animate-pulse"></div>
                         <div className="space-y-4">
                             {[1,2,3,4].map(j => (
                                 <div key={j} className="flex gap-4 items-center">
                                     <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div>
                                     <div className="space-y-2 flex-1">
                                         <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                         <div className="h-2 w-1/2 bg-slate-50 dark:bg-slate-800/80 rounded animate-pulse"></div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard(props) {
    const [data, setData] = useState({
        stats: {},
        actividadChart: [],
        usuariosEstadoChart: [],
        recientes: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/v1/dashboard/resumen')
            .then(res => {
                const resData = res.data.data;
                setData({
                    stats: resData.stats || {},
                    actividadChart: resData.actividad_chart || [],
                    usuariosEstadoChart: resData.usuarios_estado_chart || [],
                    recientes: resData.recientes || []
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const { stats, actividadChart, usuariosEstadoChart, recientes } = data;
    const safeStats = {
        total_usuarios: stats?.total_usuarios ?? 0,
        total_modulos: stats?.total_modulos ?? 0,
        total_roles: stats?.total_roles ?? 0,
        total_instituciones: stats?.total_instituciones ?? 0,
    };

    if (loading) {
        return (
            <LayoutDashboard>
                <Head title="Cargando Dashboard..." />
                <DashboardSkeleton />
            </LayoutDashboard>
        );
    }

    return (
        <LayoutDashboard>
            <Head title="Dashboard" />

            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2 animate-in fade-in duration-500">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h2>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            20 Ene, 2024 - 09 Feb, 2024
                        </Button>
                        <Button size="sm" className="dark:text-white">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-4 animate-in fade-in duration-700">
                    <TabsList>
                        <TabsTrigger value="overview">
                            <PieChart className="mr-1 h-4 w-4" />
                            Resumen
                        </TabsTrigger>
                        <TabsTrigger value="analytics" disabled>
                            <BarChart3 className="mr-1 h-4 w-4" />
                            Analíticas
                        </TabsTrigger>
                        <TabsTrigger value="reports" disabled>
                            <FileText className="mr-1 h-4 w-4" />
                            Reportes
                        </TabsTrigger>
                        <TabsTrigger value="notifications" disabled>
                            <Bell className="mr-1 h-4 w-4" />
                            Notificaciones
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <MetricCard
                                title="Total Usuarios"
                                value={safeStats.total_usuarios}
                                icon={Users}
                                description="Active accounts"
                                trend={{
                                    value: '+12.5%',
                                    label: 'vs last week',
                                }}
                                sparklineData={[
                                    { value: 10 },
                                    { value: 12 },
                                    { value: 15 },
                                    { value: 13 },
                                    { value: 17 },
                                    { value: 18 },
                                    { value: 20 },
                                ]}
                            />
                            <MetricCard
                                title="Módulos Activos"
                                value={safeStats.total_modulos}
                                icon={Layers}
                                description="Modules deployed"
                                trend={{
                                    value: '+4.2%',
                                    label: 'vs last week',
                                }}
                                sparklineData={[
                                    { value: 5 },
                                    { value: 5 },
                                    { value: 6 },
                                    { value: 6 },
                                    { value: 7 },
                                    { value: 7 },
                                    { value: 8 },
                                ]}
                            />
                            <MetricCard
                                title="Roles del Sistema"
                                value={safeStats.total_roles}
                                icon={ShieldAlert}
                                description="Security roles"
                                trend={{ value: '0.0%', label: 'vs last week' }} // Neutral trend
                                sparklineData={[
                                    { value: 4 },
                                    { value: 4 },
                                    { value: 4 },
                                    { value: 4 },
                                    { value: 4 },
                                    { value: 4 },
                                    { value: 4 },
                                ]}
                            />
                            <MetricCard
                                title="Instituciones"
                                value={safeStats.total_instituciones}
                                icon={Building2}
                                description="Registered entities"
                                trend={{
                                    value: '-1.1%',
                                    label: 'vs last week',
                                }}
                                sparklineData={[
                                    { value: 20 },
                                    { value: 19 },
                                    { value: 19 },
                                    { value: 18 },
                                    { value: 18 },
                                    { value: 17 },
                                    { value: 17 },
                                ]}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <ActivityChart data={actividadChart} />
                            <RecentActivity activity={recientes} />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <StatusChart data={usuariosEstadoChart} />

                            {/* Placeholder para más información o métricas secundarias */}
                            <div className="bg-muted/20 col-span-full flex items-center justify-center rounded-xl border border-dashed p-8 lg:col-span-4">
                                <div className="text-center">
                                    <p className="text-muted-foreground text-sm italic">
                                        Sección para analíticas adicionales
                                        próximamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </LayoutDashboard>
    );
}
