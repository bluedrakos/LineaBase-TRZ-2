<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Responses\ApiResponse;
use App\Models\Auditoria;
use Illuminate\Http\Request;

class AuditoriasApiController extends ApiController
{

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        $query = Auditoria::with('usuario')->orderBy('created_at', 'desc');

        if ($request->filled('accion')) {
            $query->where('aud_accion', 'like', '%' . $request->string('accion') . '%');
        }
        if ($request->filled('metodo')) {
            $query->where('aud_metodo', $request->string('metodo'));
        }
        if ($request->filled('usu_id')) {
            $query->where('usu_id', $request->integer('usu_id'));
        }

        $auditorias = $query->paginate($perPage);

        return $this->ok($auditorias->items(), meta: [
            'current_page' => $auditorias->currentPage(),
            'per_page' => $auditorias->perPage(),
            'total' => $auditorias->total(),
            'last_page' => $auditorias->lastPage(),
        ]);
    }
}
