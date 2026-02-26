<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUsuarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Obtener ID del usuario desde la ruta (resource route bind)
        $usuario = $this->route('usuario');
        $usuarioId = $usuario->usu_id ?? $usuario;

        return [
            'usu_nombre' => 'required|string|max:255',
            'usu_apellidos' => 'required|string|max:255',
            'usu_correo' => [
                'required',
                'email',
                Rule::unique('usuarios', 'usu_correo')->ignore($usuarioId, 'usu_id'),
            ],
            'usu_rut' => [
                'required',
                'string',
                'max:12',
                Rule::unique('usuarios', 'usu_rut')->ignore($usuarioId, 'usu_id'),
            ],
            'usu_telefono' => 'nullable|string|max:15',
            'usu_cargo' => 'required|string|max:255',
            'rol_id' => 'required|exists:roles,rol_id',
            'usu_tipo' => 'required|in:Interno,Externo',
            'usu_analisis' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('usuarios', 'usu_analisis')->ignore($usuarioId, 'usu_id'),
            ],
            'usu_seccion' => 'nullable|string|max:100',
            'usu_gerencia' => 'nullable|string|max:150',
            'ins_id' => 'nullable|exists:instituciones,ins_id',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $data = $this->all();
            if (($data['usu_tipo'] ?? '') === 'Interno') {
                 // Para usuarios internos, el LDAP se recalcula en el controlador basado en el correo.
            }
        });
    }
}
