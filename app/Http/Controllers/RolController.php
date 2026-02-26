<?php

namespace App\Http\Controllers;

use App\Models\Auditoria;
use App\Models\Rol;
use App\Models\Modulo;
use App\Models\RolModuloAccion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Admin/Roles/Index', [
            'roles' => Rol::with('permisos:rol_id,mac_id')
                ->select('rol_id', 'rol_nombre', 'rol_descripcion', 'rol_activo', 'area_id')
                ->get(),
            'modulos' => Modulo::with('moduloAcciones', 'moduloAcciones.accion')->get(),
            'permisosPorRol' => RolModuloAccion::select('rol_id', 'mac_id')->get(),
            'permisos' => permisosPorSubmodulo(),
            'areas' => \App\Models\Area::all(),
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
        $ip = request()->ip();
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

        if (!empty($data['acciones'])) {

            foreach ($data['acciones'] as $mac_id) {
                RolModuloAccion::create([
                    'rol_id' => $rol->rol_id,
                    'mac_id' => $mac_id,
                ]);
            }
        }
        Auditoria::create([
            'usu_id'           => auth()->id(),
            'aud_metodo'       => 'POST',
            'aud_accion'       => 'rol.store',
            'aud_descripcion'  => 'Se creó un nuevo rol',
            'aud_id_afectado'  => $rol->rol_id,
            'aud_datos'        => json_encode($data),
            'aud_ip'           => $ip,
        ]);

        return redirect()->back()->with('success', 'Rol creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Rol $rol)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rol $rol)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rol $rol)
    {
        $ip = request()->ip();
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

        if (!empty($data['acciones'])) {
            foreach ($data['acciones'] as $mac_id) {
                RolModuloAccion::create([
                    'rol_id' => $rol->rol_id,
                    'mac_id' => $mac_id,
                ]);
            }
        }
        Auditoria::create([
            'usu_id'           => auth()->id(),
            'aud_metodo'       => 'PATCH',
            'aud_accion'       => 'rol.update',
            'aud_descripcion'  => 'Actualizó un rol',
            'aud_id_afectado'  => $rol->rol_id,
            'aud_datos'        => json_encode($data),
            'aud_ip'           => $ip,
        ]);

        return back()->with('success', 'Rol actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rol $rol)
    {
        //
    }

    // Activar o desactivar rol
    public function toggleStatus(Rol $rol)
    {
        $ip = request()->ip();
        $rol->rol_activo = !$rol->rol_activo;
        $rol->save();
        Auditoria::create([
            'usu_id'           => auth()->id(),
            'aud_metodo'       => 'PATCH',
            'aud_accion'       => 'rol.toggleStatus',
            'aud_descripcion'  => ($rol->rol_activo ? 'Activó un rol' : 'Desactivó un rol'),
            'aud_id_afectado'  => $rol->rol_id,
            'aud_datos'        => json_encode(['rol_activo' => $rol->rol_activo]),
            'aud_ip'           => $ip,
        ]);
        return back()->with('success', 'Estado del rol actualizado correctamente.');
    }
    
}
