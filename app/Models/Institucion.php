<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Institucion extends Model
{
    protected $table = 'instituciones';
    protected $primaryKey = 'ins_id';

    protected $fillable = [
        'ins_instancia',
        'ins_nombre',
        'ins_rut',
        'ins_sigla',
        'ins_direccion',
        'ins_telefono',
        'ins_correo',
        'ins_descripcion',
    ];

    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'ins_id', 'ins_id');
    }
}
