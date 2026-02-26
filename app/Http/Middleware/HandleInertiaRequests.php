<?php

namespace App\Http\Middleware;

use App\Models\Sistema;
use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Usuario;
use Illuminate\Support\Facades\Gate;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */

    public function share(Request $request): array
    {
        $user = $request->user();

        // El sidebar ya viene agrupado por grupo_menu desde navegacionSidebar()
        $sidebar = $user
            ? collect($user->rol?->navegacionSidebar() ?? [])->values()->all()
            : [];

        $configSistema = \Illuminate\Support\Facades\Cache::remember('sistema_config', 86400, function () {
            return [
                'nombre' => Sistema::where('sis_nombre', 'Nombre de la aplicación')->value('sis_valor') ?? 'Línea Base TRZ',
                'descripcion' => Sistema::where('sis_nombre', 'Descripción de la aplicación')->value('sis_valor') ?? 'Trazabilidad',
                'version' => Sistema::where('sis_nombre', 'Versión de la aplicación')->orWhere('sis_id', 3)->value('sis_valor') ?? '0.0.0',
            ];
        });

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'usu_id' => $user->usu_id,
                    'usu_nombre' => $user->usu_nombre,
                    'usu_apellidos' => $user->usu_apellidos,
                    'usu_correo' => $user->usu_correo,
                    'usu_avatar' => $user->usu_avatar, // Si tienes avatar
                    'rol' => $user->rol ? $user->rol->rol_nombre : null, // Solo el nombre del rol string
                ] : null,

                'sidebar' => $sidebar,
            ],

            'permisos' => permisosPorSubmodulo(),

            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],

            'nombreSistema'      => $configSistema['nombre'],
            'descripcionSistema' => $configSistema['descripcion'],
            'versionSistema'     => $configSistema['version'],
        ]);
    }
}
