<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sistema;

class SistemaSeeder extends Seeder
{
    public function run(): void
    {
        Sistema::create([
            'sis_instancia'   => now(),
            'sis_tipo'        => 'Publico',
            'sis_nombre'      => 'Nombre de la aplicación',
            'sis_descripcion' => 'Es el nombre de la aplicación',
            'sis_valor'       => 'Línea Base',
        ]);

        Sistema::create([
            'sis_instancia'   => now(),
            'sis_tipo'        => 'Publico',
            'sis_nombre'      => 'Descripción de la aplicación',
            'sis_descripcion' => 'Es la descripción de la aplicación',
            'sis_valor'       => 'Trazabilidad',
        ]);

        Sistema::create([
            'sis_instancia'   => now(),
            'sis_tipo'        => 'Publico',
            'sis_nombre'      => 'Versión de la aplicación',
            'sis_descripcion' => 'Es la versión de la aplicación',
            'sis_valor'       => '1.0.0',
        ]);
    }
}