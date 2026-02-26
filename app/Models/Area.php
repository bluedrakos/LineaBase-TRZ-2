<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    protected $table = 'areas';
    protected $primaryKey = 'area_id';
    public $timestamps = false;
    protected $fillable = [
        'area_nombre',
        'area_descripcion',
    ];

    public function roles()
    {
        return $this->hasMany(Rol::class, 'area_id', 'area_id');
    }

    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'area_id', 'area_id');
    }
}
