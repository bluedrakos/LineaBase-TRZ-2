<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rol;
use App\Models\Modulo;
use App\Models\ModuloAccion;
use App\Models\RolModuloAccion;

class PermisosSeeder extends Seeder
{
    public function run(): void
    {
        $rol = Rol::where('rol_nombre', 'Administrador')->first();

        if (!$rol) {
            $this->command->warn('❌ Rol Administrador no encontrado.');
            return;
        }

        $modulos = Modulo::all();

        if ($modulos->isEmpty()) {
            $this->command->warn('❌ No se encontraron los módulos especificados.');
            return;
        }

        foreach ($modulos as $modulo) {

            $moduloAcciones = ModuloAccion::where('mod_id', $modulo->mod_id)->get();

            foreach ($moduloAcciones as $mac) {
                RolModuloAccion::firstOrCreate([
                    'rol_id' => $rol->rol_id,
                    'mac_id' => $mac->mac_id,
                ]);
            }

            $this->command->info("✅ Permisos asignados para: {$modulo->mod_slug}");
        }

        $this->command->info('✅ El Rol Administrador quedó con acceso total a TODOS los módulos.');
    }
}
