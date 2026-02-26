<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Services\LdapAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller {
    protected LdapAuth $ldap;

    public function __construct( LdapAuth $ldap ) {
        $this->ldap = $ldap;
    }

    public function store( Request $request ) {

        // Validación del formulario
        $request->validate( [
            'usuario'    => [ 'required', 'string' ],
            'contrasena' => [ 'required', 'string' ],
        ] );

        $usuario  = $request->input( 'usuario' );
        $password = $request->input( 'contrasena' );

        // Prevención de fuerza bruta por rate limiting
        $this->ensureIsNotRateLimited( $request, $usuario );

        // Buscar usuario según tipo (externo por email, interno por LDAP o Análisis)
        if ( str_contains( $usuario, '@' ) ) {
            $user = Usuario::with( 'rol.permisos.moduloAccion.modulo.tipoModulo' )
                ->where( 'usu_correo', $usuario )
                ->first();
        } else {
            $user = Usuario::with( 'rol.permisos.moduloAccion.modulo.tipoModulo' )
                ->where( 'usu_ldap', $usuario )
                ->orWhere('usu_analisis', $usuario)
                ->first();
        }

        // Verificar estado del usuario ANTES de validar credenciales
        if ( $user && !$user->usu_activo ) {
            throw ValidationException::withMessages( [
                'usuario' => [ 'Tu cuenta está desactivada.' ],
            ] );
        }

        if ( $user && $user->usu_estado !== 'Habilitado' ) {
            throw ValidationException::withMessages( [
                'usuario' => [ 'Tu cuenta está bloqueada debido a múltiples intentos fallidos.' ],
            ] );
        }

        // Validar credenciales según tipo de usuario
        $credencialesValidas = false;

        if ($user) {
            Log::info("LoginController: Usuario encontrado: {$user->usu_id}, Tipo: {$user->usu_tipo}");
            if ($user->usu_tipo === 'Interno') {
                // ...
                Log::info("LoginController: Intentando auth LDAP para {$user->usu_ldap}");
                $credencialesValidas = $this->ldap->attempt( $user->usu_ldap, $password );
                Log::info("LoginController: Resultado LDAP: " . ($credencialesValidas ? 'Exito' : 'Fallo'));
            } else {
                // ...
                Log::info("LoginController: Intentando auth Hash");
                $credencialesValidas = Hash::check( $password, $user->usu_password );
            }
        } else {
            Log::warning("LoginController: Usuario no encontrado para input: {$usuario}");
        }

        // Si las credenciales son inválidas, incrementar intentos y bloquear si corresponde
        if ( !$credencialesValidas ) {
            RateLimiter::hit( $this->throttleKey( $request, $usuario ) );
            if ( $user ) {
                $user->increment( 'usu_intentos' );
                // Bloqueo automático tras 5 intentos fallidos (ambos tipos de usuario)
                if ( $user->usu_intentos >= 5 ) {
                    $user->usu_estado = 'Bloqueado';
                    $user->save();
                    throw ValidationException::withMessages( [
                        'usuario' => [ 'Tu cuenta está bloqueada debido a múltiples intentos fallidos.' ],
                    ] );
                }
            }
            throw ValidationException::withMessages( [
                'usuario' => [ 'Credenciales inválidas.' ],
            ] );
        }

        // Credenciales válidas: restablecer contador de intentos
        RateLimiter::clear( $this->throttleKey( $request, $usuario ) );

        // Registro de autenticación (sin datos personales)
        Log::info( 'Usuario autenticado', [
            'usu_id' => $user->usu_id,
            'rol_id' => $user->rol_id,
        ] );

        // Si debe cambiar contraseña, redirigir al flujo de reset
        if ( $user->usu_cambiar_password ) {
            return redirect()->route( 'reset.password', [ 'token' => $user->usu_passwordToken ] );
        }

        // Autenticar y redirigir al dashboard
        Auth::login( $user, $request->boolean( 'remember' ) );
        $user->usu_intentos = 0;
        $user->save();
        return redirect()->intended( route( 'dashboard' ) );
    }

    protected function ensureIsNotRateLimited( Request $request, string $usuario ): void {
        if ( ! RateLimiter::tooManyAttempts( $this->throttleKey( $request, $usuario ), 5 ) ) {
            return;
        }

        event( new Lockout( $request ) );

        $seconds = RateLimiter::availableIn( $this->throttleKey( $request, $usuario ) );

        throw ValidationException::withMessages( [
            'usuario' => trans( 'auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil( $seconds / 60 ),
            ] ),
        ] );
    }

    protected function throttleKey( Request $request, string $usuario ): string {
        return Str::transliterate( Str::lower( $usuario ) . '|' . $request->ip() );
    }

    public function create() {

        return inertia( 'Auth/Login', [
            // 'canResetPassword' => route( 'password.request', [], false ),
            'status' => session( 'status' ),
        ] );
    }

    public function destroy( Request $request ) {
        Auth::guard( 'web' )->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        $cookie = cookie()->forget( 'remember_token' );
        return redirect( '/' )->withCookie( $cookie );
    }
}
