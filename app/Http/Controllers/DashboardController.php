<?php

namespace App\Http\Controllers;

use App\Models\Auditoria;
use App\Models\Institucion;
use App\Models\Modulo;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Estadísticas básicas (Cards)
        $stats = [
            'total_usuarios' => Usuario::count(),
            'total_modulos' => Modulo::count(),
            'total_roles' => Rol::count(),
            'total_instituciones' => Institucion::count(),
        ];

        // 2. Datos para gráfico de actividad (últimos 7 días)
        $actividadChart = Auditoria::select(
            DB::raw('DATE(created_at) as fecha'),
            DB::raw('count(*) as total')
        )
        ->groupBy('fecha')
        ->orderBy('fecha', 'desc')
        ->limit(7)
        ->get()
        ->reverse()
        ->values();

        // 3. Distribución de usuarios por estado
        $usuariosEstadoChart = Usuario::select(
            'usu_estado',
            DB::raw('count(*) as total')
        )
        ->groupBy('usu_estado')
        ->get();

        // 4. Últimas auditorías (Actividad reciente)
        $recientes = Auditoria::with('usuario')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'actividadChart' => $actividadChart,
            'usuariosEstadoChart' => $usuariosEstadoChart,
            'recientes' => $recientes,
        ]);
    }
}
