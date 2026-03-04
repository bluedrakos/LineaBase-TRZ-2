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
        // Obtener módulos activos con permiso "listar", incluyendo grupoMenu y tipoModulo
        $modulos = $this->permisos()
            ->whereHas('moduloAccion.accion', function ($query) {
                $query->where('acc_slug', 'listar');
            })
            ->whereHas('moduloAccion.modulo', function ($query) {
                $query->where('mod_activo', true);
            })
            ->with(['moduloAccion.modulo.grupoMenu', 'moduloAccion.modulo.tipoModulo'])
            ->get()
            ->map(fn($permiso) => $permiso->moduloAccion->modulo)
            ->filter(fn($mod) => $mod && $mod->mod_activo)
            ->unique('mod_id')
            ->values();

        $modulosMap = $modulos->map(function ($mod) {
            $grupo = $mod->grupoMenu;
            $tipo = $mod->tipoModulo;

            return [
                'mod_id'       => (int) $mod->mod_id,
                'tmo_id'       => $tipo ? (int) $tipo->tmo_id : null,
                'tipo_nombre'  => $tipo ? $tipo->tmo_nombre : 'Sueltos',
                'tipo_icono'   => $tipo ? $tipo->tmo_icono : 'Folder',
                'mod_nombre'   => $mod->mod_nombre,
                'mod_slug'     => $mod->mod_slug,
                'mod_icono'    => $mod->mod_icono ?: 'Circle',
                'mod_orden'    => (int) ($mod->mod_orden ?? 0),
                'mod_ruta'     => $mod->mod_slug === 'dashboard' ? '/dashboard' : '/dashboard/' . $mod->mod_slug,
                'grupo_slug'   => $grupo?->gme_slug ?? 'general',
                'grupo_nombre' => $grupo?->gme_nombre ?? 'GENERAL',
                'grupo_orden'  => (int) ($grupo?->gme_orden ?? 1),
            ];
        })->values();

        $grouped = $modulosMap
            ->groupBy('grupo_slug')
            ->map(function ($mods, $slug) {
                $first = $mods->first();
                $mods = $mods->sortBy('mod_orden')->values();

                // Separamos los que tienen tipo (y agrupamos por tipo) y los sueltos
                $tipos = $mods->whereNotNull('tmo_id')->groupBy('tmo_id');
                $sueltos = $mods->whereNull('tmo_id')->values();

                $items = collect();

                foreach ($tipos as $tmoId => $modulosPorTipo) {
                    $primerMod = $modulosPorTipo->first();
                    $items->push([
                        'title' => $primerMod['tipo_nombre'],
                        'url'   => null,
                        'icon'  => $primerMod['tipo_icono'],
                        'orden' => $primerMod['mod_orden'],
                        'items' => $modulosPorTipo->map(fn($m) => [
                            'title' => $m['mod_nombre'],
                            'url'   => $m['mod_ruta'],
                            'icon'  => $m['mod_icono'],
                        ])->values()->all(),
                    ]);
                }

                foreach ($sueltos as $suelto) {
                    $items->push([
                        'title' => $suelto['mod_nombre'],
                        'url'   => $suelto['mod_ruta'],
                        'icon'  => $suelto['mod_icono'],
                        'items' => [],
                        'orden' => $suelto['mod_orden'],
                    ]);
                }

                $items = $items->sortBy('orden')->values();

                $items = $items->sortBy('orden')->values();

                return [
                    'grupo_nombre' => $first['grupo_nombre'] ?? strtoupper($slug),
                    'grupo_slug'   => $slug,
                    'grupo_orden'  => (int) ($first['grupo_orden'] ?? 999),
                    'items'        => $items->map(function ($i) { unset($i['orden']); return $i; })->all(),
                ];
            })
            ->sortBy('grupo_orden')
            ->values();

        return $grouped;
    }

    public function tienePermiso(int|string $modulo, int|string $accion): bool
    {
        return $this->permisos()
            ->whereHas('moduloAccion.modulo', function ($query) use ($modulo) {
                if (is_int($modulo)) {
                    $query->where('mod_id', $modulo);
                } else {
                    $norm = str_replace('_', '-', strtolower($modulo));
                    $query->where(function($q) use ($modulo, $norm) {
                        $q->where('mod_codigo', $modulo)
                          ->orWhere('mod_slug', $modulo)
                          ->orWhere('mod_slug', $norm);
                    });
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
