import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
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
                <div className="scrollbar-thin h-[210px] space-y-8 overflow-auto pr-4">
                    {activity.map((item) => (
                        <div
                            key={item.aud_id}
                            className="flex items-center gap-4"
                        >
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {item.usuario?.usu_nombre?.charAt(0)}
                                    {item.usuario?.usu_apellidos?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-col gap-1">
                                <p className="truncate text-sm leading-none font-medium">
                                    {item.usuario?.usu_nombre || 'Sistema'}{' '}
                                    {item.usuario?.usu_apellidos}
                                </p>
                                <p className="text-muted-foreground truncate text-xs">
                                    {item.aud_accion} - {item.aud_descripcion}
                                </p>
                            </div>
                            <div className="text-muted-foreground ml-auto text-xs whitespace-nowrap">
                                {formatDistanceToNow(
                                    new Date(item.created_at),
                                    { addSuffix: true, locale: es },
                                )}
                            </div>
                        </div>
                    ))}
                    {activity.length === 0 && (
                        <p className="text-muted-foreground py-4 text-center text-sm">
                            No hay actividad registrada.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
