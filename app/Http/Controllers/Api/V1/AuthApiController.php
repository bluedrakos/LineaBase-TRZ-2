<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Responses\ApiResponse;
use App\Models\Usuario;
use App\Services\LdapAuth;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthApiController extends ApiController
{

    public function __construct(private readonly LdapAuth $ldap) {}

    public function login(Request $request)
    {
        $request->validate([
            'usuario' => ['required', 'string'],
            'contrasena' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);

        $usuario = $request->input('usuario');
        $password = $request->input('contrasena');
        $deviceName = $request->input('device_name', 'api-client');

        $this->ensureIsNotRateLimited($request, $usuario);

        $user = Usuario::with('rol.permisos.moduloAccion.modulo.tipoModulo')
            ->when(
                str_contains($usuario, '@'),
                fn($query) => $query->where('usu_correo', $usuario),
                fn($query) => $query->where('usu_ldap', $usuario)->orWhere('usu_analisis', $usuario),
            )
            ->first();

        if (!$user || !$this->isValidCredential($user, $password)) {
            RateLimiter::hit($this->throttleKey($request, $usuario));
            if ($user) {
                $user->increment('usu_intentos');
                if ($user->usu_intentos >= 5) {
                    $user->usu_estado = 'Bloqueado';
                    $user->save();
                }
            }
            return $this->fail('Credenciales invalidas.', 422, [
                'usuario' => ['Credenciales invalidas.'],
            ]);
        }

        if (!$user->usu_activo) {
            return $this->fail('Tu cuenta esta desactivada.', 403, [
                'usuario' => ['Cuenta desactivada.'],
            ]);
        }

        if ($user->usu_estado !== 'Habilitado') {
            return $this->fail('Tu cuenta esta bloqueada.', 403, [
                'usuario' => ['Cuenta bloqueada.'],
            ]);
        }

        if ($user->usu_cambiar_password) {
            return $this->fail('Debes cambiar la contrasena antes de continuar.', 409, [
                'password' => ['Cambio de contrasena requerido.'],
            ]);
        }

        RateLimiter::clear($this->throttleKey($request, $usuario));
        $user->usu_intentos = 0;
        $user->save();

        $abilities = $this->resolveAbilities($user);
        $token = $user->createToken($deviceName, $abilities)->plainTextToken;

        return $this->ok([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'usu_id' => $user->usu_id,
                'usu_nombre' => $user->usu_nombre,
                'usu_apellidos' => $user->usu_apellidos,
                'usu_correo' => $user->usu_correo,
                'rol' => $user->rol?->rol_nombre,
            ],
            'sidebar' => $user->rol?->navegacionSidebar() ?? [],
            'permisos' => $this->resolvePermissions($user),
        ], 'Login exitoso.');
    }

    public function me(Request $request)
    {
        $user = $request->user()->loadMissing('rol.permisos.moduloAccion.modulo.tipoModulo');

        return $this->ok([
            'user' => [
                'usu_id' => $user->usu_id,
                'usu_nombre' => $user->usu_nombre,
                'usu_apellidos' => $user->usu_apellidos,
                'usu_correo' => $user->usu_correo,
                'rol' => $user->rol?->rol_nombre,
            ],
            'sidebar' => $user->rol?->navegacionSidebar() ?? [],
            'permisos' => $this->resolvePermissions($user),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return $this->ok(null, 'Sesion cerrada correctamente.');
    }

    /**
     * Envia enlace de recuperacion de contrasena o codigo OTP.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        $user = Usuario::where('usu_correo', $request->email)->first();
        if (!$user) {
            return $this->fail('No se encuentra el usuario registrado.', 404);
        }

        $token = ($user->usu_tipo === 'Interno') ? null : Str::random(60);
        $expiracion = ($user->usu_tipo === 'Interno') ? null : now()->addHours(1);
        
        $user->update([
            'usu_passwordToken' => $token,
            'usu_expiracionToken' => $expiracion,
        ]);

        // En una API, el frontend maneja la URL. El backend solo genera el token.
        // Si el usuario es externo, se enviaria el mail con el token.
        if ($token) {
            // Mail::to($user->usu_correo)->send(new PasswordResetMail(...));
        }

        return $this->ok(['token' => $token], 'Se ha procesado su solicitud de recuperacion.');
    }

    /**
     * Valida el token y envia el codigo OTP al correo.
     */
    public function sendOTP(Request $request)
    {
        $request->validate(['token' => 'required|string']);
        
        $user = Usuario::where('usu_passwordToken', $request->token)
            ->where('usu_expiracionToken', '>=', now())
            ->first();

        if (!$user) {
            return $this->fail('Token no valido o expirado.', 422);
        }

        $tokenOTP = rand(100000, 999999);
        $user->usu_otp = $tokenOTP;
        $user->usu_otp_expiracion = now()->addMinutes(10);
        $user->save();

        // Mail::to($user->usu_correo)->send(new TokenOTPMail($user->usu_correo, $tokenOTP));

        return $this->ok(null, 'Codigo de verificacion enviado a su correo.');
    }

    /**
     * Valida el OTP y cambia la contrasena.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'otp' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = Usuario::where('usu_passwordToken', $request->token)
            ->where('usu_expiracionToken', '>=', now())
            ->first();

        if (!$user) {
            return $this->fail('Token no valido o expirado.', 422);
        }

        if ($user->usu_otp !== $request->otp || $user->usu_otp_expiracion < now()) {
            return $this->fail('El codigo OTP es incorrecto o ha expirado.', 422);
        }

        $user->usu_password = Hash::make($request->password);
        $user->usu_passwordToken = null;
        $user->usu_expiracionToken = null;
        $user->usu_otp = null;
        $user->usu_otp_expiracion = null;
        $user->usu_cambiar_password = false;
        $user->save();

        return $this->ok(null, 'Contrasena actualizada exitosamente.');
    }

    private function isValidCredential(Usuario $user, string $password): bool
    {
        if ($user->usu_tipo === 'Interno') {
            return $this->ldap->attempt($user->usu_ldap, $password);
        }

        return Hash::check($password, $user->usu_password);
    }

    private function ensureIsNotRateLimited(Request $request, string $usuario): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey($request, $usuario), 5)) {
            return;
        }

        event(new Lockout($request));

        $seconds = RateLimiter::availableIn($this->throttleKey($request, $usuario));
        throw ValidationException::withMessages([
            'usuario' => [trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ])],
        ]);
    }

    private function throttleKey(Request $request, string $usuario): string
    {
        return Str::transliterate(Str::lower($usuario) . '|' . $request->ip());
    }

    private function resolvePermissions(Usuario $user): array
    {
        $permisos = [];
        foreach ($user->rol?->permisos ?? [] as $permiso) {
            $modSlug = $permiso->moduloAccion?->modulo?->mod_slug;
            $accSlug = $permiso->moduloAccion?->accion?->acc_slug;
            $icono = $permiso->moduloAccion?->accion?->acc_icono;
            if (!$modSlug || !$accSlug) {
                continue;
            }
            $permisos[$modSlug][] = [
                'accion' => $accSlug,
                'icono' => $icono,
            ];
        }

        foreach ($permisos as $slug => $acciones) {
            $permisos[$slug] = collect($acciones)
                ->unique(fn($item) => $item['accion'])
                ->values()
                ->all();
        }

        return $permisos;
    }

    private function resolveAbilities(Usuario $user): array
    {
        $abilities = ['*'];
        foreach ($user->rol?->permisos ?? [] as $permiso) {
            $modSlug = $permiso->moduloAccion?->modulo?->mod_slug;
            $accSlug = $permiso->moduloAccion?->accion?->acc_slug;
            if ($modSlug && $accSlug) {
                $abilities[] = "{$modSlug}:{$accSlug}";
            }
        }

        return array_values(array_unique($abilities));
    }
}
