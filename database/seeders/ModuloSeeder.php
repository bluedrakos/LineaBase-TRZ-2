<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modulo;

class ModuloSeeder extends Seeder
{
    public function run(): void
    {
        // DB::table('modulos')->truncate(); // if needed, handled by refresh

        Modulo::create([
            'mod_nombre' => 'Panel',
            'mod_slug' => 'panel',
            'mod_icono' => 'LayoutGrid',
            'mod_orden' => 1,
            'mod_activo' => true,
            'tmo_id' => null,
            'mod_directorio' => 'frontend/src/core/panel',
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Gestión de usuarios',
            'mod_slug' => 'gestion-usuarios',
            'mod_icono' => 'Users',
            'mod_orden' => 2,
            'mod_activo' => true,
            'tmo_id' => 1,
            'mod_directorio' => 'frontend/src/core/usuarios',
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Gestión de permisos',
            'mod_slug' => 'gestion-de-permisos',
            'mod_icono' => 'ShieldCheck',
            'mod_orden' => 3,
            'mod_activo' => true,
            'tmo_id' => 1,
            'mod_directorio' => 'frontend/src/core/roles',
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Instituciones',
            'mod_slug' => 'instituciones',
            'mod_icono' => 'Building2',
            'mod_orden' => 4,
            'mod_activo' => true,
            'tmo_id' => 2,
            'mod_directorio' => 'frontend/src/core/instituciones',
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Auditorias',
            'mod_slug' => 'auditorias',
            'mod_icono' => 'ClipboardList',
            'mod_orden' => 5,
            'mod_activo' => true,
            'tmo_id' => null,
            'mod_directorio' => 'frontend/src/core/auditorias',
            'mod_creado_por' => 1,
        ]);
        Modulo::create([
            'mod_nombre' => 'Gestión de módulos',
            'mod_slug' => 'gestion-modulos',
            'mod_icono' => 'LayoutGrid',
            'mod_orden' => 6,
            'mod_activo' => true,
            'tmo_id' => null,
            'mod_directorio' => 'frontend/src/core/modulos',
            'mod_creado_por' => 1,
        ]);
    }
}
