<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SoapAgendaService;

class SoapController extends Controller
{
    private $soapService;

    public function __construct(SoapAgendaService $soapService)
    {
        $this->soapService = $soapService;
    }

    public function buscarUsuario(Request $request)
    {
        $rut = $request->input('rut', '');
        $nombre = $request->input('nombre', '');
        $limit = $request->input('limit', 1);

        if (empty($rut) && empty($nombre)) {
            return response()->json(['error' => 'Debe proporcionar RUT o Nombre'], 400);
        }

        try {
            // El servicio espera que uno de los dos no sea vacío.
            // Si buscamos por PUT, enviamos nombre vacío.
            // Si buscamos por nombre, enviamos RUT vacío.

            // Adaptación de los parámetros para el servicio SOAP
            // AgendaEntregaPersonaLimit(nombre, rut, limit)
            $resultado = $this->soapService->wsRecuperarUsuarioAgenda(
                $nombre,
                $rut,
                $limit,
                ($limit > 1) ? 1 : 0 // Retorno 0 si es 1, 1 si son varios
            );

            if ($resultado) {
                // Normalizar la respuesta si es necesario, o devolverla tal cual
                return response()->json($resultado);
            } else {
                return response()->json(['message' => 'No se encontraron resultados'], 404);
            }

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al consultar servicio SOAP: ' . $e->getMessage()], 500);
        }
    }
}
