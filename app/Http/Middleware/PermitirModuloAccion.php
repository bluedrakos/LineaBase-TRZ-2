<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Closure;
use Inertia\Inertia;

class PermitirModuloAccion
{

    public function handle(
        Request $request,
        Closure $next,
        string $action = 'listar',
        int $mod = 2,
        string $modslug = null,
    ) {
        $user = $request->user();
        if (!$user) {
            abort(401);
        }

        $rol = DB::table('roles')
            ->where('rol_id', $user->rol_id)
            ->select('rol_activo')
            ->first();

        if (!$rol || !$rol->rol_activo) {
            return inertia('Errors/Denegado', [
                'title' => 'Rol inactivo',
                'message' => 'Tu rol está desactivado. No tienes acceso al sistema.'
            ])->toResponse($request)->setStatusCode(403);
        }

        $modslug = $modslug ??  $request->segment($mod);

        $modulo = DB::table('modulos')
            ->where('mod_slug', $modslug)
            ->select('mod_activo')
            ->first();

        if (!$modslug) {
            abort(401);
        }

        if (!$modulo) {
            return inertia('Errors/Denegado', [
                'title' => 'Módulo no encontrado',
                'message' => 'El módulo solicitado no existe.'
            ])->toResponse($request)->setStatusCode(404);
        }

        if (!$modulo->mod_activo) {
            return inertia('Errors/Denegado', [
                'title' => 'Módulo desactivado',
                'message' => 'Este módulo está actualmente desactivado.'
            ])->toResponse($request)->setStatusCode(403);
        }

        $tienePermiso = DB::table('tipo_modulo as t')
            ->join('modulos as m', 'm.tmo_id', '=', 't.tmo_id')
            ->join('modulo_acciones as ma', 'ma.mod_id', '=', 'm.mod_id')
            ->join('acciones as a', 'a.acc_id', '=', 'ma.acc_id')
            ->join('rol_modulo_acciones as rma', 'rma.mac_id', '=', 'ma.mac_id')
            ->join('usuarios as u', 'u.rol_id', '=', 'rma.rol_id')
            ->where('m.mod_slug', $modslug)
            ->where('a.acc_slug', $action)
            ->where('u.usu_id', $user->usu_id)
            ->exists();

        if (!$tienePermiso) {
            return inertia('Errors/Denegado', [
                'title' => 'Acceso Denegado',
                'message' => 'No tienes permisos para esta acción en el módulo.'
            ])->toResponse($request)->setStatusCode(403);
        }

        return $next($request);
    }
}
