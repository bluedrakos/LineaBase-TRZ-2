<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Responses\ApiResponse;
use App\Models\Accion;
use App\Models\Auditoria;
use App\Models\GrupoMenu;
use App\Models\Modulo;
use App\Models\ModuloAccion;
use App\Models\RolModuloAccion;
use App\Models\TipoModulo;
use App\Services\FrontendModuleScaffolder;
use App\Services\BackendModuleScaffolder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ModulosApiController extends ApiController
{
    public function __construct(
        private readonly FrontendModuleScaffolder $frontendModuleScaffolder,
        private readonly BackendModuleScaffolder $backendModuleScaffolder
    ) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        $modulos = Modulo::with('tipoModulo', 'moduloAcciones.accion')
            ->orderBy('mod_orden')
            ->paginate($perPage);

        return $this->ok($modulos->items(), meta: [
            'current_page' => $modulos->currentPage(),
            'per_page' => $modulos->perPage(),
            'total' => $modulos->total(),
            'last_page' => $modulos->lastPage(),
        ]);
    }

    public function meta()
    {
        $tipoModulo = TipoModulo::select('tmo_id', 'tmo_nombre', 'tmo_slug', 'tmo_icono')->get();
        $grupoMenu = GrupoMenu::where('gme_activo', true)
            ->orderBy('gme_orden')
            ->get(['gme_id', 'gme_nombre', 'gme_slug']);

        $allowedTypeByGroup = $this->buildAllowedTypeMap($grupoMenu, $tipoModulo);
        $siguienteOrden = Modulo::selectRaw('gme_id, tmo_id, COALESCE(MAX(mod_orden), 0) + 1 as siguiente_orden')
            ->groupBy('gme_id', 'tmo_id')
            ->get();

        return $this->ok([
            'tipo_modulo' => $tipoModulo,
            'grupo_menu' => $grupoMenu,
            'allowed_type_by_group' => $allowedTypeByGroup,
            'acciones' => Accion::select('acc_id', 'acc_nombre', 'acc_icono')->get(),
            'siguiente_orden_por_bucket' => $siguienteOrden,
        ]);
    }

    public function show(Modulo $modulo)
    {
        $modulo->load('tipoModulo', 'moduloAcciones.accion', 'grupoMenu');
        return $this->ok($modulo);
    }

    public function store(Request $request)
    {
        $ip = $request->ip();
        $data = $request->validate([
            'mod_nombre' => 'required|string|max:255',
            'mod_slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                'unique:modulos,mod_slug',
            ],
            'mod_icono' => 'nullable|string|max:255',
            'mod_orden' => 'nullable|integer|min:1',
            'mod_activo' => 'required|boolean',
            'gme_id' => 'required|exists:grupo_menu,gme_id',
            'tmo_id' => 'nullable|exists:tipo_modulo,tmo_id',
            'acciones' => 'array',
            'acciones.*' => 'exists:acciones,acc_id',
        ]);

        $this->ensureTypeBelongsToGroup((int) $data['gme_id'], $data['tmo_id'] ? (int) $data['tmo_id'] : null);
        $modulo = null;

        DB::transaction(function () use (&$modulo, $data, $ip) {
            $gmeId = $data['gme_id'];
            $tmoId = $data['tmo_id'] ?? null;
            
            $ultimoOrden = $this->bucketQuery($gmeId, $tmoId)->max('mod_orden') ?? 0;
            $ordenFinal = empty($data['mod_orden'])
                ? $ultimoOrden + 1
                : min($data['mod_orden'], $ultimoOrden + 1);

            if (!empty($data['mod_orden'])) {
                $this->bucketQuery($gmeId, $tmoId)
                    ->where('mod_orden', '>=', $ordenFinal)
                    ->increment('mod_orden');
            }

            $modCodigo = $this->generarCodigoTecnico($data['mod_slug']);

            $modulo = Modulo::create([
                'mod_nombre' => $data['mod_nombre'],
                'mod_codigo' => $modCodigo,
                'mod_slug' => $data['mod_slug'],
                'mod_icono' => $data['mod_icono'],
                'mod_orden' => $ordenFinal,
                'mod_activo' => $data['mod_activo'],
                'gme_id' => $gmeId,
                'tmo_id' => $tmoId,
                'mod_creado_por' => auth()->id(),
            ]);

            foreach ($data['acciones'] ?? [] as $accId) {
                ModuloAccion::create([
                    'mod_id' => $modulo->mod_id,
                    'acc_id' => $accId,
                ]);
            }

            Auditoria::create([
                'usu_id' => auth()->id(),
                'aud_metodo' => 'POST',
                'aud_ip' => $ip,
                'aud_accion' => 'modulos.store',
                'aud_descripcion' => 'Creo un nuevo modulo',
                'aud_id_afectado' => $modulo->mod_id,
                'aud_datos' => json_encode([
                    'mod_nombre' => $data['mod_nombre'],
                    'gme_id' => $data['gme_id'],
                    'tmo_id' => $data['tmo_id'],
                ], JSON_UNESCAPED_UNICODE),
            ]);
        });

        if ($modulo) {
            $isLocal = app()->isLocal();
            $directorio = "frontend/src/modules/{$modulo->mod_slug}";

            if ($isLocal) {
                $directorio = $this->frontendModuleScaffolder->ensure($modulo->mod_slug, $modulo->mod_nombre);
                $this->backendModuleScaffolder->generate($modulo->mod_slug, $modulo->mod_nombre);
            }
            
            $modulo->update(['mod_directorio' => $directorio]);
        }

        return $this->ok($modulo?->load('moduloAcciones.accion', 'tipoModulo', 'grupoMenu'), 'Modulo creado correctamente.', 201);
    }

    public function update(Request $request, Modulo $modulo)
    {
        $ip = $request->ip();
        $validated = $request->validate([
            'mod_nombre' => 'required|string|max:255',
            'mod_slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                'unique:modulos,mod_slug,' . $modulo->mod_id . ',mod_id',
            ],
            'mod_icono' => 'nullable|string|max:255',
            'mod_orden' => 'required|integer|min:1',
            'mod_activo' => 'required|boolean',
            'gme_id' => 'required|exists:grupo_menu,gme_id',
            'tmo_id' => 'nullable|exists:tipo_modulo,tmo_id',
            'acciones' => 'array',
            'acciones.*' => 'integer|exists:acciones,acc_id',
        ]);

        $this->ensureTypeBelongsToGroup((int) $validated['gme_id'], $validated['tmo_id'] ? (int) $validated['tmo_id'] : null);

        DB::transaction(function () use ($validated, $modulo, $ip) {
            $antes = [
                'modulo' => $modulo->only([
                    'mod_nombre',
                    'mod_slug',
                    'mod_icono',
                    'mod_orden',
                    'mod_activo',
                    'gme_id',
                    'tmo_id',
                ]),
                'acciones' => Accion::whereIn(
                    'acc_id',
                    $modulo->moduloAcciones()->pluck('acc_id')
                )->pluck('acc_nombre', 'acc_id'),
            ];

            $ordenOriginal = $modulo->mod_orden;
            $tmoOriginal = $modulo->tmo_id;
            $gmeOriginal = $modulo->gme_id;
            
            $nuevoOrden = $validated['mod_orden'];
            $nuevoTmo = $validated['tmo_id'] ?? null;
            $nuevoGme = $validated['gme_id'];

            if ($tmoOriginal != $nuevoTmo || $gmeOriginal != $nuevoGme) {
                // Sacar del bucket viejo
                $this->bucketQuery($gmeOriginal, $tmoOriginal)
                    ->where('mod_orden', '>', $ordenOriginal)
                    ->decrement('mod_orden');

                // Meter al bucket nuevo
                $ultimoOrdenNuevo = $this->bucketQuery($nuevoGme, $nuevoTmo)->max('mod_orden') ?? 0;
                $nuevoOrden = min($nuevoOrden, $ultimoOrdenNuevo + 1);

                $this->bucketQuery($nuevoGme, $nuevoTmo)
                    ->where('mod_orden', '>=', $nuevoOrden)
                    ->increment('mod_orden');
            } elseif ($ordenOriginal != $nuevoOrden) {
                if ($nuevoOrden > $ordenOriginal) {
                    $this->bucketQuery($nuevoGme, $nuevoTmo)
                        ->whereBetween('mod_orden', [$ordenOriginal + 1, $nuevoOrden])
                        ->decrement('mod_orden');
                } else {
                    $this->bucketQuery($nuevoGme, $nuevoTmo)
                        ->whereBetween('mod_orden', [$nuevoOrden, $ordenOriginal - 1])
                        ->increment('mod_orden');
                }
            }

            $modCodigo = $this->generarCodigoTecnico($validated['mod_slug']);

            $modulo->update([
                'mod_nombre' => $validated['mod_nombre'],
                'mod_codigo' => $modCodigo,
                'mod_slug' => $validated['mod_slug'],
                'mod_icono' => $validated['mod_icono'],
                'mod_orden' => $nuevoOrden,
                'mod_activo' => $validated['mod_activo'],
                'gme_id' => $nuevoGme,
                'tmo_id' => $nuevoTmo,
                'mod_actualizado_por' => auth()->id(),
            ]);

            $accionesActuales = $modulo->moduloAcciones()->pluck('acc_id')->toArray();
            $nuevasAcciones = $validated['acciones'] ?? [];

            $paraAgregar = array_diff($nuevasAcciones, $accionesActuales);
            $paraEliminar = array_diff($accionesActuales, $nuevasAcciones);

            foreach ($paraAgregar as $accId) {
                ModuloAccion::create([
                    'mod_id' => $modulo->mod_id,
                    'acc_id' => $accId,
                ]);
            }

            if (!empty($paraEliminar)) {
                ModuloAccion::where('mod_id', $modulo->mod_id)
                    ->whereIn('acc_id', $paraEliminar)
                    ->delete();
            }

            $modulo->refresh();
            $despues = [
                'modulo' => $modulo->only([
                    'mod_nombre',
                    'mod_slug',
                    'mod_icono',
                    'mod_orden',
                    'mod_activo',
                    'gme_id',
                    'tmo_id',
                ]),
                'acciones' => Accion::whereIn(
                    'acc_id',
                    $modulo->moduloAcciones()->pluck('acc_id')
                )->pluck('acc_nombre', 'acc_id'),
            ];

            Auditoria::create([
                'usu_id' => auth()->id(),
                'aud_metodo' => 'PATCH',
                'aud_accion' => 'modulos.update',
                'aud_descripcion' => 'Actualizo un modulo',
                'aud_id_afectado' => $modulo->mod_id,
                'aud_datos' => json_encode([
                    'before' => $antes,
                    'after' => $despues,
                ], JSON_UNESCAPED_UNICODE),
                'aud_ip' => $ip,
            ]);
        });

        $isLocal = app()->isLocal();
        $directorio = $modulo->mod_directorio ?: "frontend/src/modules/{$validated['mod_slug']}";

        if ($isLocal) {
            $slugOriginal = (string) $modulo->getOriginal('mod_slug');
            $slugNuevo = $validated['mod_slug'];

            if ($slugOriginal !== $slugNuevo) {
                // Solo renombrar si el slug cambió físicamente
                $directorio = $this->frontendModuleScaffolder->rename(
                    $slugOriginal,
                    $slugNuevo,
                    $validated['mod_nombre']
                );
            }
            // Si el slug es igual, NO llamamos a ensure() para no tocar el sistema de archivos innecesariamente
        }

        $modulo->update(['mod_directorio' => $directorio]);

        return $this->ok($modulo->load('moduloAcciones.accion', 'tipoModulo', 'grupoMenu'), 'Modulo actualizado correctamente.');
    }

    public function destroy(Modulo $modulo)
    {
        $macIds = ModuloAccion::where('mod_id', $modulo->mod_id)->pluck('mac_id')->toArray();
        RolModuloAccion::whereIn('mac_id', $macIds)->delete();
        ModuloAccion::where('mod_id', $modulo->mod_id)->delete();
        $modulo->delete();

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'DELETE',
            'aud_accion' => 'modulos.destroy',
            'aud_descripcion' => 'Elimino un modulo',
            'aud_id_afectado' => $modulo->mod_id,
            'aud_datos' => null,
            'aud_ip' => request()->ip(),
        ]);

        return $this->ok(null, 'Modulo eliminado.');
    }

    public function toggleActivo(Modulo $modulo, Request $request)
    {
        $modulo->mod_activo = !$modulo->mod_activo;
        $modulo->save();

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'PATCH',
            'aud_accion' => 'modulos.toggleActivo',
            'aud_descripcion' => ($modulo->mod_activo ? 'Activo un modulo' : 'Desactivo un modulo'),
            'aud_id_afectado' => $modulo->mod_id,
            'aud_datos' => json_encode(['mod_activo' => $modulo->mod_activo], JSON_UNESCAPED_UNICODE),
            'aud_ip' => $request->ip(),
        ]);

        return $this->ok($modulo, 'El estado del modulo ha sido actualizado correctamente.');
    }

    private function buildAllowedTypeMap($grupoMenu, $tipoModulo): array
    {
        $allTypeIds = $tipoModulo->pluck('tmo_id')->map(fn($id) => (int) $id)->values()->all();
        $typeIdsBySlug = $tipoModulo->keyBy('tmo_slug')->map(fn($t) => (int) $t->tmo_id);

        $result = [];
        foreach ($grupoMenu as $grupo) {
            $result[(string) $grupo->gme_id] = $allTypeIds;
        }

        return $result;
    }

    private function ensureTypeBelongsToGroup(int $gmeId, ?int $tmoId): void
    {
        if ($tmoId === null) {
            return; // Un modulo sin tipo esta validado.
        }

        $grupoMenu = GrupoMenu::where('gme_activo', true)->get(['gme_id', 'gme_slug']);
        $tipoModulo = TipoModulo::select('tmo_id', 'tmo_slug')->get();
        $allowed = $this->buildAllowedTypeMap($grupoMenu, $tipoModulo);
        $allowedIds = $allowed[(string) $gmeId] ?? [];

        if (!in_array($tmoId, $allowedIds, true)) {
            throw ValidationException::withMessages([
                'tmo_id' => 'El tipo de modulo seleccionado no pertenece al grupo indicado.',
            ]);
        }
    }

    private function bucketQuery(?int $gmeId, ?int $tmoId)
    {
        return Modulo::where('gme_id', $gmeId)
            ->where(function ($q) use ($tmoId) {
                if ($tmoId) {
                    $q->where('tmo_id', $tmoId);
                } else {
                    $q->whereNull('tmo_id');
                }
            });
    }

    private function generarCodigoTecnico(string $slug): string
    {
        return Str::slug(str_replace('-', '_', strtolower($slug)), '_');
    }
}
