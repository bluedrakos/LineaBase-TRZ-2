<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación para la solicitud.
     */
    public function rules(): array
    {
        return [
            'usu_nombre'     => 'required|string|max:50',
            'usu_apellidos'  => 'required|string|max:100',
            'usu_rut'        => 'required|string|max:12|unique:usuarios,usu_rut',
            'usu_correo'     => 'required|email|max:100|unique:usuarios,usu_correo',
            'usu_telefono'   => 'nullable|string|max:20',
            'usu_cargo'      => 'nullable|string',
            'usu_tipo'       => 'required|in:Interno,Externo',
            'usu_ldap'       => 'nullable|string|unique:usuarios,usu_ldap',
            'usu_analisis'   => 'nullable|string|max:50|unique:usuarios,usu_analisis',
            'usu_seccion'    => 'nullable|string|max:100',
            'usu_gerencia'   => 'nullable|string|max:150',
            'rol_id'         => 'required|exists:roles,rol_id',
            'ins_id'         => 'nullable|exists:instituciones,ins_id',
        ];
    }


    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $data = $this->all();
            if (($data['usu_tipo'] ?? '') === 'Interno' && empty($data['usu_ldap'])) {
                $validator->errors()->add('usu_ldap', 'El campo LDAP es obligatorio para usuarios internos.');
            }
        });
    }

    public function messages()
    {
        return [
            'usu_rut.unique' => 'El RUT ya se encuentra registrado.',
            'usu_correo.unique' => 'El correo electrónico ya está en uso.',
            'usu_ldap.unique' => 'El usuario LDAP ya está registrado.',
            'usu_analisis.unique' => 'El número de análisis ya está asignado a otro usuario.',
        ];
    }
}
