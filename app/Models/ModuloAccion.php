<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Modulo;
use App\Models\Accion;
use App\Models\RolModuloAccion;

class ModuloAccion extends Model
{
    protected $table = 'modulo_acciones';
    protected $primaryKey = 'mac_id';
    
    public $timestamps = false;

    protected $fillable = [
        'mod_id',
        'acc_id',
    ];

    /**
     * Relación: Las acciones de un modulo están asociadas a un modulo.
     */   
    public function modulo()
    {
        return $this->belongsTo(Modulo::class, 'mod_id');
    }


    /**
     * Relación: Una acción está asociada a un módulo.
     */   
    public function accion()
    {
        return $this->belongsTo(Accion::class, 'acc_id');
    }

    public function rolesModuloAcciones()
    {
        return $this->hasMany(RolModuloAccion::class, 'mac_id');
    }
}
