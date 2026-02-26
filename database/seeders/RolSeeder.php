<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rol;

class RolSeeder extends Seeder
{
    public function run(): void
    {
        Rol::create([
            'rol_nombre' => 'Administrador',
            'rol_descripcion' => 'Rol con acceso total al sistema',
            'rol_activo' => true,
        ]);
    }
}
