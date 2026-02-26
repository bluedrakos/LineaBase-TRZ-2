<?php

namespace Database\Seeders;

use App\Models\Institucion;
use Illuminate\Database\Seeder;

class InstitucionSeeder extends Seeder
{
    public function run(): void
    {
        Institucion::firstOrCreate(
            ['ins_rut' => '60.806.000-6'],
            [
                'ins_nombre' => 'Casa de Moneda',
                'ins_sigla' => 'CMCH',
                'ins_telefono' => '226805100',
                'ins_correo' => 'sistemas@casamoneda.cl',
                'ins_direccion' => 'Av. Portales 3586',
                'ins_descripcion' => 'Casa moneda',
            ]
        );
    }
}
