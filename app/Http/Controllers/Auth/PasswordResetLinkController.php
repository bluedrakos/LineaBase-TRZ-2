<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
use App\Models\Usuario;

class PasswordResetLinkController extends Controller
{
    public function create()
    {
        return inertia('Auth/ForgotPassword');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $usuario = Usuario::where('usu_correo', $request->email)->first();

        if (! $usuario || $usuario->usu_tipo !== 'Externo') {
            throw ValidationException::withMessages([
                'email' => ['No se puede recuperar la contraseña para este tipo de usuario.'],
            ]);
        }

        $token = Str::random(64);

        DB::table('reestablecer_contrasenas')->updateOrInsert(
            ['usu_correo' => $request->email],
            [
                'token' => $token,
                'creado_en' => Carbon::now()
            ]
        );

        // Simula envío de correo o imprime en consola
        // Mail::to($request->email)->send(new TuMailable($token));

        return back()->with('status', 'Enlace de recuperación enviado al correo (simulado)');
    }
}
