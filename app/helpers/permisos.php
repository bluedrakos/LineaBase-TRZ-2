<?php

use App\Models\Usuario;
use Illuminate\Support\Facades\Cache;
/*
 * Obtiene los permisos del usuario agrupados por submódulo.
 * Utiliza caché para mejorar el rendimiento.
 */ 
if (!function_exists('permisosPorSubmodulo')) {
    function permisosPorSubmodulo(): array
    {
        $usuario = auth()->user();
        if (! $usuario) return [];
        

        return Cache::remember("permisos_usuario_{$usuario->usu_id}", 3600, function () use ($usuario) {
            $permisos = [];

            $usuario->loadMissing(['rol.permisos.moduloAccion.modulo', 'rol.permisos.moduloAccion.accion']);

            if ($usuario->rol && $usuario->rol->permisos) {
                foreach ($usuario->rol->permisos as $permiso) {
                    if ($permiso->moduloAccion && $permiso->moduloAccion->modulo && $permiso->moduloAccion->accion) {
                        $sub = $permiso->moduloAccion->modulo->mod_slug;
                        $accion = $permiso->moduloAccion->accion->acc_slug;
                        $icono = $permiso->moduloAccion->accion->acc_icono;

                        $permisos[$sub][] = [
                            "accion" => $accion,
                            "icono" => $icono,
                        ];                     
                    }
                }
            }

            foreach ($permisos as $sub => $acciones) {
                $permisos[$sub] = collect($acciones)
                ->unique(fn ($accion) => $accion['accion']) 
                ->values()
                ->all();
            }

            return $permisos;
        });

        return $permisos;
    }
}
