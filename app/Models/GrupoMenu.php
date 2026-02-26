<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrupoMenu extends Model
{
    use HasFactory;

    protected $table = 'grupo_menu';
    protected $primaryKey = 'gme_id';

    protected $fillable = [
        'gme_nombre',
        'gme_slug',
        'gme_orden',
        'gme_activo',
    ];

    protected $casts = [
        'gme_activo' => 'boolean',
    ];

    // Relación: un grupo tiene muchos módulos
    public function modulos()
    {
        return $this->hasMany(Modulo::class, 'gme_id');
    }
}
