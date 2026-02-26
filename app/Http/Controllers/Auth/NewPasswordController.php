<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class NewPasswordController extends Controller
{
    public function create(Request $request)
    {
        return inertia('Auth/ResetPassword', [
            'token' => $request->route('token'),
            'email' => $request->query('email'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => ['required', 'confirmed'],
        ]);

        $registro = DB::table('reestablecer_contrasenas')
            ->where('usu_correo', $request->email)
            ->first();

        if (! $registro || ! hash_equals($registro->token, $request->token)) {
            throw ValidationException::withMessages([
                'email' => ['El token de recuperación es inválido o ha expirado.'],
            ]);
        }

        // Opcional: Verificar vencimiento (ej: 60 minutos)
        $expiracion = Carbon::parse($registro->creado_en)->addMinutes(60);
        if (now()->greaterThan($expiracion)) {
            throw ValidationException::withMessages([
                'email' => ['El enlace de recuperación ha expirado.'],
            ]);
        }

        $usuario = Usuario::where('usu_correo', $request->email)->first();

        if (! $usuario || $usuario->usu_tipo !== 'Externo') {
            throw ValidationException::withMessages([
                'email' => ['Solo usuarios externos pueden cambiar su contraseña.'],
            ]);
        }

        $usuario->usu_password = Hash::make($request->password);
        $usuario->save();

        // Limpia el token después del cambio
        DB::table('reestablecer_contrasenas')->where('usu_correo', $request->email)->delete();

        return redirect()->route('login')->with('status', 'Contraseña actualizada correctamente.');
    }
}
