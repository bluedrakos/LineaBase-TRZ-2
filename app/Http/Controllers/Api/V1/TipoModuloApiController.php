<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Models\TipoModulo;
use App\Models\Auditoria;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TipoModuloApiController extends ApiController
{
    public function store(Request $request)
    {
        $request->validate([
            'tmo_nombre' => 'required|string|max:100',
            'tmo_icono'  => 'nullable|string|max:50',
        ]);

        $slug = Str::slug($request->tmo_nombre);

        // Validar que el slug no exista
        if (TipoModulo::where('tmo_slug', $slug)->exists()) {
            return $this->fail('Ya existe un tipo de módulo con un nombre similar.', 422);
        }

        $ultimoOrden = TipoModulo::max('tmo_orden') ?? 0;

        $tipoModulo = TipoModulo::create([
            'tmo_nombre'    => $request->tmo_nombre,
            'tmo_slug'      => $slug,
            'tmo_icono'     => $request->tmo_icono ?? 'Settings',
            'tmo_orden'     => $ultimoOrden + 1,
            'tmo_activo'    => true,
            'tmo_creado_por'=> auth()->id(),
        ]);

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'POST',
            'aud_accion' => 'tipo-modulo.store',
            'aud_descripcion' => 'Creó un tipo de módulo',
            'aud_id_afectado' => $tipoModulo->tmo_id,
            'aud_datos' => json_encode($tipoModulo->toArray(), JSON_UNESCAPED_UNICODE),
            'aud_ip' => request()->ip(),
        ]);

        return $this->ok($tipoModulo, 'Tipo de módulo creado exitosamente.', 201);
    }

    public function update(Request $request, TipoModulo $tipoModulo)
    {
        $request->validate([
            'tmo_nombre' => 'required|string|max:100',
            'tmo_icono'  => 'nullable|string|max:50',
        ]);

        $slug = Str::slug($request->tmo_nombre);

        if (TipoModulo::where('tmo_slug', $slug)->where('tmo_id', '!=', $tipoModulo->tmo_id)->exists()) {
            return $this->fail('Ya existe otro tipo de módulo con un nombre similar.', 422);
        }

        $tipoModulo->update([
            'tmo_nombre' => $request->tmo_nombre,
            'tmo_slug'   => $slug,
            'tmo_icono'  => $request->tmo_icono ?? 'Settings',
        ]);

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'PUT',
            'aud_accion' => 'tipo-modulo.update',
            'aud_descripcion' => 'Actualizó un tipo de módulo',
            'aud_id_afectado' => $tipoModulo->tmo_id,
            'aud_datos' => json_encode($tipoModulo->getChanges(), JSON_UNESCAPED_UNICODE),
            'aud_ip' => request()->ip(),
        ]);

        return $this->ok($tipoModulo, 'Tipo de módulo actualizado exitosamente.');
    }
}
