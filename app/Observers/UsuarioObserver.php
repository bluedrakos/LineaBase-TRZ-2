<?php

namespace App\Observers;

use App\Models\Usuario;
use App\Models\Auditoria;

class UsuarioObserver
{

    public function created(Usuario $usuario): void
    {
        Auditoria::create([
            'usu_id'           => auth()->id(),
            'aud_metodo'       => 'POST',
            'aud_accion'       => 'usuario.store',
            'aud_descripcion'  => 'Creó usuario',
            'aud_id_afectado'  => $usuario->usu_id,
            'aud_datos'        => json_encode([
                'usu_nombre'    => $usuario->usu_nombre,
                'usu_apellidos' => $usuario->usu_apellidos,
                'usu_cargo'     => $usuario->usu_cargo,
                'usu_rut'       => $usuario->usu_rut,
            ]),
            'aud_ip'           => request()->ip(),
        ]);
    }


    public function updated(Usuario $usuario): void
    {
        // Replicamos la lógica de auditoría del controlador para detectar cambios de estado.
        // Asumimos que es una actualización genérica si no se detecta un cambio específico.
        
        $accion = 'usuario.update';
        $descripcion = 'Editó un usuario';
        
        if ($usuario->isDirty('usu_activo')) {
             $accion = 'usuario.toggleStatus';
             $descripcion = $usuario->usu_activo ? 'Activó un usuario' : 'Desactivó un usuario';
        }

        if ($usuario->isDirty('usu_estado')) {
             $accion = 'usuario.toggleEstado';
             $descripcion = $usuario->usu_estado == 'Habilitado' ? 'Habilitó un usuario' : 'Deshabilitó un usuario';
        }
        
        // Si es cambio de password por recuperación, la lógica original estaba en 'mandarResetPassword'
        // Podríamos detectarlo si 'usu_password' isDirty, pero el controller lo hacía explícito.
        // Para simplificar y no romper nada con magia, en este primer paso, el Observer cubrirá
        // las actualizaciones estándar de datos.
        
        Auditoria::create([
            'usu_id'           => auth()->id(),
            'aud_metodo'       => 'PATCH', // Asumimos PATCH/PUT
            'aud_accion'       => $accion,
            'aud_descripcion'  => $descripcion,
            'aud_id_afectado'  => $usuario->usu_id,
            'aud_datos'        => json_encode($usuario->getDirty()), // Guardamos lo que cambió
            'aud_ip'           => request()->ip(),
        ]);
    }


    public function deleted(Usuario $usuario): void
    {
        Auditoria::create([
            'usu_id'           => auth()->id(),
            'aud_metodo'       => 'DELETE',
            'aud_accion'       => 'usuario.destroy',
            'aud_descripcion'  => 'Eliminó un usuario',
            'aud_id_afectado'  => $usuario->usu_id,
            'aud_datos'        => json_encode($usuario->toArray()),
            'aud_ip'           => request()->ip(),
        ]);
    }

    /**
     * Handle the Usuario "restored" event.
     */
    public function restored(Usuario $usuario): void
    {
        //
    }

    /**
     * Handle the Usuario "force deleted" event.
     */
    public function forceDeleted(Usuario $usuario): void
    {
        //
    }
}
