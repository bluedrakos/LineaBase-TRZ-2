<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Responses\ApiResponse;
use App\Models\Auditoria;
use App\Models\Institucion;
use App\Models\Modulo;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;

class DashboardApiController extends ApiController
{

    public function resumen()
    {
        $stats = [
            'total_usuarios' => Usuario::count(),
            'total_modulos' => Modulo::count(),
            'total_roles' => Rol::count(),
            'total_instituciones' => Institucion::count(),
        ];

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

        $usuariosEstadoChart = Usuario::select(
            'usu_estado',
            DB::raw('count(*) as total')
        )
            ->groupBy('usu_estado')
            ->get();

        $recientes = Auditoria::with('usuario')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return $this->ok([
            'stats' => $stats,
            'actividad_chart' => $actividadChart,
            'usuarios_estado_chart' => $usuariosEstadoChart,
            'recientes' => $recientes,
        ]);
    }
}
