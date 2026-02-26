import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function RecentActivity({ activity }) {
    return (
        <Card className="col-span-full lg:col-span-3">
            <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                    Últimas acciones realizadas en el sistema.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8 h-[210px] overflow-auto pr-4 scrollbar-thin">
                    {activity.map((item) => (
                        <div key={item.aud_id} className="flex items-center gap-4">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {item.usuario?.usu_nombre?.charAt(0)}{item.usuario?.usu_apellidos?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1 min-w-0">
                                <p className="text-sm font-medium leading-none truncate">
                                    {item.usuario?.usu_nombre || 'Sistema'} {item.usuario?.usu_apellidos}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {item.aud_accion} - {item.aud_descripcion}
                                </p>
                            </div>
                            <div className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: es })}
                            </div>
                        </div>
                    ))}
                    {activity.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No hay actividad registrada.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
