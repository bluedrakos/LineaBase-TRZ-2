<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApiPermitirModuloAccion
{
    public function handle(
        Request $request,
        Closure $next,
        string $action = 'listar',
        string $moduloRef = ''
    ) {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticado',
                'errors' => (object) ['code' => 'unauthenticated'],
            ], 401);
        }

        $rol = DB::table('roles')
            ->where('rol_id', $user->rol_id)
            ->select('rol_activo')
            ->first();

        if (!$rol || !$rol->rol_activo) {
            return response()->json([
                'success' => false,
                'message' => 'Rol inactivo',
                'errors' => (object) ['code' => 'role_inactive'],
            ], 403);
        }

        if ($moduloRef === '') {
            return response()->json([
                'success' => false,
                'message' => 'Modulo no definido para validacion',
                'errors' => (object) ['code' => 'module_slug_required'],
            ], 500);
        }

        $moduloRefNormalized = str_replace('_', '-', strtolower($moduloRef));

        $modulo = DB::table('modulos')
            ->where(function ($q) use ($moduloRef, $moduloRefNormalized) {
                $q->where('mod_codigo', $moduloRef)
                  ->orWhere('mod_slug', $moduloRef)
                  ->orWhere('mod_slug', $moduloRefNormalized);
            })
            ->select('mod_activo')
            ->first();

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Modulo no encontrado',
                'errors' => (object) ['code' => 'module_not_found'],
            ], 404);
        }

        if (!$modulo->mod_activo) {
            return response()->json([
                'success' => false,
                'message' => 'Modulo desactivado',
                'errors' => (object) ['code' => 'module_inactive'],
            ], 403);
        }

        $tienePermiso = DB::table('modulos as m')
            ->join('modulo_acciones as ma', 'ma.mod_id', '=', 'm.mod_id')
            ->join('acciones as a', 'a.acc_id', '=', 'ma.acc_id')
            ->join('rol_modulo_acciones as rma', 'rma.mac_id', '=', 'ma.mac_id')
            ->where('rma.rol_id', $user->rol_id)
            ->where(function ($q) use ($moduloRef, $moduloRefNormalized) {
                $q->where('m.mod_codigo', $moduloRef)
                  ->orWhere('m.mod_slug', $moduloRef)
                  ->orWhere('m.mod_slug', $moduloRefNormalized);
            })
            ->where('a.acc_slug', $action)
            ->exists();

        if (!$tienePermiso) {
            return response()->json([
                'success' => false,
                'message' => 'Accion no permitida para este modulo',
                'errors' => (object) ['code' => 'forbidden'],
            ], 403);
        }

        return $next($request);
    }
}
