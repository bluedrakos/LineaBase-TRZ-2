<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\Sistema;
use Illuminate\Support\Facades\Cache;

class ConfigController extends ApiController
{
    /**
     * Obtiene la configuración de branding del sistema (público).
     */
    public function getBranding()
    {
        $nombre = Sistema::where('sis_nombre', 'Nombre de la aplicación')->value('sis_valor');
        $descripcion = Sistema::where('sis_nombre', 'Descripción de la aplicación')->value('sis_valor');
        $version = Sistema::where('sis_nombre', 'Versión de la aplicación')
            ->orWhere('sis_id', 3)
            ->value('sis_valor');

        $config = [
            'nombreSistema'      => $nombre ?? 'Línea Base TRZ',
            'descripcionSistema' => $descripcion ?? 'Trazabilidad',
            'versionSistema'     => $version ?? '0.0.0',
        ];

        return $this->ok($config);
    }
}
