<?php

namespace App\Http\Controllers;

use App\Mail\BienvenidaMailable;
use App\Mail\PasswordResetMail;
use App\Mail\TokenOTPMail;
use App\Models\Auditoria;
use Illuminate\Support\Facades\Mail;
use App\Models\Usuario;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Http\Resources\UsuarioResource;

class UsuarioController extends Controller
{
    public function index()
    {
        $usuarios = Usuario::with('rol')->orderBy('usu_nombre')->get();
        $roles = Rol::select('rol_id', 'rol_nombre')->get();
            $instituciones = \App\Models\Institucion::select('ins_id', 'ins_nombre')->get();
            return inertia('Admin/Usuarios/Index', [
                'usuarios' => UsuarioResource::collection($usuarios)->resolve(),
                'roles' => $roles,
                'instituciones' => $instituciones,
            ]);
    }

    public function create() {}

    public function store(StoreUsuarioRequest $request)
    {
        $validated = $request->validated();

        // En entorno local se usa una contraseña por defecto para facilitar pruebas.
        $passwordPlano = config('app.pass_dev')
            ? 'admin123'
            : Str::random(12);

        $passwordToken = ($validated['usu_tipo'] === 'Interno') ? null : Str::random(60);
        $cambiarPassword = ($validated['usu_tipo'] === 'Interno') ? 0 : 1;

        $usuario = Usuario::create([
              ...$validated,
            'usu_cargo'      => $validated['usu_cargo'] ?? null,
            'usu_analisis'   => $validated['usu_analisis'] ?? null,
            'usu_seccion'    => $validated['usu_seccion'] ?? null,
            'usu_gerencia'   => $validated['usu_gerencia'] ?? null,
            'ins_id'         => $validated['ins_id'] ?? null,
            'usu_estado'     => 'Habilitado',
            'usu_password'   => Hash::make($passwordPlano),
            'usu_passwordToken' => $passwordToken,
            'usu_cambiar_password' => $cambiarPassword,
            'usu_activo'     => true,
            'usu_intentos'   => 0,
            'usu_instancia'   => now(),
        ]);
        
        $changePasswordLink = $passwordToken ? route('reset.password', ['token' => $passwordToken]) : null;

        Mail::to($usuario->usu_correo)->send(new BienvenidaMailable($passwordPlano, $usuario->usu_correo, $usuario->usu_tipo, $usuario->usu_nombre, $changePasswordLink));

        if (!$passwordToken) {
            return redirect()
                ->route('admin.usuarios.index')
                ->with('success', 'Usuario creado correctamente. Contraseña: ' . ($passwordPlano));
        }

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', 'Usuario creado correctamente. Contraseña: ' . ($passwordPlano));
    }

    public function show(Usuario $usuario)
    {
        $ip = request()->ip();
        $usuario->load([
            'rol.permisos.moduloAccion.modulo.tipoModulo',
            'sesiones' => fn($q) => $q->orderBy('last_activity', 'desc')->limit(10),
            'institucion'
        ]);

        Auditoria::create([
            'usu_id'           => auth()->id(),
            'aud_metodo'       => 'GET',
            'aud_accion'       => ' usuario.show',
            'aud_descripcion'  => ' Vio los detalles de un usuario',
            'aud_id_afectado'  => $usuario->usu_id,
            'aud_datos'        => null,
            'aud_ip'           => $ip,
        ]);

        return inertia('Admin/Usuarios/Show', [
            'usuario' => (new UsuarioResource($usuario))->resolve(),
        ]);
    }

    public function edit(Usuario $usuario)
    {
        $roles = Rol::all();
        $ip = request()->ip();
        return inertia('Admin/Usuarios/Index', [
            'usuarioEdit' => $usuario,
            'roles'   => $roles,
        ]);
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

        if ($validated['usu_tipo'] == 'Interno') {
            $usuario->usu_ldap = explode('@', $validated['usu_correo'])[0];
            $usuario->save();
        }

        return redirect()->route('admin.usuarios.index');
    }

    public function destroy(Usuario $usuario)
    {
        $usuario->delete();

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }

    public function toggleStatus($id)
    {
        $user = Usuario::findOrFail($id);
        $user->usu_activo = !$user->usu_activo;
        $user->save();


        return redirect()->back()->with('success', 'Estado del usuario actualizado.');
    }

    public function toggleEstado($id)
    {
        $user = Usuario::findOrFail($id);
        $user->usu_estado = $user->usu_estado === 'Habilitado'
            ? 'Bloqueado'
            : 'Habilitado';
        $user->save();


        return redirect()->back()->with('success', 'Estado del usuario actualizado.');
    }

    public function checkearTokenPassword($token)
    {
        $user = Usuario::where('usu_passwordToken', $token)->first();
        if (!$user) {
            return redirect()->route('login')->with(['error' => 'Token no válido o expiró'])->withInput();
        }

        return inertia('ResetPassword/NuevaPassword', ['token' => $token]);
    }

    public function reestablecerPassword(Request $request, $token)
    {
        $user = Usuario::where('usu_passwordToken', $token)->first();
        if (!$user) {
            return redirect()->route('login')->with(['error' => 'Token no válido o expiró']);
        }
        $request->validate([
            'password' => 'required|min:8|string|confirmed'
        ]);

        $user->usu_password = Hash::make($request->password);
        $user->usu_passwordToken = null;
        $user->usu_cambiar_password = false;
        $user->save();

        return redirect()->route('login')->with('success', 'Contraseña cambiada con éxito, inicia sesión con tus nuevas credenciales');
    }

    public function mostrarOlvidePassword()
    {
        return inertia('ResetPassword/OlvidePassword');
    }

    public function enviarResetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);
        $user = Usuario::where('usu_correo', $request->email)->first();
        if (!$user) {
            return redirect()->route('email.forgot.password')->with(['error' => 'No se encuentra el usuario registrado']);
        }

        $token = ($user->usu_tipo === 'Interno') ? null : Str::random(60);
        $expiracion = ($user->usu_tipo === 'Interno') ? null : now()->addHours(1);
        $user->update([
            'usu_passwordToken' => $token,
            'usu_expiracionToken' => $expiracion,
        ]);

        $link = $token ? route('email.reset.password', ['token' => $token]) : null;

        Mail::to($user->usu_correo)->send(new PasswordResetMail($user->usu_correo, $user->usu_tipo, $link));
        return redirect()->route('email.forgot.password')->with('success', 'Se ha enviado un enlace de recuperación a tu correo.');
    }

    public function mostrarResetPassword($token)
    {

        $user = Usuario::where('usu_passwordToken', $token)
            ->where('usu_expiracionToken', '>=', now())
            ->first();
        if (!$user) {
            return redirect()->route('login')->with(['error' => 'Token no válido o expiró']);
        }

        return inertia('ResetPassword/FormOlvidarPassword', ['token' => $token]);
    }

    public function resetPassword(Request $request, $token)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
            'otp' => 'min:6',
        ]);

        $user = Usuario::where('usu_passwordToken', $token)
            ->where('usu_expiracionToken', '>=', now())
            ->first();

        if (!$user) {
            return redirect()->route('login')->with(['error' => 'Token no válido o expiró']);
        }

        if (!$request->filled('otp')) {
            $tokenOTP = rand(100000, 999999);
            $expiracionOTP = now()->addMinutes(5);

            $user->usu_otp = $tokenOTP;
            $user->usu_otp_expiracion = $expiracionOTP;
            $user->save();

            Mail::to($user->usu_correo)->send(new TokenOTPMail($user->usu_correo, $tokenOTP));
            return back()->with('success', 'Te enviamos un código a tu correo');
        }

        if ($user->usu_otp != $request->otp || $user->usu_otp_expiracion < now()) {
            return back()->with('error', 'El codigo no coincide o expiró, intentalo nuevamente.');
        }

        return redirect()->route('login')->with(['success' => 'Contraseña guardada con éxito']);
    }

    public function mandarResetPassword(Request $request, $token)
    {
        $ip = request()->ip();
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);
        $user = Usuario::where('usu_passwordToken', $token)
            ->where('usu_expiracionToken', '>=', now())
            ->first();

        if (!$user) {
            return back()->with('error', 'El token no es válido o ya expiró. Solicita uno nuevo.');
        }
        if ($user->usu_otp != $request->otp || $user->usu_otp_expiracion < now()) {
            return back()->with('error', 'El código no coincide o expiró, intentalo nuevamente.');
        }

        if ($user->usu_otp == $request->otp) {
            $user->usu_password = Hash::make($request->password);
            $user->usu_passwordToken = null;
            $user->usu_expiracionToken = null;
            $user->usu_otp = null;
            $user->usu_otp_expiracion = null;
            $user->save();

            $user->usu_otp_expiracion = null;
            $user->save();


            return redirect()->route('login')->with(['success' => 'Contraseña guardada con éxito']);
        }
    }

    public function reenviarOTP($token)
    {

        $user = Usuario::where('usu_passwordToken', $token)->first();
        $tokenOTP = rand(100000, 999999);
        $expiracionOTP = now()->addMinutes(5);

        $user->usu_otp = $tokenOTP;
        $user->usu_otp_expiracion = $expiracionOTP;
        $user->save();

        Mail::to($user->usu_correo)->send(new TokenOTPMail($user->usu_correo, $tokenOTP));

        return back()->with('success', 'Se envió un nuevo código a tu correo');
    }
}
