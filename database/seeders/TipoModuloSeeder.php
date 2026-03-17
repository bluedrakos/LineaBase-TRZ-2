<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TipoModulo;  

class TipoModuloSeeder extends Seeder
{
    public function run(): void
    {
        TipoModulo::create([
            'tmo_nombre' => 'Administración',
            'tmo_slug' => 'administracion',
            'tmo_icono' => 'Settings',
            'tmo_orden' => 1,
            'tmo_activo' => true,
            'tmo_creado_por' => 1,
        ]);
        TipoModulo::create([
            'tmo_nombre' => 'Sistema',
            'tmo_slug' => 'sistema',
            'tmo_icono' => 'Settings',
            'tmo_orden' => 2,
            'tmo_activo' => true,
            'tmo_creado_por' => 1,
        ]);
        TipoModulo::create([
            'tmo_nombre' => 'Desarrollo',
            'tmo_slug' => 'desarrollo',
            'tmo_icono' => 'Code',
            'tmo_orden' => 10,
            'tmo_activo' => true,
            'tmo_creado_por' => 1,
        ]);
    }
}
