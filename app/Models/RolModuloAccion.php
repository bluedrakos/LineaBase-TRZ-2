<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RolModuloAccion extends Model
{
    protected $table = 'rol_modulo_acciones';
    protected $primaryKey = 'rma_id';
    public $timestamps = false;

    protected $fillable = ['rol_id', 'mac_id'];

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }

    public function moduloAccion()
    {
        return $this->belongsTo(ModuloAccion::class, 'mac_id');
    }
}
