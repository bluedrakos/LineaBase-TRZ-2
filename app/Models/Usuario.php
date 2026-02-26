<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Rol;
use App\Models\Sesion;

class Usuario extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $primaryKey = 'usu_id';

    protected $fillable = [
        'usu_estado',
        'usu_rut',
        'usu_ldap',
        'usu_password',
        'usu_tipo',
        'usu_nombre',
        'usu_apellidos',
        'usu_avatar',
        'usu_cargo',
        'usu_correo',
        'usu_telefono',
        'usu_terminos',
        'usu_intentos',
        'usu_acceso',
        'usu_instancia',
        'usu_activo',
        'rol_id',
        'usu_passwordToken',
        'usu_expiracionToken',
        'usu_cambiar_password',
        'usu_otp',
        'usu_otp_expiracion',
        'ins_id',
        'area_id',
        'usu_analisis',
        'usu_gerencia',
    ];


    protected $hidden = [
        'usu_password',
        'remember_token',
    ];

    protected $casts = [
        'usu_acceso' => 'datetime',
        'usu_instancia' => 'datetime',
        'usu_activo' => 'boolean',
        'usu_password' => 'hashed',
    ];

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }

    public function institucion()
    {
        return $this->belongsTo(Institucion::class, 'ins_id');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }


    public function sesiones()
    {
        return $this->hasMany(Sesion::class, 'user_id', 'usu_id');
    }
    public function getAuthIdentifierName()
    {
        return 'usu_id';
    }


}
