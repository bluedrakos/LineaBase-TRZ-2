<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auditoria extends Model
{
    protected $table = 'auditorias';
    protected $primaryKey = 'aud_id';
    protected $fillable = [
        'usu_id',
        'aud_ip',
        'aud_metodo',
        'aud_accion',
        'aud_descripcion',
        'aud_id_afectado',
        'aud_datos',
        'created_at',
        'updated_at'

    ];


    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usu_id', 'usu_id');
    }
}
