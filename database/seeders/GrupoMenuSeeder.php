<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GrupoMenu;
use Illuminate\Support\Facades\DB;

class GrupoMenuSeeder extends Seeder
{
    public function run(): void
    {
        // Crear los grupos del sidebar
        GrupoMenu::updateOrCreate(
            ['gme_slug' => 'general'],
            [
                'gme_nombre' => 'GENERAL',
                'gme_orden'  => 1,
                'gme_activo' => true,
            ]
        );

        GrupoMenu::updateOrCreate(
            ['gme_slug' => 'administracion'],
            [
                'gme_nombre' => 'ADMINISTRACIÓN',
                'gme_orden'  => 2,
                'gme_activo' => true,
            ]
        );

        GrupoMenu::updateOrCreate(
            ['gme_slug' => 'sistema'],
            [
                'gme_nombre' => 'SISTEMA',
                'gme_orden'  => 3,
                'gme_activo' => true,
            ]
        );

        // Asignar módulos existentes a sus grupos
        $grupos = DB::table('grupo_menu')->pluck('gme_id', 'gme_slug');

        // Módulos de administración (Usuarios, Permisos, Instituciones)
        DB::table('modulos')->whereIn('mod_slug', [
            'gestion-usuarios',
            'gestion-de-permisos',
            'instituciones',
        ])->update(['gme_id' => $grupos['administracion'] ?? null]);

        // Módulos de sistema (Módulos, Auditorías)
        DB::table('modulos')->whereIn('mod_slug', [
            'gestion-modulos',
            'auditorias',
        ])->update(['gme_id' => $grupos['sistema'] ?? null]);
    }
}
