<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modulo;

class ModuloSeeder extends Seeder
{
    public function run(): void
    {
        Modulo::create([
            'mod_nombre' => 'Gestión de usuarios',
            'mod_slug' => 'gestion-usuarios',
            'mod_icono' => 'Users',
            'mod_orden' => 1,
            'mod_activo' => true,
            'tmo_id' => 1,
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Gestión de Módulos',
            'mod_slug' => 'gestion-modulos',
            'mod_icono' => 'LayoutGrid',
            'mod_orden' => 2,
            'mod_activo' => true,
            'tmo_id' => 1,
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Gestión de permisos',
            'mod_slug' => 'gestion-de-permisos',
            'mod_icono' => 'ShieldCheck',
            'mod_orden' => 3,
            'mod_activo' => true,
            'tmo_id' => 1,
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Auditorias',
            'mod_slug' => 'auditorias',
            'mod_icono' => 'ClipboardList',
            'mod_orden' => 1,
            'mod_activo' => true,
            'tmo_id' => 2,
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Insituciones',
            'mod_slug' => 'instituciones',
            'mod_icono' => 'Building2',
            'mod_orden' => 5,
            'mod_activo' => true,
            'tmo_id' => 2,
            'mod_creado_por' => 1,
        ]);
    }
}
