<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Models\Sistema;
use Illuminate\Http\Request;

class SistemasApiController extends ApiController
{
    /**
     * Muestra una lista de los sistemas.
     */
    public function index()
    {
        $sistemas = Sistema::orderBy('sis_nombre', 'asc')->get();
        return $this->ok(['sistemas' => $sistemas], 'Datos de sistemas obtenidos exitosamente.');
    }

    /**
     * Almacena un sistema recién creado en la base de datos.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'sis_tipo' => 'required|in:Publico,Privado',
            'sis_nombre' => 'required|string|max:100',
            'sis_descripcion' => 'nullable|string|max:255',
            'sis_valor' => 'required|string|max:255',
        ]);

        $sistema = Sistema::create($validatedData);

        return $this->ok(['sistema' => $sistema], 'Sistema creado exitosamente.', 201);
    }

    /**
     * Muestra el sistema especificado.
     */
    public function show(string $id)
    {
        $sistema = Sistema::find($id);

        if (!$sistema) {
            return $this->fail('Sistema no encontrado.', 404);
        }

        return $this->ok(['sistema' => $sistema], 'Detalle de sistema obtenido.');
    }

    /**
     * Actualiza el sistema especificado en la base de datos.
     */
    public function update(Request $request, string $id)
    {
        $sistema = Sistema::find($id);

        if (!$sistema) {
            return $this->fail('Sistema no encontrado.', 404);
        }

        $validatedData = $request->validate([
            'sis_tipo' => 'required|in:Publico,Privado',
            'sis_nombre' => 'required|string|max:100',
            'sis_descripcion' => 'nullable|string|max:255',
            'sis_valor' => 'required|string|max:255',
        ]);

        $sistema->update($validatedData);

        return $this->ok(['sistema' => $sistema], 'Sistema actualizado exitosamente.');
    }

    /**
     * Elimina el sistema especificado de la base de datos.
     */
    public function destroy(string $id)
    {
        $sistema = Sistema::find($id);

        if (!$sistema) {
            return $this->fail('Sistema no encontrado.', 404);
        }

        $sistema->delete();

        return $this->ok(null, 'Sistema eliminado exitosamente.');
    }
}
