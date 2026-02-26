<?php

namespace App\Http\Controllers;

use App\Models\Accion;
use App\Models\Auditoria;
use App\Models\GrupoMenu;
use App\Models\Modulo;
use App\Models\ModuloAccion;
use App\Models\RolModuloAccion;
use App\Models\TipoModulo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ModuloController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $modulo = Modulo::with('tipoModulo', 'moduloAcciones')->get();
        $tipoModulo = TipoModulo::select('tmo_id', 'tmo_nombre', 'tmo_slug', 'tmo_icono')->get();
        $grupoMenu = GrupoMenu::where('gme_activo', true)
            ->orderBy('gme_orden')
            ->get(['gme_id', 'gme_nombre', 'gme_slug']);

        $allowedTypeByGroup = $this->buildAllowedTypeMap($grupoMenu, $tipoModulo);

        $siguienteOrdenPorTipo = Modulo::selectRaw('tmo_id, COALESCE(MAX(mod_orden), 0) + 1 as siguiente_orden')
            ->groupBy('tmo_id')
            ->pluck('siguiente_orden', 'tmo_id');
        $acciones = Accion::select('acc_id', 'acc_nombre', 'acc_icono')->get();

        return inertia('Admin/Modulos/Index', [
            'modulos' => $modulo,
            'permisos' => permisosPorSubmodulo(),
            'tipoModulo' => $tipoModulo,
            'grupoMenu' => $grupoMenu,
            'allowedTypeByGroup' => $allowedTypeByGroup,
            'acciones' => $acciones,
            'siguienteOrdenPorTipo' => $siguienteOrdenPorTipo,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $ip = $request->ip();
        $datafinal = $request->validate([
            'mod_nombre' => 'required|string|max:255',
            'mod_slug'   => 'required|string|max:255|unique:modulos,mod_slug',
            'mod_icono'  => 'nullable|string|max:255',
            'mod_orden'  => 'nullable|integer|min:1',
            'mod_activo' => 'required|boolean',
            'gme_id'     => 'required|exists:grupo_menu,gme_id',
            'tmo_id'     => 'required|exists:tipo_modulo,tmo_id',
            'acciones'   => 'array',
            'acciones.*' => 'exists:acciones,acc_id',
        ]);

        $this->ensureTypeBelongsToGroup((int) $datafinal['gme_id'], (int) $datafinal['tmo_id']);

        DB::transaction(function () use ($datafinal, $ip, &$modulo) {

            $ultimoOrden = Modulo::where('tmo_id', $datafinal['tmo_id'])
                ->max('mod_orden') ?? 0;

            if (empty($datafinal['mod_orden'])) {
                $ordenFinal = $ultimoOrden + 1;
            } else {
                $ordenFinal = min($datafinal['mod_orden'], $ultimoOrden + 1);
                Modulo::where('tmo_id', $datafinal['tmo_id'])
                    ->where('mod_orden', '>=', $ordenFinal)
                    ->increment('mod_orden');
            }

            $modulo = Modulo::create([
                'mod_nombre'     => $datafinal['mod_nombre'],
                'mod_slug'       => $datafinal['mod_slug'],
                'mod_icono'      => $datafinal['mod_icono'],
                'mod_orden'      => $ordenFinal,
                'mod_activo'     => $datafinal['mod_activo'],
                'gme_id'         => $datafinal['gme_id'],
                'tmo_id'         => $datafinal['tmo_id'],
                'mod_creado_por' => auth()->id(),
            ]);

            if (!empty($datafinal['acciones'])) {
                foreach ($datafinal['acciones'] as $acc_id) {
                    ModuloAccion::create([
                        'mod_id' => $modulo->mod_id,
                        'acc_id' => $acc_id,
                    ]);
                }
            }
            Auditoria::create([
                'usu_id'          => auth()->id(),
                'aud_metodo'      => 'POST',
                'aud_ip'          => $ip,
                'aud_accion'      => 'modulos.store',
                'aud_descripcion' => 'Creó un nuevo módulo',
                'aud_id_afectado' => $modulo->mod_id,
                'aud_datos'       => json_encode([
                    'mod_nombre' => $datafinal['mod_nombre'],
                    'gme_id'     => $datafinal['gme_id'],
                    'tmo_id'     => $datafinal['tmo_id'],
                ]),
            ]);
        });

        return redirect()->back()->with('success', 'Módulo creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Modulo $modulo)
    {
        $modulo->load('tipoModulo', 'moduloAcciones.accion');

        $tipoModulo = TipoModulo::select('tmo_id', 'tmo_nombre', 'tmo_slug', 'tmo_icono')->get();
        $grupoMenu = GrupoMenu::where('gme_activo', true)
            ->orderBy('gme_orden')
            ->get(['gme_id', 'gme_nombre', 'gme_slug']);

        $allowedTypeByGroup = $this->buildAllowedTypeMap($grupoMenu, $tipoModulo);

        $siguienteOrdenPorTipo = Modulo::selectRaw('tmo_id, COALESCE(MAX(mod_orden), 0) + 1 as siguiente_orden')
            ->groupBy('tmo_id')
            ->pluck('siguiente_orden', 'tmo_id');
        $acciones = Accion::select('acc_id', 'acc_nombre', 'acc_icono')->get();

        return inertia('Admin/Modulos/Show', [
            'modulo' => $modulo,
            'permisos' => permisosPorSubmodulo(),
            'tipoModulo' => $tipoModulo,
            'grupoMenu' => $grupoMenu,
            'allowedTypeByGroup' => $allowedTypeByGroup,
            'acciones' => $acciones,
            'siguienteOrdenPorTipo' => $siguienteOrdenPorTipo,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Modulo $modulo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Modulo $modulo)
    {
        $ip = $request->ip();

        $validated = $request->validate([
            'mod_nombre' => 'required|string|max:255',
            'mod_slug'   => 'required|string|max:255|unique:modulos,mod_slug,' . $modulo->mod_id . ',mod_id',
            'mod_icono'  => 'nullable|string|max:255',
            'mod_orden'  => 'required|integer|min:1',
            'mod_activo' => 'required|boolean',
            'gme_id'     => 'required|exists:grupo_menu,gme_id',
            'tmo_id'     => 'required|exists:tipo_modulo,tmo_id',
            'acciones'   => 'array',
            'acciones.*' => 'integer|exists:acciones,acc_id',
        ]);

        $this->ensureTypeBelongsToGroup((int) $validated['gme_id'], (int) $validated['tmo_id']);

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
            $tmoOriginal   = $modulo->tmo_id;
            $nuevoOrden    = $validated['mod_orden'];
            $nuevoTmo      = $validated['tmo_id'];

            if ($tmoOriginal != $nuevoTmo) {

                Modulo::where('tmo_id', $tmoOriginal)
                    ->where('mod_orden', '>', $ordenOriginal)
                    ->decrement('mod_orden');

                $ultimoOrdenNuevo = Modulo::where('tmo_id', $nuevoTmo)->max('mod_orden') ?? 0;
                $nuevoOrden = min($nuevoOrden, $ultimoOrdenNuevo + 1);

                Modulo::where('tmo_id', $nuevoTmo)
                    ->where('mod_orden', '>=', $nuevoOrden)
                    ->increment('mod_orden');
            } elseif ($ordenOriginal != $nuevoOrden) {

                if ($nuevoOrden > $ordenOriginal) {
                    Modulo::where('tmo_id', $nuevoTmo)
                        ->whereBetween('mod_orden', [$ordenOriginal + 1, $nuevoOrden])
                        ->decrement('mod_orden');
                } else {
                    Modulo::where('tmo_id', $nuevoTmo)
                        ->whereBetween('mod_orden', [$nuevoOrden, $ordenOriginal - 1])
                        ->increment('mod_orden');
                }
            }
            $modulo->update([
                'mod_nombre'          => $validated['mod_nombre'],
                'mod_slug'            => $validated['mod_slug'],
                'mod_icono'           => $validated['mod_icono'],
                'mod_orden'           => $nuevoOrden,
                'mod_activo'          => $validated['mod_activo'],
                'gme_id'              => $validated['gme_id'],
                'tmo_id'              => $nuevoTmo,
                'mod_actualizado_por' => auth()->id(),
            ]);
            $accionesActuales = $modulo->moduloAcciones()->pluck('acc_id')->toArray();
            $nuevasAcciones   = $validated['acciones'] ?? [];

            $paraAgregar  = array_diff($nuevasAcciones, $accionesActuales);
            $paraEliminar = array_diff($accionesActuales, $nuevasAcciones);

            foreach ($paraAgregar as $acc_id) {
                ModuloAccion::create([
                    'mod_id' => $modulo->mod_id,
                    'acc_id' => $acc_id,
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
                'usu_id'           => auth()->id(),
                'aud_metodo'       => 'PATCH',
                'aud_accion'       => 'modulos.update',
                'aud_descripcion'  => 'Actualizó un módulo',
                'aud_id_afectado'  => $modulo->mod_id,
                'aud_datos'        => json_encode([
                    'before' => $antes,
                    'after'  => $despues,
                ]),
                'aud_ip'           => $ip,
            ]);
        });

        return redirect()->back()->with('success', 'Módulo actualizado correctamente.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Modulo $modulo)
    {
        $ip = request()->ip();
        $mac_ids = ModuloAccion::where('mod_id', $modulo->mod_id)
            ->pluck('mac_id')
            ->toArray();
        RolModuloAccion::whereIn('mac_id', $mac_ids)->delete();
        ModuloAccion::where('mod_id', $modulo->mod_id)->delete();
        $modulo->delete();
        Auditoria::create([
            'usu_id'           => auth()->id(),
            'aud_metodo'       => 'DELETE',
            'aud_accion'       => 'modulos.destroy',
            'aud_descripcion'  => 'Eliminó un módulo',
            'aud_id_afectado'  => $modulo->mod_id,
            'aud_datos'        => json_encode($modulo),
            'aud_ip'           => $ip,
        ]);

        return back()->with('success', 'Módulo eliminado.');
    }

    // cambiar el estado del modulo, ya sea activado o desactivado
    public function toggleActivo(Modulo $modulo)
    {
        $ip = request()->ip();
        $modulo->mod_activo = !$modulo->mod_activo;
        $modulo->save();
        Auditoria::create([
            'usu_id'           => auth()->id(),
            'aud_metodo'       => 'PATCH',
            'aud_accion'       => 'modulos.toggleActivo',
            'aud_descripcion'  => ($modulo->mod_activo ? 'Activó un modulo' : 'Desactivó un módulo'),
            'aud_id_afectado'  => $modulo->mod_id,
            'aud_datos'        => '{"mod_activo": ' . ($modulo->mod_activo ? 'true' : 'false') . '}',
            'aud_ip'           => $ip,
        ]);

        return redirect()->back()->with('success', 'El estado del módulo ha sido actualizado correctamente.');
    }

    // Mapa de tipos permitidos por grupo
    private function buildAllowedTypeMap($grupoMenu, $tipoModulo): array
    {
        $allTypeIds = $tipoModulo->pluck('tmo_id')->map(fn($id) => (int) $id)->values()->all();

        $typeIdsBySlug = $tipoModulo->keyBy('tmo_slug')->map(fn($t) => (int) $t->tmo_id);

        // Configuración de tipos permitidos por grupo
        $allowedTypeSlugsByGroup = [
            'general'   => ['administracion'],
            'operacion' => ['administracion'],
            'gestion'   => ['administracion'],
            'sistema'   => ['sistema'],
        ];

        $result = [];
        foreach ($grupoMenu as $grupo) {
            $slugs = $allowedTypeSlugsByGroup[$grupo->gme_slug] ?? [];
            $ids = collect($slugs)
                ->map(fn($slug) => $typeIdsBySlug[$slug] ?? null)
                ->filter()
                ->values()
                ->all();

            $result[(string) $grupo->gme_id] = !empty($ids) ? $ids : $allTypeIds;
        }

        return $result;
    }

    // Valida que el tipo pertenece al grupo seleccionado
    private function ensureTypeBelongsToGroup(int $gmeId, int $tmoId): void
    {
        $grupoMenu = GrupoMenu::where('gme_activo', true)->get(['gme_id', 'gme_slug']);
        $tipoModulo = TipoModulo::select('tmo_id', 'tmo_slug')->get();
        $allowed = $this->buildAllowedTypeMap($grupoMenu, $tipoModulo);

        $allowedIds = $allowed[(string) $gmeId] ?? [];
        if (!in_array($tmoId, $allowedIds, true)) {
            throw ValidationException::withMessages([
                'tmo_id' => 'El tipo de módulo seleccionado no pertenece al grupo indicado.',
            ]);
        }
    }

    // Codifica datos para auditoría
    private function encodeAuditPayload(mixed $payload): string
    {
        $json = json_encode(
            $payload,
            JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE
        );

        return $json === false ? '{}' : $json;
    }
}
