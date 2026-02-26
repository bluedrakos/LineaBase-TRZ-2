<?php

namespace Database\Seeders;

use App\Models\Usuario;
use App\Models\Rol;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cargar primero roles
        $this->call([RolSeeder::class]);

        // 1.0 Cargar areas
        $this->call([AreaSeeder::class]);


        // 1.1. Sembrar instituciones básicas
        $this->call([\Database\Seeders\InstitucionSeeder::class]);

        // 2. Buscar el rol administrador
        $rol = Rol::where('rol_nombre', 'Administrador')->first();

        if (!$rol) {
            $this->command->warn('❌ No se encontró el rol Administrador.');
            return;
        }

        // 3. Crear o recuperar el usuario creador (usu_id = 1)
        $usuario = Usuario::firstOrCreate(
            ['usu_rut' => '111111111'],
            [
                'usu_tipo'      => 'Externo',
                'usu_password'  => Hash::make('admin123'),
                'usu_nombre'    => 'Mitra',
                'usu_apellidos' => 'Sistemas',
                'usu_cargo'     => 'Administrador',
                'usu_correo'    => 'mitra-sistemas@casamoneda.cl',
                'usu_estado'    => 'Habilitado',
                'usu_terminos'  => 'Si',
                'usu_activo'    => true,
                'usu_instancia' => now(),
                'rol_id'        => $rol->rol_id,
                'usu_cambiar_password' => false,
            ]
        );

        // 4. Resto de seeders que requieren mod_creado_por = 1
        $this->call([
            TipoModuloSeeder::class,
            ModuloSeeder::class,
            GrupoMenuSeeder::class,
            AccionSeeder::class,
            ModuloAccionSeeder::class,
            PermisosSeeder::class,
            SistemaSeeder::class,
            InstitucionSeeder::class,
        ]);
    }
}
