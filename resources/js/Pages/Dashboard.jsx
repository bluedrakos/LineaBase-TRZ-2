import LayoutDashboard from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { BarChart3, Bell, Building2, Calendar as CalendarIcon, Download, FileText, Layers, PieChart, ShieldAlert, Users } from 'lucide-react';
import { ActivityChart } from './Dashboard/components/ActivityChart';
import { MetricCard } from './Dashboard/components/MetricCard';
import { RecentActivity } from './Dashboard/components/RecentActivity';
import { StatusChart } from './Dashboard/components/StatusChart';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';

export default function Dashboard({ stats, actividadChart, usuariosEstadoChart, recientes }) {
    return (
        <LayoutDashboard>
            <Head title="Dashboard" />
            
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            20 Ene, 2024 - 09 Feb, 2024
                        </Button>
                        <Button size="sm" className="dark:text-white">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
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
                                value={stats.total_usuarios} 
                                icon={Users}
                                description="Active accounts"
                                trend={{ value: "+12.5%", label: "vs last week" }}
                                sparklineData={[
                                    { value: 10 }, { value: 12 }, { value: 15 }, { value: 13 }, { value: 17 }, { value: 18 }, { value: 20 }
                                ]}
                            />
                            <MetricCard 
                                title="Módulos Activos" 
                                value={stats.total_modulos} 
                                icon={Layers}
                                description="Modules deployed"
                                trend={{ value: "+4.2%", label: "vs last week" }}
                                sparklineData={[
                                    { value: 5 }, { value: 5 }, { value: 6 }, { value: 6 }, { value: 7 }, { value: 7 }, { value: 8 }
                                ]}
                            />
                            <MetricCard 
                                title="Roles del Sistema" 
                                value={stats.total_roles} 
                                icon={ShieldAlert}
                                description="Security roles"
                                trend={{ value: "0.0%", label: "vs last week" }} // Neutral trend
                                sparklineData={[
                                    { value: 4 }, { value: 4 }, { value: 4 }, { value: 4 }, { value: 4 }, { value: 4 }, { value: 4 }
                                ]}
                            />
                            <MetricCard 
                                title="Instituciones" 
                                value={stats.total_instituciones} 
                                icon={Building2}
                                description="Registered entities"
                                trend={{ value: "-1.1%", label: "vs last week" }}
                                sparklineData={[
                                    { value: 20 }, { value: 19 }, { value: 19 }, { value: 18 }, { value: 18 }, { value: 17 }, { value: 17 }
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
                            <div className="col-span-full lg:col-span-4 bg-muted/20 rounded-xl border border-dashed flex items-center justify-center p-8">
                                <div className="text-center">
                                    <p className="text-muted-foreground text-sm italic">
                                        Sección para analíticas adicionales próximamente.
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
