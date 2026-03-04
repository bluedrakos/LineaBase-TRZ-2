<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Responses\ApiResponse;
use App\Models\Auditoria;
use App\Models\Institucion;
use Illuminate\Http\Request;

class InstitucionesApiController extends ApiController
{

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);
        $instituciones = Institucion::orderBy('ins_nombre')->paginate($perPage);

        return $this->ok($instituciones->items(), meta: [
            'current_page' => $instituciones->currentPage(),
            'per_page' => $instituciones->perPage(),
            'total' => $instituciones->total(),
            'last_page' => $instituciones->lastPage(),
        ]);
    }

    public function store(Request $request)
    {
        $ip = $request->ip();

        $data = $request->validate([
            'ins_nombre' => 'required|string|max:100',
            'ins_rut' => 'required|string|max:100|unique:instituciones,ins_rut',
            'ins_sigla' => 'required|string|max:20',
            'ins_direccion' => 'nullable|string|max:200',
            'ins_telefono' => 'nullable|string|max:20',
            'ins_correo' => 'nullable|email|max:100',
            'ins_descripcion' => 'nullable|string|max:200',
        ]);

        $institucion = Institucion::create([
            ...$data,
            'ins_instancia' => now(),
        ]);

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'POST',
            'aud_accion' => 'instituciones.store',
            'aud_descripcion' => 'Creo una institucion',
            'aud_id_afectado' => $institucion->ins_id,
            'aud_datos' => json_encode($institucion->only([
                'ins_nombre',
                'ins_rut',
                'ins_sigla',
            ]), JSON_UNESCAPED_UNICODE),
            'aud_ip' => $ip,
        ]);

        return $this->ok($institucion, 'Institucion creada correctamente.', 201);
    }

    public function update(Request $request, Institucion $institucion)
    {
        $ip = $request->ip();

        $data = $request->validate([
            'ins_nombre' => 'required|string|max:100',
            'ins_rut' => 'required|string|max:100|unique:instituciones,ins_rut,' . $institucion->ins_id . ',ins_id',
            'ins_sigla' => 'required|string|max:20',
            'ins_direccion' => 'nullable|string|max:200',
            'ins_telefono' => 'nullable|string|max:20',
            'ins_correo' => 'nullable|email|max:100',
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
            'usu_id' => auth()->id(),
            'aud_metodo' => 'PATCH',
            'aud_accion' => 'instituciones.update',
            'aud_descripcion' => 'Actualizo una institucion',
            'aud_id_afectado' => $institucion->ins_id,
            'aud_datos' => json_encode([
                'before' => $antes,
                'after' => $despues,
            ], JSON_UNESCAPED_UNICODE),
            'aud_ip' => $ip,
        ]);

        return $this->ok($institucion, 'Institucion actualizada correctamente.');
    }
}
