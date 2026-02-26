import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover';
import { Bell, FileWarning, Mail, Users } from 'lucide-react';

export function NotificacionesPopover() {
    const total = 3;

    const notificaciones = [
        {
            icon: <Mail className="h-4 w-4" />,
            texto: '3 mensajes nuevos',
            tiempo: 'hace 3 min',
        },
        {
            icon: <Users className="h-4 w-4" />,
            texto: '8 solicitudes de amistad',
            tiempo: 'hace 12 horas',
        },
        {
            icon: <FileWarning className="h-4 w-4" />,
            texto: '3 reportes nuevos',
            tiempo: 'hace 2 días',
        },
    ];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 rounded-full bg-yellow-400 px-1.5 py-0 text-xs text-black">
                        {total}
                    </Badge>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0">
                <div className="border-b px-4 py-2 text-sm font-medium">
                    {total} Notificaciones
                </div>
                <div className="divide-y">
                    {notificaciones.map((n, i) => (
                        <div
                            key={i}
                            className="hover:bg-accent flex cursor-pointer items-start gap-2 px-4 py-2 text-sm"
                        >
                            {n.icon}
                            <div className="flex-1">
                                <div>{n.texto}</div>
                                <div className="text-muted-foreground text-xs">
                                    {n.tiempo}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cursor-pointer border-t px-4 py-2 text-center text-sm hover:underline">
                    Ver todas las notificaciones
                </div>
            </PopoverContent>
        </Popover>
    );
}
