<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GrupoMenu;
use Illuminate\Support\Facades\DB;

class GrupoMenuSeeder extends Seeder
{
    public function run(): void
    {
        $grupos = [
            ['slug' => 'dashboards', 'nombre' => 'Dashboards', 'orden' => 1],
            ['slug' => 'general', 'nombre' => 'General', 'orden' => 2],
            ['slug' => 'administracion', 'nombre' => 'Administración', 'orden' => 3],
            ['slug' => 'sistema', 'nombre' => 'Sistema', 'orden' => 4],
            ['slug' => 'desarrollo', 'nombre' => 'Desarrollo', 'orden' => 5],
        ];

        foreach ($grupos as $g) {
            GrupoMenu::updateOrCreate(
                ['gme_slug' => $g['slug']],
                [
                    'gme_nombre' => $g['nombre'],
                    'gme_orden'  => $g['orden'],
                    'gme_activo' => true,
                ]
            );
        }

        // Asignar módulos existentes a sus grupos
        $gruposIds = DB::table('grupo_menu')->pluck('gme_id', 'gme_slug');

        DB::table('modulos')->whereIn('mod_slug', ['panel'])->update(['gme_id' => $gruposIds['dashboards'] ?? null]);
        DB::table('modulos')->whereIn('mod_slug', ['gestion-usuarios', 'gestion-de-permisos', 'instituciones'])->update(['gme_id' => $gruposIds['administracion'] ?? null]);
        DB::table('modulos')->whereIn('mod_slug', ['auditorias'])->update(['gme_id' => $gruposIds['sistema'] ?? null]);
        DB::table('modulos')->whereIn('mod_slug', ['gestion-modulos'])->update(['gme_id' => $gruposIds['desarrollo'] ?? null]);
    }
}
