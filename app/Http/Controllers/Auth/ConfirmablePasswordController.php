<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\LdapAuth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    public function __construct(protected LdapAuth $ldap) {}

    /**
     * Mostrar vista para confirmar la contraseña.
     */
    public function show(): Response
    {
        return Inertia::render('Auth/ConfirmPassword');
    }

    /**
     * Confirmar contraseña del usuario autenticado.
     */
    public function store(Request $request): RedirectResponse
    {
        $usuario = $request->user();

        $esLdap = $usuario->usu_tipo === 'Interno';

        $credencialesValidas = $esLdap
            ? $this->ldap->authenticate($usuario->usu_ldap, $request->password)
            : Hash::check($request->password, $usuario->usu_password);

        if (! $credencialesValidas) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        $request->session()->put('auth.password_confirmed_at', time());

        return redirect()->intended(route('dashboard'));
    }
}
