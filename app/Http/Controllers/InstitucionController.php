<?php

namespace App\Http\Controllers;

use App\Models\Auditoria;
use App\Models\Institucion;
use Illuminate\Http\Request;

class InstitucionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $instituciones = Institucion::orderBy('ins_nombre')->get();

        return inertia('Admin/Instituciones/Index', [
            'instituciones' => $instituciones,
            'permisos' => permisosPorSubmodulo(),
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

        $data = $request->validate([
            'ins_nombre'      => 'required|string|max:100',
            'ins_rut'         => 'required|string|max:100|unique:instituciones,ins_rut',
            'ins_sigla'       => 'required|string|max:20',
            'ins_direccion'   => 'nullable|string|max:200',
            'ins_telefono'    => 'nullable|string|max:20',
            'ins_correo'      => 'nullable|email|max:100',
            'ins_descripcion' => 'nullable|string|max:200',
        ]);

        $institucion = Institucion::create([
            ...$data,
            'ins_instancia' => now(),
        ]);

        Auditoria::create([
            'usu_id'          => auth()->id(),
            'aud_metodo'      => 'POST',
            'aud_accion'      => 'instituciones.store',
            'aud_descripcion' => 'Creó una institución',
            'aud_id_afectado' => $institucion->ins_id,
            'aud_datos'       => json_encode($institucion->only([
                'ins_nombre',
                'ins_rut',
                'ins_sigla',
            ])),
            'aud_ip'          => $ip,
        ]);

        return redirect()->back()->with('success', 'Institución creada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Institucion $institucion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Institucion $institucion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Institucion $institucion)
    {
        $ip = $request->ip();

        $data = $request->validate([
            'ins_nombre'      => 'required|string|max:100',
            'ins_rut'         => 'required|string|max:100|unique:instituciones,ins_rut,' . $institucion->ins_id . ',ins_id',
            'ins_sigla'       => 'required|string|max:20',
            'ins_direccion'   => 'nullable|string|max:200',
            'ins_telefono'    => 'nullable|string|max:20',
            'ins_correo'      => 'nullable|email|max:100',
            'ins_descripcion' => 'nullable|string|max:200',
        ]);

        $antes = $institucion->only([
            'ins_nombre',
            'ins_rut',
            'ins_sigla',
            'ins_direccion',
            'ins_telefono',
            'ins_correo',
            'ins_descripcion',
        ]);

        $institucion->update($data);

        $despues = $institucion->only(array_keys($antes));

        Auditoria::create([
            'usu_id'          => auth()->id(),
            'aud_metodo'      => 'PATCH',
            'aud_accion'      => 'instituciones.update',
            'aud_descripcion' => 'Actualizó una institución',
            'aud_id_afectado' => $institucion->ins_id,
            'aud_datos'       => json_encode([
                'before' => $antes,
                'after'  => $despues,
            ]),
            'aud_ip'          => $ip,
        ]);

        return redirect()->back()->with('success', 'Institución actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Institucion $institucion)
    {
        //
    }
}
