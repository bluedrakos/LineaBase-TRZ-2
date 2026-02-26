import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import LayoutDashboard from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import UserDetailView from './components/UserDetailView';

export default function Show({ usuario }) {
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
                        <UserDetailView usuario={usuario} />
                    </CardContent>
                </Card>
            </div>
        </LayoutDashboard>
    );
}
