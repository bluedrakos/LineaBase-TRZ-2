<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modulo;
use App\Models\Accion;
use App\Models\ModuloAccion;

class ModuloAccionSeeder extends Seeder
{
    public function run(): void
    {
        $modulosSlugs = [
            'panel',
            'gestion-usuarios',
            'gestion-modulos',
            'gestion-de-permisos',
            'auditorias',
            'instituciones'
        ];
        $acciones = Accion::whereIn('acc_slug', ['ver', 'crear', 'editar', 'eliminar', 'exportar', 'listar'])->get();
        if ($acciones->isEmpty()) {
            $this->command->warn('❌ No se encontraron acciones. Ejecuta primero el AccionSeeder.');
            return;
        }
        foreach ($modulosSlugs as $slug) {
            $modulo = Modulo::where('mod_slug', $slug)->first();

            if ($modulo) {
                foreach ($acciones as $accion) {
                    ModuloAccion::firstOrCreate([
                        'mod_id' => $modulo->mod_id,
                        'acc_id' => $accion->acc_id,
                    ]);
                }
                $this->command->info("✅ Acciones asignadas al módulo: $slug");
            } else {
                $this->command->warn("⚠️ El módulo '$slug' no existe. Saltando...");
            }
        }
    }
}
