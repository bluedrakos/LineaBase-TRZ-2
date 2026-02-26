<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Modulo;
use App\Models\RolModuloAccion;

class TipoModulo extends Model
{
    use HasFactory;

    protected $table = 'tipo_modulo';
    protected $primaryKey = 'tmo_id';

    protected $fillable = [
        'tmo_nombre',
        'tmo_slug',
        'tmo_icono',
        'tmo_orden',
        'tmo_activo',
        'tmo_creado_por',
        'tmo_actualizado_por',
    ];

    protected $casts = [
        'tmo_activo' => 'boolean',
    ];

     /**
     * Relación: Un Tipo de módulo tiene muchos modulos asociados.
     */    
    public function modulos()
    {
        return $this->hasMany(Modulo::class, 'tmo_id');
    }

}
