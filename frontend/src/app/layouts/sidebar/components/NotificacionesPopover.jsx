import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Bell, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/shared/lib/api-client';

// Helper to resolve icon based on notification data
const resolveIcon = (iconName) => {
    switch(iconName) {
        case 'AlertCircle': return <AlertCircle className="h-4 w-4 text-red-500" />;
        case 'CheckCircle': return <CheckCircle className="h-4 w-4 text-green-500" />;
        default: return <Info className="h-4 w-4 text-blue-500" />;
    }
};

export function NotificacionesPopover() {
    const [total, setTotal] = useState(0);
    const [notificaciones, setNotificaciones] = useState([]);

    const loadData = async () => {
        try {
            const countRes = await apiClient.get('/notifications/unread-count');
            if (countRes.data?.success) {
                setTotal(countRes.data.data.count);
            }

            const listRes = await apiClient.get('/notifications?limit=5');
            if (listRes.data?.success) {
                setNotificaciones(listRes.data.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching notifications API:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const markAsRead = async (id) => {
        try {
            await apiClient.post(`/notifications/${id}/mark-read`);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {total > 0 && (
                        <Badge className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 py-0 text-[10px] text-white hover:bg-red-700">
                            {total}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <span className="text-sm font-semibold">Notificaciones</span>
                    <Badge variant="secondary" className="text-xs">
                        {total} nuevas
                    </Badge>
                </div>
                <div className="max-h-[300px] divide-y overflow-y-auto">
                    {notificaciones.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No hay notificaciones
                        </div>
                    ) : (
                        notificaciones.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => !n.read_at && markAsRead(n.id)}
                                className={`flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-accent/50 ${
                                    !n.read_at ? 'bg-blue-50/50 dark:bg-slate-800/50' : ''
                                }`}
                            >
                                <div className="mt-0.5">
                                    {resolveIcon(n.data?.icono)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {n.data?.titulo || 'Notificación'}
                                    </p>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {n.data?.mensaje || ''}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        {new Date(n.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                {!n.read_at && (
                                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <div className="cursor-pointer border-t bg-slate-50 p-2 text-center text-sm font-medium hover:underline dark:bg-slate-900">
                    Ver todas las notificaciones
                </div>
            </PopoverContent>
        </Popover>
    );
}
