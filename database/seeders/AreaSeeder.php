<?php

namespace Database\Seeders;

use App\Models\Area;
use Illuminate\Database\Seeder;

class AreaSeeder extends Seeder
{
    public function run(): void
    {
        $areas = [
            [
                'area_nombre' => 'Produccion',
                'area_descripcion' => 'Area principal de produccion.',
            ],
            [
                'area_nombre' => 'Pruebas',
                'area_descripcion' => 'Area de pruebas y validaciones.',
            ],
        ];

        foreach ($areas as $area) {
            Area::updateOrCreate(
                ['area_nombre' => $area['area_nombre']],
                [
                    'area_descripcion' => $area['area_descripcion'],
                ]
            );
        }
    }
}
