<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accion extends Model
{
    use HasFactory;
    // aaaa
    protected $table = 'acciones';
    protected $primaryKey = 'acc_id';

    protected $fillable = [
        'acc_nombre',
        'acc_codigo',
        'acc_activo',
    ];

    protected $casts = [
        'acc_activo' => 'boolean',
    ];

    /**
     * Relación: una acción puede estar asignada a muchos módulos.
     */
    public function moduloAcciones()
    {
        return $this->hasMany(ModuloAccion::class, 'acc_id');
    }

    /**
     * Relación: una acción puede estar asignada a muchos roles a través de modulo_acciones.
     */
    public function roles()
    {
        return $this->hasManyThrough(
            RolModuloAccion::class,
            ModuloAccion::class,
            'acc_id',
            'sma_id',
            'acc_id',
            'sma_id'
        );
    }
}
