<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modulo;

class ModuloSeeder extends Seeder
{
    public function run(): void
    {
        Modulo::create([
            'mod_nombre' => 'Panel',
            'mod_slug' => 'panel',
            'mod_icono' => 'LayoutGrid',
            'mod_orden' => 1,
            'mod_activo' => true,
            'tmo_id' => null,
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Gestión de usuarios',
            'mod_slug' => 'gestion-usuarios',
            'mod_icono' => 'Users',
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
            'mod_nombre' => 'Instituciones',
            'mod_slug' => 'instituciones',
            'mod_icono' => 'Building2',
            'mod_orden' => 4,
            'mod_activo' => true,
            'tmo_id' => 2,
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Auditorias',
            'mod_slug' => 'auditorias',
            'mod_icono' => 'ClipboardList',
            'mod_orden' => 5,
            'mod_activo' => true,
            'tmo_id' => null,
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Gestión de módulos',
            'mod_slug' => 'gestion-modulos',
            'mod_icono' => 'LayoutGrid',
            'mod_orden' => 6,
            'mod_activo' => true,
            'tmo_id' => null,
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Sistemas',
            'mod_slug' => 'sistemas',
            'mod_icono' => 'Pcpu',
            'mod_orden' => 7,
            'mod_activo' => true,
            'tmo_id' => 3, // ID de Desarrollo
            'mod_creado_por' => 1,
        ]);
    }
}
