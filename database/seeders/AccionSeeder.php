<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Accion;

class AccionSeeder extends Seeder
{
    public function run(): void
    {
        $acciones = [
            ['acc_nombre' => 'Ver',     'acc_slug' => 'ver',     'acc_icono' => 'Eye'],
            ['acc_nombre' => 'Crear',   'acc_slug' => 'crear',   'acc_icono' => 'Plus'],
            ['acc_nombre' => 'Editar',  'acc_slug' => 'editar',  'acc_icono' => 'Edit'],
            ['acc_nombre' => 'Eliminar','acc_slug' => 'eliminar','acc_icono' => 'Trash'],
            ['acc_nombre' => 'Exportar','acc_slug' => 'exportar','acc_icono' => 'Download'],
            ['acc_nombre' => 'Listar',  'acc_slug' => 'listar',  'acc_icono' => 'List'],
            ['acc_nombre' => 'Imprimir','acc_slug' => 'imprimir','acc_icono' => 'Print'],
            ['acc_nombre' => 'Activar', 'acc_slug' => 'activar', 'acc_icono' => 'Check'],
            ['acc_nombre' => 'Desactivar', 'acc_slug' => 'desactivar', 'acc_icono' => 'Times'],
            ['acc_nombre' => 'Duplicar', 'acc_slug' => 'duplicar', 'acc_icono' => 'Copy'],
        ];

        foreach ($acciones as $accion) {
            Accion::create([
                ...$accion,
                'acc_creado_por' => 1,
            ]);
        }
    }
}
