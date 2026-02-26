<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Usuario;
use App\Models\RolModuloAccion;

class Rol extends Model
{
    use HasFactory;

    protected $table = 'roles';
    protected $primaryKey = 'rol_id';

    protected $fillable = [
        'rol_nombre',
        'rol_descripcion',
        'rol_activo',
        'area_id',
    ];

    protected $casts = [
        'rol_activo' => 'boolean',
    ];

    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'rol_id');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }


    public function permisos()
    {
        return $this->hasMany(RolModuloAccion::class, 'rol_id')
            ->with('moduloAccion.modulo', 'moduloAccion.accion');
    }

    public function navegacionSidebar()
    {
        // Obtener módulos activos con permiso "listar", incluyendo grupoMenu
        $modulos = $this->permisos()
            ->whereHas('moduloAccion.accion', function ($query) {
                $query->where('acc_slug', 'listar');
            })
            ->whereHas('moduloAccion.modulo', function ($query) {
                $query->where('mod_activo', true);
            })
            ->with('moduloAccion.modulo.grupoMenu')
            ->get()
            ->map(fn($permiso) => $permiso->moduloAccion->modulo)
            ->filter(fn($mod) => $mod && $mod->mod_activo)
            ->unique('mod_id')
            ->values();

        // Preparar datos de cada módulo con info del grupo
        $modulosMap = $modulos->map(function ($mod) {
            $grupo = $mod->grupoMenu;

            return [
                'mod_id'       => (int) $mod->mod_id,
                'mod_padre_id' => $mod->mod_padre_id ? (int) $mod->mod_padre_id : null,
                'mod_nombre'   => $mod->mod_nombre,
                'mod_slug'     => $mod->mod_slug,
                'mod_icono'    => $mod->mod_icono ?: 'Circle',
                'mod_orden'    => (int) ($mod->mod_orden ?? 0),
                'mod_ruta'     => '/dashboard/' . $mod->mod_slug,
                'grupo_slug'   => $grupo?->gme_slug ?? 'general',
                'grupo_nombre' => $grupo?->gme_nombre ?? 'GENERAL',
                'grupo_orden'  => (int) ($grupo?->gme_orden ?? 1),
            ];
        })->values();

        // Agrupar por grupo_slug y armar la estructura de secciones
        $grouped = $modulosMap
            ->groupBy('grupo_slug')
            ->map(function ($mods, $slug) {
                $first = $mods->first();
                $mods = $mods->sortBy('mod_orden')->values();

                // Separar módulos raíz de hijos
                $childrenByParent = $mods->whereNotNull('mod_padre_id')->groupBy('mod_padre_id');
                $roots = $mods->whereNull('mod_padre_id')->values();

                $items = $roots->map(function ($root) use ($childrenByParent) {
                    $children = ($childrenByParent[$root['mod_id']] ?? collect())
                        ->sortBy('mod_orden')
                        ->map(fn($child) => [
                            'title' => $child['mod_nombre'],
                            'url'   => $child['mod_ruta'],
                            'icon'  => $child['mod_icono'],
                        ])
                        ->values()
                        ->all();

                    return [
                        'title' => $root['mod_nombre'],
                        'url'   => $children ? null : $root['mod_ruta'],
                        'icon'  => $root['mod_icono'],
                        'items' => $children,
                    ];
                })->values();

                // Grupo GENERAL: asegurar "Panel" como primera entrada
                if ($slug === 'general' && !$items->contains(fn($i) => mb_strtolower($i['title']) === 'panel')) {
                    $items->prepend([
                        'title' => 'Panel',
                        'url'   => '/dashboard',
                        'icon'  => 'LayoutDashboard',
                        'items' => [],
                    ]);
                }

                return [
                    'grupo_nombre' => $first['grupo_nombre'] ?? strtoupper($slug),
                    'grupo_slug'   => $slug,
                    'grupo_orden'  => (int) ($first['grupo_orden'] ?? 999),
                    'items'        => $items->filter(fn($i) => !empty($i['url']) || !empty($i['items']))->values()->all(),
                ];
            })
            ->sortBy('grupo_orden')
            ->values();

        // Asegurar que siempre exista el grupo GENERAL con Panel
        if (!$grouped->contains(fn($g) => ($g['grupo_slug'] ?? null) === 'general')) {
            $grouped->prepend([
                'grupo_nombre' => 'GENERAL',
                'grupo_slug'   => 'general',
                'grupo_orden'  => 1,
                'items'        => [
                    [
                        'title' => 'Panel',
                        'url'   => '/dashboard',
                        'icon'  => 'LayoutDashboard',
                        'items' => [],
                    ],
                ],
            ]);
        }

        return $grouped;
    }

    public function tienePermiso(int|string $modulo, int|string $accion): bool
    {
        return $this->permisos()
            ->whereHas('moduloAccion.modulo', function ($query) use ($modulo) {
                if (is_int($modulo)) {
                    $query->where('mod_id', $modulo);
                } else {
                    $query->where('mod_slug', $modulo);
                }
            })
            ->whereHas('moduloAccion.accion', function ($query) use ($accion) {
                if (is_int($accion)) {
                    $query->where('acc_id', $accion);
                } else {
                    $query->where('acc_slug', $accion);
                }
            })
            ->exists();
    }


    public function accionesDisponibles(int $moduloId): array
    {
        return $this->permisos()
            ->whereHas('moduloAccion', function ($query) use ($moduloId) {
                $query->where('mod_id', $moduloId);
            })
            ->with('moduloAccion.accion')
            ->get()
            ->pluck('moduloAccion.acc_id')
            ->unique()
            ->values()
            ->toArray();
    }
}
