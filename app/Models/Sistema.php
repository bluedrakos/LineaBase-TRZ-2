<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sistema extends Model
{
    protected $table = 'sistemas';
    protected $primaryKey = 'sis_id';
    public $timestamps = true;
    protected $fillable = [
        'sis_tipo',
        'sis_nombre',
        'sis_descripcion',
        'sis_valor',
    ];
}
