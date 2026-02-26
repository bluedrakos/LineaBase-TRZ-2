<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class PasswordController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        if ($user->usu_tipo !== 'Externo') {
            throw ValidationException::withMessages([
                'password' => ['Solo los usuarios externos pueden cambiar su contraseña.'],
            ]);
        }

        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->usu_password = Hash::make($request->password);
        $user->save();

        return back()->with('status', 'Contraseña actualizada correctamente.');
    }
}
