<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Responses\ApiResponse;
use App\Models\Area;
use App\Models\Auditoria;
use App\Models\Modulo;
use App\Models\Rol;
use App\Models\RolModuloAccion;
use Illuminate\Http\Request;

class RolesApiController extends ApiController
{

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        $roles = Rol::with('permisos:rol_id,mac_id')
            ->select('rol_id', 'rol_nombre', 'rol_descripcion', 'rol_activo', 'area_id')
            ->orderBy('rol_nombre')
            ->paginate($perPage);

        return $this->ok($roles->items(), meta: [
            'current_page' => $roles->currentPage(),
            'per_page' => $roles->perPage(),
            'total' => $roles->total(),
            'last_page' => $roles->lastPage(),
        ]);
    }

    public function meta()
    {
        return $this->ok([
            'modulos' => Modulo::with('moduloAcciones', 'moduloAcciones.accion')->get(),
            'permisos_por_rol' => RolModuloAccion::select('rol_id', 'mac_id')->get(),
            'areas' => Area::all(),
        ]);
    }

    public function store(Request $request)
    {
        $ip = $request->ip();
        $data = $request->validate([
            'rol_nombre' => 'required|string|max:255',
            'rol_descripcion' => 'nullable|string|max:500',
            'rol_activo' => 'boolean',
            'area_id' => 'nullable|integer|exists:areas,area_id',
            'acciones' => 'array',
            'acciones.*' => 'integer|exists:modulo_acciones,mac_id',
        ]);

        $rol = Rol::create([
            'rol_nombre' => $data['rol_nombre'],
            'rol_descripcion' => $data['rol_descripcion'] ?? null,
            'rol_activo' => $data['rol_activo'] ?? true,
            'area_id' => $data['area_id'] ?? null,
        ]);

        foreach ($data['acciones'] ?? [] as $macId) {
            RolModuloAccion::create([
                'rol_id' => $rol->rol_id,
                'mac_id' => $macId,
            ]);
        }

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'POST',
            'aud_accion' => 'rol.store',
            'aud_descripcion' => 'Se creo un nuevo rol',
            'aud_id_afectado' => $rol->rol_id,
            'aud_datos' => json_encode($data, JSON_UNESCAPED_UNICODE),
            'aud_ip' => $ip,
        ]);

        return $this->ok($rol->load('permisos'), 'Rol creado correctamente.', 201);
    }

    public function update(Request $request, Rol $rol)
    {
        $ip = $request->ip();
        $data = $request->validate([
            'rol_nombre' => 'required|string|max:255',
            'rol_descripcion' => 'nullable|string|max:500',
            'rol_activo' => 'boolean',
            'area_id' => 'nullable|integer|exists:areas,area_id',
            'acciones' => 'array',
            'acciones.*' => 'integer|exists:modulo_acciones,mac_id',
        ]);

        $rol->update([
            'rol_nombre' => $data['rol_nombre'],
            'rol_descripcion' => $data['rol_descripcion'] ?? null,
            'rol_activo' => $data['rol_activo'] ?? true,
            'area_id' => $data['area_id'] ?? null,
        ]);

        RolModuloAccion::where('rol_id', $rol->rol_id)->delete();
        foreach ($data['acciones'] ?? [] as $macId) {
            RolModuloAccion::create([
                'rol_id' => $rol->rol_id,
                'mac_id' => $macId,
            ]);
        }

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'PATCH',
            'aud_accion' => 'rol.update',
            'aud_descripcion' => 'Actualizo un rol',
            'aud_id_afectado' => $rol->rol_id,
            'aud_datos' => json_encode($data, JSON_UNESCAPED_UNICODE),
            'aud_ip' => $ip,
        ]);

        return $this->ok($rol->load('permisos'), 'Rol actualizado correctamente.');
    }

    public function toggleStatus(Rol $rol, Request $request)
    {
        $rol->rol_activo = !$rol->rol_activo;
        $rol->save();

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'PATCH',
            'aud_accion' => 'rol.toggleStatus',
            'aud_descripcion' => ($rol->rol_activo ? 'Activo un rol' : 'Desactivo un rol'),
            'aud_id_afectado' => $rol->rol_id,
            'aud_datos' => json_encode(['rol_activo' => $rol->rol_activo], JSON_UNESCAPED_UNICODE),
            'aud_ip' => $request->ip(),
        ]);

        return $this->ok($rol, 'Estado del rol actualizado correctamente.');
    }
}
