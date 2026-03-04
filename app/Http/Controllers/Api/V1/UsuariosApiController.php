<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use App\Http\Resources\UsuarioResource;
use App\Http\Responses\ApiResponse;
use App\Mail\BienvenidaMailable;
use App\Models\Auditoria;
use App\Models\Institucion;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UsuariosApiController extends ApiController
{

    public function index()
    {
        $perPage = (int) request()->integer('per_page', 15);
        $usuarios = Usuario::with('rol')->orderBy('usu_nombre')->paginate($perPage);

        return $this->ok(UsuarioResource::collection($usuarios->getCollection())->resolve(), meta: [
            'current_page' => $usuarios->currentPage(),
            'per_page' => $usuarios->perPage(),
            'total' => $usuarios->total(),
            'last_page' => $usuarios->lastPage(),
        ]);
    }

    public function meta()
    {
        return $this->ok([
            'roles' => Rol::select('rol_id', 'rol_nombre')->get(),
            'instituciones' => Institucion::select('ins_id', 'ins_nombre')->get(),
        ]);
    }

    public function store(StoreUsuarioRequest $request)
    {
        $validated = $request->validated();

        $passwordPlano = config('app.pass_dev') ? 'admin123' : Str::random(12);
        $passwordToken = ($validated['usu_tipo'] === 'Interno') ? null : Str::random(60);
        $cambiarPassword = ($validated['usu_tipo'] === 'Interno') ? 0 : 1;

        $usuario = Usuario::create([
            ...$validated,
            'usu_cargo' => $validated['usu_cargo'] ?? null,
            'usu_analisis' => $validated['usu_analisis'] ?? null,
            'usu_seccion' => $validated['usu_seccion'] ?? null,
            'usu_gerencia' => $validated['usu_gerencia'] ?? null,
            'ins_id' => $validated['ins_id'] ?? null,
            'usu_estado' => 'Habilitado',
            'usu_password' => Hash::make($passwordPlano),
            'usu_passwordToken' => $passwordToken,
            'usu_cambiar_password' => $cambiarPassword,
            'usu_activo' => true,
            'usu_intentos' => 0,
            'usu_instancia' => now(),
        ]);

        $changePasswordLink = $passwordToken ? route('reset.password', ['token' => $passwordToken]) : null;
        Mail::to($usuario->usu_correo)->send(
            new BienvenidaMailable(
                $passwordPlano,
                $usuario->usu_correo,
                $usuario->usu_tipo,
                $usuario->usu_nombre,
                $changePasswordLink
            )
        );

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'POST',
            'aud_accion' => 'usuario.store',
            'aud_descripcion' => 'Creo un usuario',
            'aud_id_afectado' => $usuario->usu_id,
            'aud_datos' => json_encode([
                'usu_nombre' => $usuario->usu_nombre,
                'usu_correo' => $usuario->usu_correo,
            ], JSON_UNESCAPED_UNICODE),
            'aud_ip' => request()->ip(),
        ]);

        return $this->ok((new UsuarioResource($usuario->load('rol', 'institucion')))->resolve(), 'Usuario creado correctamente.', 201);
    }

    public function show(Usuario $usuario)
    {
        $usuario->load([
            'rol.permisos.moduloAccion.modulo.tipoModulo',
            'sesiones' => fn($q) => $q->orderBy('last_activity', 'desc')->limit(10),
            'institucion',
        ]);

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'GET',
            'aud_accion' => 'usuario.show',
            'aud_descripcion' => 'Vio los detalles de un usuario',
            'aud_id_afectado' => $usuario->usu_id,
            'aud_datos' => null,
            'aud_ip' => request()->ip(),
        ]);

        return $this->ok((new UsuarioResource($usuario))->resolve());
    }

    public function update(UpdateUsuarioRequest $request, Usuario $usuario)
    {
        $validated = $request->validated();

        $usuario->update([
            'usu_nombre' => $validated['usu_nombre'],
            'usu_apellidos' => $validated['usu_apellidos'],
            'usu_correo' => $validated['usu_correo'],
            'usu_rut' => $validated['usu_rut'],
            'usu_telefono' => $validated['usu_telefono'],
            'usu_cargo' => $validated['usu_cargo'],
            'usu_tipo' => $validated['usu_tipo'],
            'rol_id' => $validated['rol_id'],
            'usu_analisis' => $validated['usu_analisis'] ?? null,
            'usu_seccion' => $validated['usu_seccion'] ?? null,
            'usu_gerencia' => $validated['usu_gerencia'] ?? null,
            'ins_id' => $validated['ins_id'] ?? null,
        ]);

        if ($validated['usu_tipo'] === 'Interno') {
            $usuario->usu_ldap = explode('@', $validated['usu_correo'])[0];
            $usuario->save();
        }

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'PATCH',
            'aud_accion' => 'usuario.update',
            'aud_descripcion' => 'Actualizo un usuario',
            'aud_id_afectado' => $usuario->usu_id,
            'aud_datos' => json_encode($validated, JSON_UNESCAPED_UNICODE),
            'aud_ip' => request()->ip(),
        ]);

        return $this->ok((new UsuarioResource($usuario->load('rol', 'institucion')))->resolve(), 'Usuario actualizado correctamente.');
    }

    public function destroy(Usuario $usuario)
    {
        $usuarioId = $usuario->usu_id;
        $usuario->delete();

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'DELETE',
            'aud_accion' => 'usuario.destroy',
            'aud_descripcion' => 'Elimino un usuario',
            'aud_id_afectado' => $usuarioId,
            'aud_datos' => null,
            'aud_ip' => request()->ip(),
        ]);

        return $this->ok(null, 'Usuario eliminado correctamente.');
    }

    public function toggleStatus(Usuario $usuario)
    {
        $usuario->usu_activo = !$usuario->usu_activo;
        $usuario->save();

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'PATCH',
            'aud_accion' => 'usuario.toggleStatus',
            'aud_descripcion' => 'Cambio estado activo de usuario',
            'aud_id_afectado' => $usuario->usu_id,
            'aud_datos' => json_encode(['usu_activo' => $usuario->usu_activo], JSON_UNESCAPED_UNICODE),
            'aud_ip' => request()->ip(),
        ]);

        return $this->ok((new UsuarioResource($usuario))->resolve(), 'Estado del usuario actualizado.');
    }

    public function toggleEstado(Usuario $usuario)
    {
        $usuario->usu_estado = $usuario->usu_estado === 'Habilitado'
            ? 'Bloqueado'
            : 'Habilitado';
        $usuario->save();

        Auditoria::create([
            'usu_id' => auth()->id(),
            'aud_metodo' => 'PATCH',
            'aud_accion' => 'usuario.toggleEstado',
            'aud_descripcion' => 'Cambio estado de usuario',
            'aud_id_afectado' => $usuario->usu_id,
            'aud_datos' => json_encode(['usu_estado' => $usuario->usu_estado], JSON_UNESCAPED_UNICODE),
            'aud_ip' => request()->ip(),
        ]);

        return $this->ok((new UsuarioResource($usuario))->resolve(), 'Estado del usuario actualizado.');
    }
}
