<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsuarioResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'usu_id' => $this->usu_id,
            'usu_nombre' => $this->usu_nombre,
            'usu_apellidos' => $this->usu_apellidos,
            'usu_rut' => $this->usu_rut,
            'usu_correo' => $this->usu_correo,
            'usu_cargo' => $this->usu_cargo,
            'usu_tipo' => $this->usu_tipo,
            'usu_estado' => $this->usu_estado,
            'usu_activo' => (bool) $this->usu_activo,
            'rol_id' => $this->rol_id,
            'rol' => $this->whenLoaded('rol'),
            'ins_id' => $this->ins_id,
            'institucion' => $this->whenLoaded('institucion'),
            'usu_ldap' => $this->usu_ldap,
            'usu_telefono' => $this->usu_telefono,
            'usu_gerencia' => $this->usu_gerencia,
            'usu_seccion' => $this->usu_seccion,
            'usu_analisis' => $this->usu_analisis,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'usu_ultimo_acceso' => $this->usu_ultimo_acceso,
            'usu_ip_acceso' => $this->usu_ip_acceso,
            'sesiones' => $this->whenLoaded('sesiones'),
        ];
    }
}
