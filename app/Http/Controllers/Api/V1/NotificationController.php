<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Obtener el listado de notificaciones del usuario autenticado (paginado)
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', 15);
        $notifications = $request->user()->notifications()->paginate($limit);
        
        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    /**
     * Obtener el conteo de notificaciones no leídas
     */
    public function unreadCount(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'count' => $request->user()->unreadNotifications()->count()
            ]
        ]);
    }

    /**
     * Marcar una notificación específica como leída
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();
        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json([
            'success' => true,
            'message' => 'Notificación marcada como leída.'
        ]);
    }

    /**
     * Marcar todas las notificaciones del usuario como leídas
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        
        return response()->json([
            'success' => true,
            'message' => 'Todas las notificaciones han sido marcadas como leídas.'
        ]);
    }
}
