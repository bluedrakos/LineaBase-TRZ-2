<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ModuloAccion;
use App\Models\RolModuloAccion;
use App\Models\GrupoMenu;


class Modulo extends Model
{
    use HasFactory;

    protected $table = 'modulos';
    protected $primaryKey = 'mod_id';
    public $incrementing = true;  
    protected $keyType = 'int';

    protected $fillable = [
        'mod_nombre',
        'mod_codigo',
        'mod_slug',
        'mod_icono',
        'mod_orden',
        'mod_activo',
        'tmo_id',
        'gme_id',
        'mod_padre_id',
        'mod_directorio',
        'mod_creado_por',
        'mod_actualizado_por',
    ];

    protected $casts = [
        'mod_activo' => 'boolean',
    ];

    /**
     * Relación: Módulo pertenece a un tipo de módulo.
     */
    public function tipoModulo()
    {
        return $this->belongsTo(TipoModulo::class, 'tmo_id');
    }

    /**
     * Relación: Módulo pertenece a un grupo del menú.
     */
    public function grupoMenu()
    {
        return $this->belongsTo(GrupoMenu::class, 'gme_id');
    }

    /**
     * Relación: Módulo padre (jerárquico).
     */
    public function padre()
    {
        return $this->belongsTo(Modulo::class, 'mod_padre_id');
    }

    /**
     * Relación: Submódulos hijos.
     */
    public function hijos()
    {
        return $this->hasMany(Modulo::class, 'mod_padre_id');
    }

    /**
     * Relación: Un módulo tiene muchas acciones definidas.
     */
    public function moduloAcciones()
    {
        return $this->hasMany(ModuloAccion::class, 'mod_id');
    }

    /**
     * Relación: Un Módulo tiene muchos permisos asignados a roles.
     */
    public function permisos()
    {
        return $this->hasManyThrough(
            RolModuloAccion::class,  // tabla final
            ModuloAccion::class,     // tabla intermedia
            'mod_id',                // FK tabla intermedia
            'mac_id',                // FK tabla final
            'mod_id',                // PK tabla final
            'mac_id'                 // PK tabla intermedia
        );
    }
}
